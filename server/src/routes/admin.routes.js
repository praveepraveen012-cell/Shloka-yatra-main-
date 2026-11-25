import { Router } from 'express';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import prisma from '../prisma.js';
import { authenticateToken, requireAdmin, requireRole } from '../middleware/auth.js';

const router = Router();

// Apply auth to all admin endpoints
router.use(authenticateToken);
router.use(requireAdmin);

// 1. GET Dashboard Metrics Overview (Calculated strictly from live DB records)
router.get('/dashboard-stats', async (req, res, next) => {
  try {
    const totalBookings = await prisma.booking.count();
    const newBookings = await prisma.booking.count({ where: { status: 'PENDING' } });
    const confirmedBookings = await prisma.booking.count({ where: { status: 'CONFIRMED' } });
    const pendingBookings = await prisma.booking.count({ where: { status: 'PENDING' } });
    const cancelledBookings = await prisma.booking.count({ where: { status: 'CANCELLED' } });

    // Total registered devotees: count of registered travellers
    const totalTravellers = await prisma.traveller.count();
    const totalMembers = await prisma.member.count();

    // Total amount collected: sum of all successful payments
    const successfulPayments = await prisma.payment.findMany({
      where: { status: 'SUCCESS' },
      select: { amount: true },
    });
    const totalAmountCollected = successfulPayments.reduce((sum, p) => sum + p.amount, 0);

    // Pending payments: for non-cancelled bookings, booking.totalAmount - (sum of successful payments for that booking)
    const activeBookings = await prisma.booking.findMany({
      where: { status: { not: 'CANCELLED' } },
      include: {
        payments: {
          where: { status: 'SUCCESS' },
          select: { amount: true },
        },
      },
    });

    let pendingPaymentsAmount = 0;
    for (const b of activeBookings) {
      const paid = b.payments.reduce((sum, p) => sum + p.amount, 0);
      const diff = b.totalAmount - paid;
      if (diff > 0) {
        pendingPaymentsAmount += diff;
      }
    }

    // Refunds processed: sum of processed refunds
    const processedRefunds = await prisma.refund.findMany({
      where: { status: 'PROCESSED' },
      select: { netRefundAmount: true },
    });
    const refundsProcessed = processedRefunds.reduce((sum, r) => sum + r.netRefundAmount, 0);

    // Departures & occupancy
    const departures = await prisma.departure.findMany({ orderBy: { batchNumber: 'asc' } });
    const totalCapacity = departures.reduce((sum, d) => sum + d.totalCapacity, 0);
    const totalBookedSeats = departures.reduce((sum, d) => sum + d.bookedSeats, 0);
    const occupancyRate = totalCapacity > 0 ? Math.round((totalBookedSeats / totalCapacity) * 100) : 0;

    // Enquiries
    const totalEnquiries = await prisma.enquiry.count();
    const newEnquiries = await prisma.enquiry.count({ where: { status: 'NEW' } });

    // Pending document/yatri verifications count
    const pendingVerificationsCount = await prisma.traveller.count({
      where: { docVerificationStatus: 'PENDING' },
    });

    // Recent Bookings (up to 6)
    const recentBookings = await prisma.booking.findMany({
      take: 6,
      orderBy: { createdAt: 'desc' },
      include: {
        departure: true,
        route: true,
        payments: true,
      },
    });

    // Recent Payments (up to 6)
    const recentPayments = await prisma.payment.findMany({
      take: 6,
      orderBy: { createdAt: 'desc' },
      include: {
        booking: {
          select: {
            id: true,
            bookingReference: true,
            contactName: true,
            contactPhone: true,
          },
        },
      },
    });

    // Recent Enquiries (up to 5)
    const recentEnquiries = await prisma.enquiry.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
    });

    // Recent Audit Logs (up to 6)
    const recentAuditLogs = await prisma.auditLog.findMany({
      take: 6,
      orderBy: { createdAt: 'desc' },
    });

    res.json({
      stats: {
        totalBookings,
        newBookings,
        confirmedBookings,
        pendingBookings,
        cancelledBookings,
        totalRegisteredDevotees: totalTravellers,
        totalTravellers,
        totalMembers,
        totalAmountCollected,
        pendingPaymentsAmount,
        refundsProcessed,
        totalCapacity,
        totalBookedSeats,
        occupancyRate,
        totalEnquiries,
        newEnquiries,
        pendingVerificationsCount,
      },
      recentBookings,
      recentPayments,
      recentEnquiries,
      recentAuditLogs,
      upcomingDepartures: departures.slice(0, 4),
    });
  } catch (error) {
    next(error);
  }
});

// 2. Departures Management
router.get('/departures', async (req, res, next) => {
  try {
    const departures = await prisma.departure.findMany({
      orderBy: { batchNumber: 'asc' },
      include: {
        _count: {
          select: { bookings: true },
        },
      },
    });
    res.json({ departures });
  } catch (error) {
    next(error);
  }
});

const updateDepartureSchema = z.object({
  name: z.string().optional(),
  totalCapacity: z.number().int().min(1).optional(),
  bookedSeats: z.number().int().min(0).optional(),
  status: z.enum(['AVAILABLE', 'FAST_FILLING', 'SOLD_OUT']).optional(),
  isFullMoon: z.boolean().optional(),
  description: z.string().optional().nullable(),
});

router.put('/departures/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = updateDepartureSchema.parse(req.body);

    const updated = await prisma.departure.update({
      where: { id },
      data,
    });

    await prisma.auditLog.create({
      data: {
        userId: req.user.id,
        userEmail: req.user.email,
        action: 'DEPARTURE_UPDATED',
        entity: 'DEPARTURE',
        entityId: id,
        details: JSON.stringify(data),
      },
    });

    res.json({ message: 'Departure updated successfully', departure: updated });
  } catch (error) {
    next(error);
  }
});

// 3. Bookings Management (Filterable, Searchable, with Pagination)
router.get('/bookings', async (req, res, next) => {
  try {
    const { status, departureId, routeId, paymentStatus, search, q, page = '1', limit = '20' } = req.query;

    const where = {};
    if (status && status !== 'ALL') where.status = String(status);
    if (paymentStatus && paymentStatus !== 'ALL') where.paymentStatus = String(paymentStatus);
    if (departureId && departureId !== 'ALL') where.departureId = String(departureId);
    if (routeId && routeId !== 'ALL') where.routeId = String(routeId);

    const searchTerm = (search || q || '').trim();
    if (searchTerm) {
      where.OR = [
        { bookingReference: { contains: searchTerm } },
        { contactName: { contains: searchTerm } },
        { contactEmail: { contains: searchTerm.toLowerCase() } },
        { contactPhone: { contains: searchTerm } },
        {
          travellers: {
            some: {
              fullName: { contains: searchTerm },
            },
          },
        },
      ];
    }

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const take = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));
    const skip = (pageNum - 1) * take;

    const [total, bookings] = await Promise.all([
      prisma.booking.count({ where }),
      prisma.booking.findMany({
        where,
        include: {
          departure: true,
          route: true,
          travellers: true,
          payments: {
            orderBy: { createdAt: 'desc' },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take,
      }),
    ]);

    res.json({
      bookings,
      total,
      page: pageNum,
      limit: take,
      totalPages: Math.ceil(total / take),
    });
  } catch (error) {
    next(error);
  }
});

// Dedicated Booking Detail: GET /api/admin/bookings/:id
router.get('/bookings/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    const booking = await prisma.booking.findFirst({
      where: {
        OR: [{ id }, { bookingReference: id }],
      },
      include: {
        departure: true,
        route: {
          include: {
            pricingTiers: true,
          },
        },
        travellers: {
          include: {
            uploadedDocuments: true,
            documentSubmissions: {
              where: { isCurrentVersion: true },
              include: { reviews: { orderBy: { reviewedAt: 'desc' } } },
            },
          },
        },
        payments: {
          orderBy: { createdAt: 'desc' },
        },
        refunds: {
          orderBy: { createdAt: 'desc' },
        },
        uploadedDocuments: true,
        documentSubmissions: {
          where: { isCurrentVersion: true },
          include: { reviews: { orderBy: { reviewedAt: 'desc' } }, traveller: true },
        },
        consentRecords: true,
        bookingNotes: {
          orderBy: { createdAt: 'desc' },
        },
        whatsAppMessages: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!booking) {
      return res.status(404).json({ error: 'Booking reference not found in database' });
    }

    // Compute live balance
    const totalSuccessfulPaid = booking.payments
      .filter((p) => p.status === 'SUCCESS')
      .reduce((sum, p) => sum + p.amount, 0);

    const balanceDue = Math.max(0, booking.totalAmount - totalSuccessfulPaid);

    res.json({
      booking: {
        ...booking,
        financialSummary: {
          totalAmount: booking.totalAmount,
          totalPaid: totalSuccessfulPaid,
          balanceDue,
          isFullyPaid: totalSuccessfulPaid >= booking.totalAmount,
        },
      },
    });
  } catch (error) {
    next(error);
  }
});

// Update Booking Status / Payment Status / Notes
const updateBookingStatusSchema = z.object({
  status: z.enum(['PENDING', 'CONFIRMED', 'CANCELLED', 'PENDING_CONFIRMATION']),
  paymentStatus: z.enum(['UNPAID', 'PARTIALLY_PAID', 'PAID', 'REFUNDED', 'PENDING_VERIFICATION', 'REJECTED']).optional(),
  notes: z.string().optional(),
});

router.put('/bookings/:id/status', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, paymentStatus, notes } = updateBookingStatusSchema.parse(req.body);

    const booking = await prisma.booking.findUnique({ where: { id } });
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    const updated = await prisma.booking.update({
      where: { id },
      data: {
        status,
        ...(paymentStatus && { paymentStatus }),
        ...(notes !== undefined && { notes }),
      },
      include: {
        departure: true,
        route: true,
        travellers: true,
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: req.user.id,
        userEmail: req.user.email,
        action: 'BOOKING_STATUS_CHANGED',
        entity: 'BOOKING',
        entityId: id,
        details: JSON.stringify({ oldStatus: booking.status, newStatus: status, paymentStatus }),
      },
    });

    res.json({ message: 'Booking status updated successfully', booking: updated });
  } catch (error) {
    next(error);
  }
});

// Dedicated Offline Payment Verification Endpoint: PUT /api/admin/bookings/:id/verify-offline-payment
const verifyOfflinePaymentSchema = z.object({
  verifiedAmount: z.number().int().positive().optional(),
  referenceNumber: z.string().optional(),
  notes: z.string().optional(),
});

router.put('/bookings/:id/verify-offline-payment', requireRole('SUPER_ADMIN', 'ADMIN', 'FINANCE'), async (req, res, next) => {
  try {
    const { id } = req.params;
    const { verifiedAmount, referenceNumber, notes } = verifyOfflinePaymentSchema.parse(req.body);

    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        departure: true,
        route: true,
        travellers: true,
        payments: true,
      },
    });

    if (!booking) {
      return res.status(404).json({ error: 'Target booking not found' });
    }

    const amountToCredit = verifiedAmount || booking.totalAmount;
    const now = new Date();
    const adminEmail = req.user.email;
    const adminName = req.user.name || adminEmail;
    const refNum = referenceNumber?.trim() || `UTR-${Date.now().toString().slice(-6)}`;
    const receiptNumber = `REC-OFF-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;

    const result = await prisma.$transaction(async (tx) => {
      // Find any existing pending offline payment or create a new successful payment record
      const pendingPayment = await tx.payment.findFirst({
        where: {
          bookingId: booking.id,
          status: 'PENDING_VERIFICATION',
        },
      });

      let paymentRecord;
      if (pendingPayment) {
        paymentRecord = await tx.payment.update({
          where: { id: pendingPayment.id },
          data: {
            status: 'SUCCESS',
            amount: amountToCredit,
            referenceNumber: refNum,
            receiptNumber,
            recordedBy: adminEmail,
            adminNotes: notes || `Offline payment verified by ${adminName}`,
            gatewayResponse: JSON.stringify({
              verifiedAt: now.toISOString(),
              verifiedBy: adminEmail,
              reference: refNum,
            }),
          },
        });
      } else {
        paymentRecord = await tx.payment.create({
          data: {
            bookingId: booking.id,
            transactionId: `TXN-OFF-${Date.now()}`,
            receiptNumber,
            referenceNumber: refNum,
            paymentMethod: 'OFFLINE_BANK_TRANSFER',
            paymentMode: 'BANK_TRANSFER',
            installmentType: amountToCredit >= booking.totalAmount ? 'FULL' : 'REGISTRATION',
            amount: amountToCredit,
            currency: booking.currency || 'INR',
            status: 'SUCCESS',
            recordedBy: adminEmail,
            adminNotes: notes || `Offline payment verified by ${adminName}`,
          },
        });
      }

      // Calculate total successful payments
      const otherSuccessPayments = booking.payments
        .filter((p) => p.status === 'SUCCESS' && p.id !== (pendingPayment?.id || ''))
        .reduce((sum, p) => sum + p.amount, 0);
      const totalPaid = otherSuccessPayments + amountToCredit;

      const newPaymentStatus = totalPaid >= booking.totalAmount ? 'PAID' : 'PARTIALLY_PAID';

      const updatedBooking = await tx.booking.update({
        where: { id },
        data: {
          paymentStatus: newPaymentStatus,
          status: 'CONFIRMED',
          offlinePaymentVerifiedAt: now,
          offlinePaymentVerifiedBy: adminEmail,
          offlinePaymentRejectionReason: null,
        },
        include: {
          departure: true,
          route: true,
          travellers: true,
          payments: true,
        },
      });

      await tx.auditLog.create({
        data: {
          userId: req.user.id,
          userEmail: adminEmail,
          action: 'OFFLINE_PAYMENT_VERIFIED',
          entity: 'BOOKING',
          entityId: id,
          details: JSON.stringify({
            bookingReference: booking.bookingReference,
            verifiedAmount: amountToCredit,
            totalPaid,
            newPaymentStatus,
            newBookingStatus: 'CONFIRMED',
            verifiedBy: adminEmail,
          }),
        },
      });

      return { booking: updatedBooking, payment: paymentRecord };
    });

    res.json({
      message: 'Offline payment verified and booking confirmed successfully',
      booking: result.booking,
      payment: result.payment,
    });
  } catch (error) {
    next(error);
  }
});

// Dedicated Offline Payment Rejection Endpoint: PUT /api/admin/bookings/:id/reject-offline-payment
const rejectOfflinePaymentSchema = z.object({
  rejectionReason: z.string().min(3, 'Rejection reason is required and must be clear'),
  notes: z.string().optional(),
});

router.put('/bookings/:id/reject-offline-payment', requireRole('SUPER_ADMIN', 'ADMIN', 'FINANCE'), async (req, res, next) => {
  try {
    const { id } = req.params;
    const { rejectionReason, notes } = rejectOfflinePaymentSchema.parse(req.body);

    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        payments: true,
      },
    });

    if (!booking) {
      return res.status(404).json({ error: 'Target booking not found' });
    }

    const adminEmail = req.user.email;

    const result = await prisma.$transaction(async (tx) => {
      // Mark any pending verification payment as FAILED
      await tx.payment.updateMany({
        where: {
          bookingId: booking.id,
          status: 'PENDING_VERIFICATION',
        },
        data: {
          status: 'FAILED',
          adminNotes: `Rejected by ${adminEmail}: ${rejectionReason}`,
        },
      });

      const updatedBooking = await tx.booking.update({
        where: { id },
        data: {
          paymentStatus: 'REJECTED',
          offlinePaymentRejectionReason: rejectionReason,
          notes: notes ? `${booking.notes ? booking.notes + '\n' : ''}[Offline Payment Rejection]: ${rejectionReason}` : booking.notes,
        },
        include: {
          departure: true,
          route: true,
          travellers: true,
          payments: true,
        },
      });

      await tx.auditLog.create({
        data: {
          userId: req.user.id,
          userEmail: adminEmail,
          action: 'OFFLINE_PAYMENT_REJECTED',
          entity: 'BOOKING',
          entityId: id,
          details: JSON.stringify({
            bookingReference: booking.bookingReference,
            rejectionReason,
            rejectedBy: adminEmail,
          }),
        },
      });

      return updatedBooking;
    });

    res.json({
      message: 'Offline payment has been rejected',
      booking: result,
    });
  } catch (error) {
    next(error);
  }
});

// Add Internal Administrative Note to Booking
router.post('/bookings/:id/notes', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { content } = z.object({
      content: z.string().min(1, 'Note content cannot be empty'),
    }).parse(req.body);

    const booking = await prisma.booking.findUnique({ where: { id } });
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    const note = await prisma.bookingNote.create({
      data: {
        bookingId: id,
        authorEmail: req.user.email,
        authorName: req.user.name || 'Admin Officer',
        content,
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: req.user.id,
        userEmail: req.user.email,
        action: 'BOOKING_NOTE_ADDED',
        entity: 'BOOKING_NOTE',
        entityId: note.id,
        details: JSON.stringify({ bookingReference: booking.bookingReference, contentSnippet: content.slice(0, 80) }),
      },
    });

    res.status(201).json({ message: 'Internal note saved successfully', note });
  } catch (error) {
    next(error);
  }
});

// Record WhatsApp Message Sent
router.post('/bookings/:id/whatsapp', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { templateKey, recipientPhone, recipientName, messageContent, providerMsgId, status = 'SENT' } = z.object({
      templateKey: z.string().optional().nullable(),
      recipientPhone: z.string().min(5, 'Valid recipient phone is required'),
      recipientName: z.string().min(1, 'Recipient name is required'),
      messageContent: z.string().min(1, 'Message content is required'),
      providerMsgId: z.string().optional().nullable(),
      status: z.enum(['SENT', 'CLICK_TO_CHAT', 'FAILED', 'DELIVERED']).default('SENT'),
    }).parse(req.body);

    const booking = await prisma.booking.findUnique({ where: { id } });
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    const msg = await prisma.whatsappMessage.create({
      data: {
        bookingId: id,
        templateKey: templateKey || 'CUSTOM_MESSAGE',
        recipientPhone,
        recipientName,
        messageContent,
        sentBy: req.user.email,
        providerMsgId: providerMsgId || `WAMSG-${Date.now()}`,
        status,
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: req.user.id,
        userEmail: req.user.email,
        action: 'WHATSAPP_UPDATE_SENT',
        entity: 'WHATSAPP_MESSAGE',
        entityId: msg.id,
        details: JSON.stringify({
          bookingReference: booking.bookingReference,
          recipientPhone,
          templateKey,
        }),
      },
    });

    res.status(201).json({ message: 'WhatsApp message logged successfully', messageRecord: msg });
  } catch (error) {
    next(error);
  }
});

// List All WhatsApp Messages: GET /api/admin/whatsapp/messages
router.get('/whatsapp/messages', async (req, res, next) => {
  try {
    const messages = await prisma.whatsappMessage.findMany({
      orderBy: { createdAt: 'desc' },
      take: 100,
      include: {
        booking: {
          select: {
            id: true,
            bookingReference: true,
            contactName: true,
          },
        },
      },
    });

    res.json({ messages });
  } catch (error) {
    next(error);
  }
});

// 4. Payments Management: GET /api/admin/payments
router.get('/payments', async (req, res, next) => {
  try {
    const { status, paymentMode, search } = req.query;

    const where = {};
    if (status && status !== 'ALL') where.status = String(status);
    if (paymentMode && paymentMode !== 'ALL') where.paymentMode = String(paymentMode);

    if (search) {
      const q = String(search).trim();
      where.OR = [
        { transactionId: { contains: q } },
        { receiptNumber: { contains: q } },
        { referenceNumber: { contains: q } },
        {
          booking: {
            OR: [
              { bookingReference: { contains: q } },
              { contactName: { contains: q } },
              { contactPhone: { contains: q } },
            ],
          },
        },
      ];
    }

    const [payments, allSuccessful] = await Promise.all([
      prisma.payment.findMany({
        where,
        include: {
          booking: {
            select: {
              id: true,
              bookingReference: true,
              contactName: true,
              contactEmail: true,
              contactPhone: true,
              totalAmount: true,
              paymentStatus: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.payment.findMany({
        where: { status: 'SUCCESS' },
        select: { amount: true },
      }),
    ]);

    const totalCollected = allSuccessful.reduce((sum, p) => sum + p.amount, 0);

    res.json({
      payments,
      count: payments.length,
      totalCollected,
    });
  } catch (error) {
    next(error);
  }
});

// Record Offline Payment: POST /api/admin/payments/offline
const recordOfflinePaymentSchema = z.object({
  bookingId: z.string().min(1, 'Booking reference is required'),
  amount: z.number().int().positive('Payment amount must be greater than zero'),
  paymentMode: z.enum(['CASH', 'BANK_TRANSFER', 'NEFT_RTGS', 'CHEQUE', 'UPI']),
  referenceNumber: z.string().min(2, 'Transaction / Reference / UTR number is required'),
  installmentType: z.enum(['REGISTRATION', 'FIRST_INSTALLMENT', 'FINAL_BALANCE', 'FULL']).default('REGISTRATION'),
  adminNotes: z.string().optional().nullable(),
});

router.post('/payments/offline', async (req, res, next) => {
  try {
    const data = recordOfflinePaymentSchema.parse(req.body);

    const booking = await prisma.booking.findUnique({
      where: { id: data.bookingId },
      include: {
        payments: {
          where: { status: 'SUCCESS' },
        },
      },
    });

    if (!booking) {
      return res.status(404).json({ error: 'Target booking not found' });
    }

    // Generate unique offline receipt number
    const receiptNumber = `REC-OFF-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;
    const transactionId = `TXN-OFF-${data.referenceNumber.trim().toUpperCase()}`;

    // Execute in transaction
    const result = await prisma.$transaction(async (tx) => {
      const payment = await tx.payment.create({
        data: {
          bookingId: data.bookingId,
          transactionId,
          receiptNumber,
          referenceNumber: data.referenceNumber.trim(),
          paymentMethod: `OFFLINE_${data.paymentMode}`,
          paymentMode: data.paymentMode,
          installmentType: data.installmentType,
          amount: data.amount,
          currency: booking.currency || 'INR',
          status: 'SUCCESS',
          recordedBy: req.user.email,
          adminNotes: data.adminNotes || `Manual offline payment verified by ${req.user.name || req.user.email}`,
          gatewayResponse: JSON.stringify({
            verifiedBy: req.user.email,
            mode: data.paymentMode,
            ref: data.referenceNumber,
            date: new Date().toISOString(),
          }),
        },
      });

      // Recalculate total paid
      const previouslyPaid = booking.payments.reduce((sum, p) => sum + p.amount, 0);
      const newTotalPaid = previouslyPaid + data.amount;

      let newPaymentStatus = booking.paymentStatus;
      if (newTotalPaid >= booking.totalAmount) {
        newPaymentStatus = 'PAID';
      } else if (newTotalPaid > 0) {
        newPaymentStatus = 'PARTIALLY_PAID';
      }

      // If status was PENDING and deposit/payment is received, auto-confirm booking if desired
      let newBookingStatus = booking.status;
      if (booking.status === 'PENDING' && newTotalPaid >= 25000) {
        newBookingStatus = 'CONFIRMED';
      }

      const updatedBooking = await tx.booking.update({
        where: { id: data.bookingId },
        data: {
          paymentStatus: newPaymentStatus,
          status: newBookingStatus,
        },
      });

      await tx.auditLog.create({
        data: {
          userId: req.user.id,
          userEmail: req.user.email,
          action: 'OFFLINE_PAYMENT_RECORDED',
          entity: 'PAYMENT',
          entityId: payment.id,
          details: JSON.stringify({
            bookingReference: booking.bookingReference,
            amount: data.amount,
            mode: data.paymentMode,
            ref: data.referenceNumber,
            newPaymentStatus,
          }),
        },
      });

      return { payment, updatedBooking };
    });

    res.status(201).json({
      message: `Offline payment of ₹${data.amount.toLocaleString()} successfully recorded`,
      payment: result.payment,
      booking: result.updatedBooking,
    });
  } catch (error) {
    next(error);
  }
});

// 5. Customer Management: GET /api/admin/customers (Aggregated from Bookings & Members)
router.get('/customers', async (req, res, next) => {
  try {
    const { search } = req.query;

    const [bookings, members] = await Promise.all([
      prisma.booking.findMany({
        include: {
          payments: {
            where: { status: 'SUCCESS' },
          },
          departure: true,
          route: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.member.findMany({
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    // Aggregate map keyed by normalized email
    const customerMap = new Map();

    for (const b of bookings) {
      const email = b.contactEmail.toLowerCase().trim();
      const existing = customerMap.get(email) || {
        email,
        name: b.contactName,
        phone: b.contactPhone,
        totalBookings: 0,
        totalSpent: 0,
        bookings: [],
        member: null,
        status: 'CUSTOMER',
        createdAt: b.createdAt,
      };

      const paidForBooking = b.payments.reduce((sum, p) => sum + p.amount, 0);
      existing.totalBookings += 1;
      existing.totalSpent += paidForBooking;
      existing.bookings.push({
        id: b.id,
        bookingReference: b.bookingReference,
        status: b.status,
        paymentStatus: b.paymentStatus,
        departureName: b.departure.name,
        totalAmount: b.totalAmount,
        createdAt: b.createdAt,
      });

      customerMap.set(email, existing);
    }

    for (const m of members) {
      const email = m.email.toLowerCase().trim();
      const existing = customerMap.get(email);
      if (existing) {
        existing.member = {
          membershipReference: m.membershipReference,
          membershipType: m.membershipType,
          status: m.status,
        };
      } else {
        customerMap.set(email, {
          email,
          name: `${m.firstName} ${m.lastName}`.trim(),
          phone: m.mobile,
          totalBookings: 0,
          totalSpent: 0,
          bookings: [],
          member: {
            membershipReference: m.membershipReference,
            membershipType: m.membershipType,
            status: m.status,
          },
          status: 'REGISTERED_MEMBER',
          createdAt: m.createdAt,
        });
      }
    }

    let customers = Array.from(customerMap.values());

    if (search) {
      const q = String(search).toLowerCase().trim();
      customers = customers.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.email.toLowerCase().includes(q) ||
          c.phone.includes(q)
      );
    }

    res.json({
      customers,
      count: customers.length,
    });
  } catch (error) {
    next(error);
  }
});

// 6. Reports & CSV Export: GET /api/admin/reports/export/csv
router.get('/reports/export/csv', async (req, res, next) => {
  try {
    const { type = 'bookings' } = req.query;

    if (type === 'yatris') {
      const travellers = await prisma.traveller.findMany({
        include: {
          booking: {
            include: { departure: true, route: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      });

      const headers = [
        'Booking Ref',
        'Departure Batch',
        'Route',
        'Yatri Name',
        'Age',
        'Gender',
        'Nationality',
        'Passport / Govt ID',
        'Dietary Preference',
        'Emergency Contact',
        'Emergency Phone',
        'Verification Status',
      ];

      const rows = travellers.map((t) => [
        `"${t.booking.bookingReference}"`,
        `"${t.booking.departure.name.replace(/"/g, '""')}"`,
        `"${t.booking.route.name.replace(/"/g, '""')}"`,
        `"${t.fullName.replace(/"/g, '""')}"`,
        t.age,
        `"${t.gender}"`,
        `"${t.nationality}"`,
        `"${t.passportNumber}"`,
        `"${t.dietaryPreference}"`,
        `"${t.emergencyContactName.replace(/"/g, '""')}"`,
        `"${t.emergencyContactPhone}"`,
        `"${t.docVerificationStatus}"`,
      ]);

      const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="shloka-yatris-manifest-${new Date().toISOString().slice(0, 10)}.csv"`);
      return res.status(200).send(csvContent);
    }

    if (type === 'payments') {
      const payments = await prisma.payment.findMany({
        include: {
          booking: {
            select: { bookingReference: true, contactName: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      });

      const headers = [
        'Receipt No',
        'Booking Ref',
        'Devotee Name',
        'Amount (INR)',
        'Payment Method',
        'Payment Mode',
        'Reference No',
        'Status',
        'Recorded Date',
      ];

      const rows = payments.map((p) => [
        `"${p.receiptNumber || ''}"`,
        `"${p.booking.bookingReference}"`,
        `"${p.booking.contactName.replace(/"/g, '""')}"`,
        p.amount,
        `"${p.paymentMethod}"`,
        `"${p.paymentMode || ''}"`,
        `"${p.referenceNumber || ''}"`,
        `"${p.status}"`,
        `"${new Date(p.createdAt).toISOString()}"`,
      ]);

      const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="shloka-financial-ledger-${new Date().toISOString().slice(0, 10)}.csv"`);
      return res.status(200).send(csvContent);
    }

    // Default: Bookings CSV
    const bookings = await prisma.booking.findMany({
      include: {
        departure: true,
        route: true,
        payments: { where: { status: 'SUCCESS' } },
      },
      orderBy: { createdAt: 'desc' },
    });

    const headers = [
      'Booking Ref',
      'Contact Devotee',
      'Mobile Phone',
      'Email',
      'Departure Batch',
      'Route Name',
      'Total Yatris',
      'Total Package Amount',
      'Amount Paid',
      'Balance Due',
      'Booking Status',
      'Payment Status',
      'Booking Date',
    ];

    const rows = bookings.map((b) => {
      const paid = b.payments.reduce((sum, p) => sum + p.amount, 0);
      const balance = Math.max(0, b.totalAmount - paid);
      return [
        `"${b.bookingReference}"`,
        `"${b.contactName.replace(/"/g, '""')}"`,
        `"${b.contactPhone}"`,
        `"${b.contactEmail}"`,
        `"${b.departure.name.replace(/"/g, '""')}"`,
        `"${b.route.name.replace(/"/g, '""')}"`,
        b.totalTravellers,
        b.totalAmount,
        paid,
        balance,
        `"${b.status}"`,
        `"${b.paymentStatus}"`,
        `"${new Date(b.createdAt).toISOString()}"`,
      ];
    });

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="shloka-master-bookings-${new Date().toISOString().slice(0, 10)}.csv"`);
    return res.status(200).send(csvContent);
  } catch (error) {
    next(error);
  }
});

// 7. Staff & RBAC Users Management
router.get('/users', async (req, res, next) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { createdAt: 'asc' },
    });
    res.json({ users });
  } catch (error) {
    next(error);
  }
});

router.put('/users/:id/role', async (req, res, next) => {
  try {
    // Only SUPER_ADMIN can alter staff roles
    if (req.user.role !== 'SUPER_ADMIN') {
      return res.status(403).json({ error: 'Only Super Administrators can modify staff roles.' });
    }

    const { id } = req.params;
    const { role } = z.object({
      role: z.enum(['SUPER_ADMIN', 'ADMIN', 'FINANCE', 'TRAVEL_OPS', 'SUPPORT', 'CONTENT_MANAGER']),
    }).parse(req.body);

    const updated = await prisma.user.update({
      where: { id },
      data: { role },
      select: { id: true, email: true, name: true, role: true },
    });

    await prisma.auditLog.create({
      data: {
        userId: req.user.id,
        userEmail: req.user.email,
        action: 'USER_ROLE_CHANGED',
        entity: 'USER',
        entityId: id,
        details: JSON.stringify({ targetUser: updated.email, newRole: role }),
      },
    });

    res.json({ message: 'User role updated successfully', user: updated });
  } catch (error) {
    next(error);
  }
});

router.post('/users', async (req, res, next) => {
  try {
    if (req.user.role !== 'SUPER_ADMIN') {
      return res.status(403).json({ error: 'Only Super Administrators can create administrative staff accounts.' });
    }

    const data = z.object({
      email: z.string().email(),
      name: z.string().min(2),
      phone: z.string().optional(),
      role: z.enum(['SUPER_ADMIN', 'ADMIN', 'FINANCE', 'TRAVEL_OPS', 'SUPPORT', 'CONTENT_MANAGER']).default('ADMIN'),
      password: z.string().min(8, 'Password must be at least 8 characters long'),
    }).parse(req.body);

    const existing = await prisma.user.findUnique({ where: { email: data.email } });
    if (existing) {
      return res.status(400).json({ error: 'A staff member with this email address already exists.' });
    }

    const passwordHash = await bcrypt.hash(data.password, 10);
    const user = await prisma.user.create({
      data: {
        email: data.email,
        name: data.name,
        phone: data.phone || null,
        role: data.role,
        passwordHash,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: req.user.id,
        userEmail: req.user.email,
        action: 'STAFF_ACCOUNT_CREATED',
        entity: 'USER',
        entityId: user.id,
        details: JSON.stringify({ email: user.email, role: user.role }),
      },
    });

    res.status(201).json({ message: 'Staff member account created', user });
  } catch (error) {
    next(error);
  }
});

// 8. Enquiries Management
router.get('/enquiries', async (req, res, next) => {
  try {
    const enquiries = await prisma.enquiry.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.json({ enquiries });
  } catch (error) {
    next(error);
  }
});

router.put('/enquiries/:id/status', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, assignedTo, internalNotes } = z.object({
      status: z.enum(['NEW', 'CONTACTED', 'CONVERTED', 'RESOLVED']),
      assignedTo: z.string().optional(),
      internalNotes: z.string().optional(),
    }).parse(req.body);

    const updated = await prisma.enquiry.update({
      where: { id },
      data: {
        status,
        ...(assignedTo !== undefined && { assignedTo }),
        ...(internalNotes !== undefined && { internalNotes }),
      },
    });

    res.json({ message: 'Enquiry updated successfully', enquiry: updated });
  } catch (error) {
    next(error);
  }
});

// 9. Pricing Tiers Management
router.get('/pricing', async (req, res, next) => {
  try {
    const tiers = await prisma.pricingTier.findMany({
      include: { route: true },
      orderBy: [{ routeId: 'asc' }, { passportType: 'asc' }],
    });
    res.json({ pricingTiers: tiers });
  } catch (error) {
    next(error);
  }
});

const updatePricingSchema = z.object({
  basePrice: z.number().int().min(10000).optional(),
  gstPercentage: z.number().min(0).max(30).optional(),
  foreignAirfareSupplement: z.number().int().min(0).optional(),
  depositRequired: z.number().int().min(1000).optional(),
});

router.put('/pricing/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = updatePricingSchema.parse(req.body);

    const updated = await prisma.pricingTier.update({
      where: { id },
      data,
    });

    await prisma.auditLog.create({
      data: {
        userId: req.user.id,
        userEmail: req.user.email,
        action: 'PRICING_UPDATED',
        entity: 'PRICING_TIER',
        entityId: id,
        details: JSON.stringify(data),
      },
    });

    res.json({ message: 'Pricing tier updated successfully', pricingTier: updated });
  } catch (error) {
    next(error);
  }
});

// 10. Audit Logs
router.get('/audit-logs', async (req, res, next) => {
  try {
    const logs = await prisma.auditLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
    res.json({ logs });
  } catch (error) {
    next(error);
  }
});

// 11. Member Management
router.get('/members', async (req, res, next) => {
  try {
    const { search, status, verification } = req.query;

    const where = {};
    if (status && status !== 'ALL') {
      where.status = String(status);
    }
    if (verification === 'VERIFIED') {
      where.isVerified = true;
    } else if (verification === 'UNVERIFIED') {
      where.isVerified = false;
    }

    if (search) {
      const q = String(search).trim();
      where.OR = [
        { firstName: { contains: q } },
        { lastName: { contains: q } },
        { email: { contains: q.toLowerCase() } },
        { mobile: { contains: q } },
        { membershipReference: { contains: q.toUpperCase() } },
        { city: { contains: q } },
      ];
    }

    const members = await prisma.member.findMany({
      where,
      select: {
        id: true,
        membershipReference: true,
        firstName: true,
        lastName: true,
        email: true,
        mobile: true,
        countryCode: true,
        gender: true,
        dateOfBirth: true,
        nationality: true,
        country: true,
        state: true,
        city: true,
        membershipType: true,
        yatraInterest: true,
        preferredBatch: true,
        preferredPackage: true,
        travellersCount: true,
        sourceDiscovery: true,
        marketingConsent: true,
        status: true,
        isVerified: true,
        verifiedAt: true,
        internalNotes: true,
        lastLoginAt: true,
        createdAt: true,
        _count: {
          select: { bookings: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ members, count: members.length });
  } catch (error) {
    next(error);
  }
});

router.get('/members/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    const member = await prisma.member.findUnique({
      where: { id },
      select: {
        id: true,
        membershipReference: true,
        firstName: true,
        lastName: true,
        email: true,
        mobile: true,
        countryCode: true,
        gender: true,
        dateOfBirth: true,
        nationality: true,
        country: true,
        state: true,
        city: true,
        membershipType: true,
        yatraInterest: true,
        preferredBatch: true,
        preferredPackage: true,
        travellersCount: true,
        sourceDiscovery: true,
        marketingConsent: true,
        status: true,
        isVerified: true,
        verifiedAt: true,
        internalNotes: true,
        lastLoginAt: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!member) {
      return res.status(404).json({ error: 'Member record not found' });
    }

    // Associated Bookings (by memberId OR matching contactEmail / contactPhone)
    const bookings = await prisma.booking.findMany({
      where: {
        OR: [
          { memberId: member.id },
          { contactEmail: member.email.toLowerCase() },
          { contactPhone: member.mobile },
          { contactPhone: { endsWith: member.mobile.slice(-10) } },
        ],
      },
      include: {
        departure: true,
        route: true,
        travellers: true,
        payments: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    // Associated Payments
    const payments = await prisma.payment.findMany({
      where: {
        booking: {
          OR: [
            { memberId: member.id },
            { contactEmail: member.email.toLowerCase() },
            { contactPhone: member.mobile },
            { contactPhone: { endsWith: member.mobile.slice(-10) } },
          ],
        },
      },
      include: {
        booking: {
          select: {
            id: true,
            bookingReference: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Activity / Audit Trail for this member
    const auditLogs = await prisma.auditLog.findMany({
      where: {
        OR: [
          { entityId: member.id },
          { userEmail: member.email },
        ],
      },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });

    res.json({
      member,
      bookings,
      payments,
      auditLogs,
    });
  } catch (error) {
    next(error);
  }
});

router.put('/members/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const schema = z.object({
      firstName: z.string().min(2).optional(),
      lastName: z.string().min(1).optional(),
      gender: z.string().optional().nullable(),
      dateOfBirth: z.string().optional().nullable(),
      nationality: z.string().optional(),
      country: z.string().optional(),
      state: z.string().optional().nullable(),
      city: z.string().optional().nullable(),
      membershipType: z.string().optional(),
      internalNotes: z.string().optional().nullable(),
    });

    const data = schema.parse(req.body);

    const updated = await prisma.member.update({
      where: { id },
      data,
      select: {
        id: true,
        membershipReference: true,
        firstName: true,
        lastName: true,
        email: true,
        mobile: true,
        status: true,
        internalNotes: true,
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: req.user.id,
        userEmail: req.user.email,
        action: 'MEMBER_UPDATED_BY_ADMIN',
        entity: 'MEMBER',
        entityId: id,
        details: JSON.stringify(data),
      },
    });

    res.json({ message: 'Member details updated successfully', member: updated });
  } catch (error) {
    next(error);
  }
});

router.put('/members/:id/status', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = z.object({
      status: z.enum(['ACTIVE', 'SUSPENDED', 'PENDING']),
    }).parse(req.body);

    const updated = await prisma.member.update({
      where: { id },
      data: { status },
      select: {
        id: true,
        membershipReference: true,
        firstName: true,
        lastName: true,
        email: true,
        status: true,
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: req.user.id,
        userEmail: req.user.email,
        action: 'MEMBER_STATUS_CHANGED',
        entity: 'MEMBER',
        entityId: id,
        details: JSON.stringify({ newStatus: status }),
      },
    });

    res.json({ message: 'Member status updated successfully', member: updated });
  } catch (error) {
    next(error);
  }
});

router.post('/members/:id/notes', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { note } = z.object({
      note: z.string().min(1, 'Note content is required'),
    }).parse(req.body);

    const member = await prisma.member.findUnique({ where: { id } });
    if (!member) {
      return res.status(404).json({ error: 'Member not found' });
    }

    const timestamp = new Date().toISOString().split('T')[0];
    const newNotes = member.internalNotes
      ? `${member.internalNotes}\n[${timestamp} - ${req.user.name || req.user.email}]: ${note}`
      : `[${timestamp} - ${req.user.name || req.user.email}]: ${note}`;

    const updated = await prisma.member.update({
      where: { id },
      data: { internalNotes: newNotes },
      select: { id: true, internalNotes: true },
    });

    await prisma.auditLog.create({
      data: {
        userId: req.user.id,
        userEmail: req.user.email,
        action: 'MEMBER_NOTE_ADDED',
        entity: 'MEMBER',
        entityId: id,
        details: JSON.stringify({ notePreview: note.slice(0, 50) }),
      },
    });

    res.json({ message: 'Note added successfully', member: updated });
  } catch (error) {
    next(error);
  }
});

// 12. Documents Verification & Compliance Management
router.get('/documents', async (req, res, next) => {
  try {
    const { status, type, documentRef, search } = req.query;

    // Real DB-derived Metrics for DocumentSubmissions
    const [
      totalSubmitted,
      pendingReview,
      underReview,
      clarificationRequested,
      accepted,
      notAccepted,
    ] = await Promise.all([
      prisma.documentSubmission.count(),
      prisma.documentSubmission.count({ where: { status: 'SUBMITTED' } }),
      prisma.documentSubmission.count({ where: { status: 'UNDER_REVIEW' } }),
      prisma.documentSubmission.count({
        where: { status: { in: ['CLARIFICATION_REQUIRED', 'RESUBMISSION_REQUIRED'] } },
      }),
      prisma.documentSubmission.count({ where: { status: 'ACCEPTED' } }),
      prisma.documentSubmission.count({ where: { status: 'NOT_ACCEPTED' } }),
    ]);

    const subWhere = {};
    if (status) subWhere.status = String(status);
    if (documentRef) subWhere.documentRef = String(documentRef);
    if (search) {
      const q = String(search).trim();
      subWhere.OR = [
        { booking: { bookingReference: { contains: q } } },
        { traveller: { fullName: { contains: q } } },
        { traveller: { passportNumber: { contains: q } } },
        { documentTitle: { contains: q } },
        { signerName: { contains: q } },
      ];
    }

    const submissions = await prisma.documentSubmission.findMany({
      where: subWhere,
      include: {
        booking: {
          select: {
            id: true,
            bookingReference: true,
            contactName: true,
            contactEmail: true,
            departure: { select: { name: true, batchNumber: true, arrivalDate: true, departureDate: true } },
            route: { select: { name: true, code: true } },
          },
        },
        traveller: {
          select: {
            id: true,
            fullName: true,
            passportNumber: true,
            medicalFitnessCertified: true,
            docVerificationStatus: true,
          },
        },
        member: {
          select: { id: true, firstName: true, lastName: true, email: true, membershipReference: true },
        },
        reviews: { orderBy: { reviewedAt: 'desc' } },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Also fetch legacy uploaded documents
    const docWhere = {};
    if (status) docWhere.status = String(status);
    if (type) docWhere.documentType = String(type);

    const legacyDocs = await prisma.uploadedDocument.findMany({
      where: docWhere,
      include: {
        booking: {
          select: {
            bookingReference: true,
            contactName: true,
            contactEmail: true,
          },
        },
        traveller: {
          select: {
            fullName: true,
            passportNumber: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Format submissions into unified documents list
    const mappedSubmissions = submissions.map((sub) => ({
      id: sub.id,
      isSubmission: true,
      documentRef: sub.documentRef,
      documentType:
        sub.documentRef === 'SYPL-MED-2027'
          ? 'MEDICAL_CERTIFICATE'
          : sub.documentRef === 'SYPL-RISK-2027'
          ? 'RISK_DECLARATION'
          : sub.documentRef === 'SYPL-INS-2027'
          ? 'INSURANCE'
          : 'OTHER',
      documentTitle: sub.documentTitle,
      version: sub.version,
      status: sub.status,
      originalFilename: sub.originalFilename || `${sub.documentRef}.pdf`,
      filePath: sub.filePath,
      fileSizeBytes: sub.fileSizeBytes,
      mimeType: sub.mimeType,
      createdAt: sub.createdAt,
      submittedAt: sub.submittedAt || sub.createdAt,
      signerName: sub.signerName,
      signerRelationship: sub.signerRelationship,
      signaturePlace: sub.signaturePlace,
      signatureDate: sub.signatureDate,
      pageInitials: sub.pageInitials ? JSON.parse(sub.pageInitials) : null,
      acknowledgements: sub.acknowledgements ? JSON.parse(sub.acknowledgements) : null,
      formData: sub.formData ? (typeof sub.formData === 'string' ? JSON.parse(sub.formData) : sub.formData) : null,
      reviews: sub.reviews,
      rejectionReason: sub.reviews?.[0]?.reviewNote || null,
      booking: sub.booking,
      traveller: sub.traveller,
      member: sub.member,
    }));

    const combinedDocuments = [...mappedSubmissions, ...legacyDocs.filter((ld) => !mappedSubmissions.some((ms) => ms.filePath === ld.filePath))];

    res.json({
      metrics: {
        totalSubmitted,
        pendingReview,
        underReview,
        clarificationRequested,
        accepted,
        notAccepted,
      },
      submissions,
      documents: combinedDocuments,
    });
  } catch (error) {
    next(error);
  }
});

const verifyDocSchema = z.object({
  status: z.enum(['VERIFIED', 'REJECTED', 'ACCEPTED', 'UNDER_REVIEW', 'CLARIFICATION_REQUIRED', 'NOT_ACCEPTED']),
  rejectionReason: z.string().optional(),
  reviewNote: z.string().optional(),
  action: z.string().optional(),
});

router.put('/documents/:id/verify', async (req, res, next) => {
  try {
    const { id } = req.params;
    const body = verifyDocSchema.parse(req.body);

    const note = body.reviewNote || body.rejectionReason || null;
    let newStatus = body.status;
    if (newStatus === 'VERIFIED') newStatus = 'ACCEPTED';
    if (newStatus === 'REJECTED') newStatus = 'NOT_ACCEPTED';

    // 1. Check if DocumentSubmission
    const sub = await prisma.documentSubmission.findUnique({
      where: { id },
      include: { traveller: true, booking: true },
    });

    if (sub) {
      if (['CLARIFICATION_REQUIRED', 'NOT_ACCEPTED'].includes(newStatus) && (!note || !note.trim())) {
        return res.status(400).json({ error: 'A review note explaining the clarification or rejection is required.' });
      }

      await prisma.documentReview.create({
        data: {
          submissionId: id,
          reviewerEmail: req.user.email,
          reviewerName: req.user.name || 'Shloka Administrator',
          previousStatus: sub.status,
          newStatus,
          reviewNote: note,
        },
      });

      const updatedSub = await prisma.documentSubmission.update({
        where: { id },
        data: { status: newStatus },
      });

      if (sub.documentRef === 'SYPL-MED-2027' && sub.travellerId) {
        if (newStatus === 'ACCEPTED') {
          await prisma.traveller.update({
            where: { id: sub.travellerId },
            data: { medicalFitnessCertified: true, docVerificationStatus: 'VERIFIED' },
          });
        } else {
          await prisma.traveller.update({
            where: { id: sub.travellerId },
            data: {
              medicalFitnessCertified: false,
              docVerificationStatus: newStatus === 'NOT_ACCEPTED' ? 'REJECTED' : 'PENDING',
              rejectionReason: note,
            },
          });
        }
      }

      await prisma.auditLog.create({
        data: {
          userId: req.user.id,
          userEmail: req.user.email,
          action: 'DOCUMENT_REVIEW_DECISION',
          entity: 'DOCUMENT_SUBMISSION',
          entityId: id,
          details: JSON.stringify({ previousStatus: sub.status, newStatus, note }),
        },
      });

      return res.json({ message: `Document marked as ${newStatus}`, document: updatedSub });
    }

    // 2. Fallback to legacy UploadedDocument
    const doc = await prisma.uploadedDocument.findUnique({ where: { id } });
    if (!doc) {
      return res.status(404).json({ error: 'Document not found' });
    }

    const legacyStatus = ['ACCEPTED', 'VERIFIED'].includes(newStatus) ? 'VERIFIED' : 'REJECTED';
    const updated = await prisma.uploadedDocument.update({
      where: { id },
      data: {
        status: legacyStatus,
        rejectionReason: legacyStatus === 'REJECTED' ? note || 'Document rejected' : null,
        verifiedBy: req.user.email,
        verifiedAt: new Date(),
      },
    });

    if (doc.travellerId) {
      await prisma.traveller.update({
        where: { id: doc.travellerId },
        data: {
          docVerificationStatus: legacyStatus,
          rejectionReason: legacyStatus === 'REJECTED' ? note : null,
        },
      });
    }

    await prisma.auditLog.create({
      data: {
        userId: req.user.id,
        userEmail: req.user.email,
        action: 'DOCUMENT_VERIFICATION_STATUS',
        entity: 'DOCUMENT',
        entityId: id,
        details: JSON.stringify({ status: legacyStatus, rejectionReason: note }),
      },
    });

    res.json({ message: `Document marked as ${legacyStatus}`, document: updated });
  } catch (error) {
    next(error);
  }
});

// 13. Refunds Management
router.get('/refunds', async (req, res, next) => {
  try {
    const refunds = await prisma.refund.findMany({
      include: {
        booking: {
          include: {
            departure: true,
            route: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ refunds });
  } catch (error) {
    next(error);
  }
});

const updateRefundStatusSchema = z.object({
  status: z.enum(['APPROVED', 'PROCESSED', 'REJECTED']),
  notes: z.string().optional(),
});

router.put('/refunds/:id/status', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, notes } = updateRefundStatusSchema.parse(req.body);

    const refund = await prisma.refund.findUnique({ where: { id } });
    if (!refund) {
      return res.status(404).json({ error: 'Refund record not found' });
    }

    const updated = await prisma.refund.update({
      where: { id },
      data: {
        status,
        notes: notes || refund.notes,
        approvedBy: req.user.email,
        approvedAt: status === 'APPROVED' ? new Date() : refund.approvedAt,
        processedAt: status === 'PROCESSED' ? new Date() : refund.processedAt,
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: req.user.id,
        userEmail: req.user.email,
        action: 'REFUND_STATUS_UPDATED',
        entity: 'REFUND',
        entityId: id,
        details: JSON.stringify({ status, notes }),
      },
    });

    res.json({ message: `Refund status updated to ${status}`, refund: updated });
  } catch (error) {
    next(error);
  }
});

// 14. Legal Documents CMS
router.get('/legal-documents', async (req, res, next) => {
  try {
    const documents = await prisma.legalDocument.findMany({
      orderBy: { slug: 'asc' },
    });
    res.json({ documents });
  } catch (error) {
    next(error);
  }
});

const updateLegalDocSchema = z.object({
  title: z.string().optional(),
  version: z.string().optional(),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).optional(),
  isApproved: z.boolean().optional(),
  contentMarkdown: z.string().optional(),
});

router.put('/legal-documents/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = updateLegalDocSchema.parse(req.body);

    const updated = await prisma.legalDocument.update({
      where: { id },
      data,
    });

    await prisma.auditLog.create({
      data: {
        userId: req.user.id,
        userEmail: req.user.email,
        action: 'LEGAL_DOC_UPDATED',
        entity: 'LEGAL_DOCUMENT',
        entityId: id,
        details: JSON.stringify(data),
      },
    });

    res.json({ message: 'Legal document updated successfully', document: updated });
  } catch (error) {
    next(error);
  }
});

// 15. Gallery CMS
router.get('/gallery', async (req, res, next) => {
  try {
    const items = await prisma.galleryItem.findMany({
      orderBy: { displayOrder: 'asc' },
    });
    res.json({ items });
  } catch (error) {
    next(error);
  }
});

const galleryItemSchema = z.object({
  title: z.string().min(2),
  category: z.enum(['KAILASH', 'MANSAROVAR', 'PARIKRAMA', 'RITUALS', 'TREK']),
  imageUrl: z.string().min(1),
  thumbnailUrl: z.string().optional(),
  caption: z.string().optional(),
  displayOrder: z.number().int().default(0),
  isPublished: z.boolean().default(true),
});

router.post('/gallery', async (req, res, next) => {
  try {
    const data = galleryItemSchema.parse(req.body);
    const item = await prisma.galleryItem.create({ data });
    res.status(201).json({ message: 'Gallery item added', item });
  } catch (error) {
    next(error);
  }
});

router.delete('/gallery/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    await prisma.galleryItem.delete({ where: { id } });
    res.json({ message: 'Gallery item deleted' });
  } catch (error) {
    next(error);
  }
});

// 16. Support Tickets
router.get('/support-tickets', async (req, res, next) => {
  try {
    const tickets = await prisma.supportTicket.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.json({ tickets });
  } catch (error) {
    next(error);
  }
});

router.put('/support-tickets/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, adminNotes } = z.object({
      status: z.enum(['OPEN', 'IN_PROGRESS', 'RESOLVED']),
      adminNotes: z.string().optional(),
    }).parse(req.body);

    const updated = await prisma.supportTicket.update({
      where: { id },
      data: {
        status,
        ...(adminNotes !== undefined && { adminNotes }),
      },
    });

    res.json({ message: 'Support ticket updated', ticket: updated });
  } catch (error) {
    next(error);
  }
});

// 17. Admin Profile & Master Password Change
router.post('/change-password', async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = z.object({
      currentPassword: z.string().min(1, 'Current password is required'),
      newPassword: z.string().min(8, 'New password must be at least 8 characters long'),
    }).parse(req.body);

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
    });

    if (!user) {
      return res.status(404).json({ error: 'Administrator account not found.' });
    }

    const isValid = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isValid) {
      return res.status(400).json({ error: 'Current password does not match.' });
    }

    const newHash = await bcrypt.hash(newPassword, 10);
    const updated = await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash: newHash,
        mustChangePassword: false,
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: user.id,
        userEmail: user.email,
        action: 'ADMIN_PASSWORD_CHANGED',
        entity: 'USER',
        entityId: user.id,
        details: JSON.stringify({ ip: req.ip, timestamp: new Date().toISOString() }),
      },
    });

    res.json({
      message: 'Password changed successfully. Your account is secured.',
      user: {
        id: updated.id,
        email: updated.email,
        name: updated.name,
        role: updated.role,
        mustChangePassword: false,
      },
    });
  } catch (error) {
    next(error);
  }
});

router.put('/profile', async (req, res, next) => {
  try {
    const { name, phone } = z.object({
      name: z.string().min(2, 'Name must be at least 2 characters').optional(),
      phone: z.string().min(8, 'Phone must be at least 8 digits').optional(),
    }).parse(req.body);

    const updated = await prisma.user.update({
      where: { id: req.user.id },
      data: {
        ...(name && { name }),
        ...(phone && { phone }),
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: req.user.id,
        userEmail: req.user.email,
        action: 'ADMIN_PROFILE_UPDATED',
        entity: 'USER',
        entityId: req.user.id,
        details: JSON.stringify({ ip: req.ip, updatedFields: { name, phone } }),
      },
    });

    res.json({
      message: 'Admin profile updated successfully',
      user: {
        id: updated.id,
        email: updated.email,
        name: updated.name,
        phone: updated.phone,
        role: updated.role,
      },
    });
  } catch (error) {
    next(error);
  }
});

export default router;
