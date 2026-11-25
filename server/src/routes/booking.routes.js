import { Router } from 'express';
import path from 'path';
import { z } from 'zod';
import prisma from '../prisma.js';
import { optionalUserOrMember } from '../middleware/auth.js';

const router = Router();

const travellerSchema = z.object({
  fullName: z.string().min(2, 'Full legal name is required'),
  dateOfBirth: z.string().optional().nullable(),
  passportNumber: z.string().min(5, 'Valid passport or government ID number is required'),
  passportExpiryDate: z.string().optional().nullable(),
  nationality: z.string().min(2, 'Nationality is required'),
  age: z.number().int().min(12).max(85, 'Yatris must be between 12 and 85 years of age'),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER']),
  address: z.string().optional().nullable(),
  medicalConditions: z.string().optional().nullable(),
  allergies: z.string().optional().nullable(),
  medications: z.string().optional().nullable(),
  medicalFitnessCertified: z.boolean().default(false),
  insuranceProvider: z.string().optional().nullable(),
  insurancePolicyNumber: z.string().optional().nullable(),
  dietaryPreference: z.string().default('PURE_VEGETARIAN'),
  emergencyContactName: z.string().min(2, 'Emergency contact name is required'),
  emergencyContactRelationship: z.string().optional().nullable(),
  emergencyContactPhone: z.string().min(8, 'Emergency contact phone is required'),
  isPrimary: z.boolean().default(false),
});

const createBookingSchema = z.object({
  departureId: z.string().min(1, 'Departure batch is required'),
  routeId: z.string().min(1, 'Route is required'),
  passportType: z.enum(['INDIAN', 'FOREIGN']),
  contactName: z.string().min(2, 'Contact person name is required'),
  contactEmail: z.string().email('Valid email address is required'),
  contactPhone: z.string().min(8, 'Valid phone number is required'),
  notes: z.string().optional().nullable(),
  paymentMethod: z.enum(['ONLINE', 'OFFLINE', 'OFFLINE_TEST']).optional().default('ONLINE'),
  travellers: z.array(travellerSchema).min(1, 'At least one traveller must be registered'),
  // Optional initial consent flags
  consent: z
    .object({
      termsAccepted: z.boolean().optional(),
      cancellationAccepted: z.boolean().optional(),
      scheduleAccepted: z.boolean().optional(),
      riskAcknowledged: z.boolean().optional(),
      privacyConsent: z.boolean().optional(),
      marketingConsent: z.boolean().optional(),
      publicityConsent: z.boolean().optional(),
    })
    .optional(),
});

// Helper to generate unique booking reference: e.g. SHY-2027-104829
function generateBookingReference() {
  const randomSuffix = Math.floor(100000 + Math.random() * 900000);
  return `SHY-2027-${randomSuffix}`;
}

// POST create a new booking with transactional capacity check and price calculation
router.post('/', async (req, res, next) => {
  try {
    const data = createBookingSchema.parse(req.body);
    const travellersCount = data.travellers.length;

    // Feature Flag Check: Offline Test Payment availability
    const isOfflineRequest = data.paymentMethod === 'OFFLINE' || data.paymentMethod === 'OFFLINE_TEST';
    if (isOfflineRequest) {
      const isFeatureEnabled = process.env.ENABLE_OFFLINE_TEST_PAYMENT === 'true' || (process.env.NODE_ENV !== 'production' && process.env.ENABLE_OFFLINE_TEST_PAYMENT !== 'false');
      if (!isFeatureEnabled) {
        return res.status(403).json({
          error: 'Offline test payment mode is disabled in this environment. Please choose an online payment option.',
        });
      }
    }

    // Execute in transaction to ensure seat capacity consistency
    const result = await prisma.$transaction(async (tx) => {
      // 1. Fetch departure and verify seat availability
      const departure = await tx.departure.findUnique({
        where: { id: data.departureId },
      });

      if (!departure) {
        throw new Error('Departure batch not found');
      }

      const availableSeats = departure.totalCapacity - departure.bookedSeats;
      if (availableSeats < travellersCount) {
        throw new Error(`Insufficient seats available in this departure batch. Only ${availableSeats} seat(s) remaining.`);
      }

      // 2. Fetch authoritative pricing
      const pricingTier = await tx.pricingTier.findFirst({
        where: {
          routeId: data.routeId,
          passportType: data.passportType,
        },
      });

      if (!pricingTier) {
        throw new Error('Pricing not configured for this route and passport combination');
      }

      // Calculate authoritative amounts on server
      const baseAmount = pricingTier.basePrice * travellersCount;
      const gstRate = data.passportType === 'INDIAN' ? pricingTier.gstPercentage / 100 : 0;
      const gstAmount = Math.round(baseAmount * gstRate);
      const supplementAmount = pricingTier.foreignAirfareSupplement * travellersCount;
      const totalAmount = baseAmount + gstAmount;

      // 3. Generate unique booking reference
      let bookingReference = generateBookingReference();
      let exists = await tx.booking.findUnique({ where: { bookingReference } });
      while (exists) {
        bookingReference = generateBookingReference();
        exists = await tx.booking.findUnique({ where: { bookingReference } });
      }

      // Check if contactEmail belongs to a registered Member
      let matchedMemberId = data.memberId || null;
      if (!matchedMemberId && data.contactEmail) {
        const existingMember = await tx.member.findUnique({
          where: { email: data.contactEmail.toLowerCase().trim() },
        });
        if (existingMember) {
          matchedMemberId = existingMember.id;
        }
      }

      const isOffline = data.paymentMethod === 'OFFLINE' || data.paymentMethod === 'OFFLINE_TEST';
      const initialStatus = isOffline ? 'PENDING_CONFIRMATION' : 'PENDING';
      const initialPaymentStatus = isOffline ? 'PENDING_VERIFICATION' : 'UNPAID';

      // 4. Create Booking record with travellers
      const booking = await tx.booking.create({
        data: {
          bookingReference,
          departureId: data.departureId,
          routeId: data.routeId,
          passportType: data.passportType,
          contactName: data.contactName,
          contactEmail: data.contactEmail,
          contactPhone: data.contactPhone,
          totalTravellers: travellersCount,
          baseAmount,
          gstAmount,
          supplementAmount,
          totalAmount,
          currency: pricingTier.currency,
          status: initialStatus,
          paymentStatus: initialPaymentStatus,
          paymentMethod: data.paymentMethod || 'ONLINE',
          termsAcceptedVersion: 'DRAFT-V1.0-NOV-2026',
          memberId: matchedMemberId,
          notes: data.notes || '',
          travellers: {
            create: data.travellers.map((t, idx) => ({
              fullName: t.fullName,
              dateOfBirth: t.dateOfBirth || null,
              passportNumber: t.passportNumber,
              passportExpiryDate: t.passportExpiryDate || null,
              nationality: t.nationality,
              age: t.age,
              gender: t.gender,
              address: t.address || null,
              medicalConditions: t.medicalConditions || 'None disclosed',
              allergies: t.allergies || null,
              medications: t.medications || null,
              medicalFitnessCertified: t.medicalFitnessCertified || false,
              insuranceProvider: t.insuranceProvider || null,
              insurancePolicyNumber: t.insurancePolicyNumber || null,
              dietaryPreference: t.dietaryPreference || 'PURE_VEGETARIAN',
              emergencyContactName: t.emergencyContactName,
              emergencyContactRelationship: t.emergencyContactRelationship || null,
              emergencyContactPhone: t.emergencyContactPhone,
              isPrimary: idx === 0,
            })),
          },
          ...(data.consent && {
            consentRecords: {
              create: {
                termsAccepted: data.consent.termsAccepted || false,
                termsVersion: 'DRAFT-V1.0-NOV-2026',
                cancellationAccepted: data.consent.cancellationAccepted || false,
                cancellationVersion: 'DRAFT-V1.0-NOV-2026',
                scheduleAccepted: data.consent.scheduleAccepted || false,
                scheduleVersion: '2027-V1.0',
                riskAcknowledged: data.consent.riskAcknowledged || false,
                riskVersion: 'DRAFT-V1.0-NOV-2026',
                privacyConsent: data.consent.privacyConsent || false,
                marketingConsent: data.consent.marketingConsent || false,
                publicityConsent: data.consent.publicityConsent || false,
                ipAddress: req.ip,
                userAgent: req.headers['user-agent'],
              },
            },
          }),
        },
        include: {
          departure: true,
          route: true,
          travellers: true,
          consentRecords: true,
        },
      });

      // 5. Reserve seats on departure batch
      const updatedBooked = departure.bookedSeats + travellersCount;
      let newStatus = departure.status;
      if (updatedBooked >= departure.totalCapacity) {
        newStatus = 'SOLD_OUT';
      } else if (departure.totalCapacity - updatedBooked <= 5) {
        newStatus = 'FAST_FILLING';
      }

      await tx.departure.update({
        where: { id: departure.id },
        data: {
          bookedSeats: updatedBooked,
          status: newStatus,
        },
      });

      // 6. If Offline Payment, create pending verification payment transaction
      if (isOffline) {
        await tx.payment.create({
          data: {
            bookingId: booking.id,
            transactionId: `OFFLINE-${bookingReference}`,
            paymentMethod: data.paymentMethod || 'OFFLINE_TEST',
            paymentMode: 'BANK_TRANSFER',
            installmentType: 'FULL',
            amount: totalAmount,
            currency: pricingTier.currency || 'INR',
            status: 'PENDING_VERIFICATION',
            adminNotes: 'Devotee selected offline test payment mode. Awaiting administrative review and verification.',
          },
        });
      }

      // 7. Log audit event
      await tx.auditLog.create({
        data: {
          userEmail: data.contactEmail,
          action: isOffline ? 'BOOKING_OFFLINE_TEST_CREATED' : 'BOOKING_CREATED',
          entity: 'BOOKING',
          entityId: booking.id,
          details: JSON.stringify({
            reference: bookingReference,
            departureBatch: departure.name,
            totalTravellers: travellersCount,
            totalAmount,
            paymentMethod: data.paymentMethod || 'ONLINE',
            paymentStatus: initialPaymentStatus,
          }),
          ipAddress: req.ip,
        },
      });

      return booking;
    });

    res.status(201).json({
      message: 'Booking successfully created',
      booking: result,
    });
  } catch (error) {
    next(error);
  }
});

// Helper to sanitize sensitive Protected Health Information (PHI) & identification for unprivileged viewers
function sanitizeBookingForPublicView(booking) {
  const sanitizedTravellers = booking.travellers.map((t) => ({
    id: t.id,
    bookingId: t.bookingId,
    fullName: t.fullName,
    nationality: t.nationality,
    age: t.age,
    gender: t.gender,
    dietaryPreference: t.dietaryPreference,
    isPrimary: t.isPrimary,
    docVerificationStatus: t.docVerificationStatus,
    passportNumber: t.passportNumber && t.passportNumber.length > 4
      ? `${t.passportNumber.slice(0, 2)}****${t.passportNumber.slice(-2)}`
      : '****',
    medicalFitnessCertified: t.medicalFitnessCertified,
    // Sensitive clinical conditions and medications are strictly excluded
    medicalConditions: 'Confidential (Clinical Record)',
    allergies: null,
    medications: null,
    emergencyContactName: t.emergencyContactName,
    emergencyContactPhone: t.emergencyContactPhone && t.emergencyContactPhone.length > 4
      ? `******${t.emergencyContactPhone.slice(-4)}`
      : '******',
  }));

  return {
    ...booking,
    contactPhone: booking.contactPhone && booking.contactPhone.length > 4
      ? `******${booking.contactPhone.slice(-4)}`
      : '******',
    travellers: sanitizedTravellers,
  };
}

// GET booking by reference (for confirmation voucher & traveller portal)
router.get('/reference/:ref', optionalUserOrMember, async (req, res, next) => {
  try {
    const { ref } = req.params;
    const booking = await prisma.booking.findUnique({
      where: { bookingReference: ref },
      include: {
        departure: true,
        route: true,
        travellers: true,
        payments: { orderBy: { createdAt: 'desc' } },
        refunds: { orderBy: { createdAt: 'desc' } },
        uploadedDocuments: { orderBy: { createdAt: 'desc' } },
        consentRecords: { orderBy: { acceptedAt: 'desc' } },
      },
    });

    if (!booking) {
      return res.status(404).json({ error: 'Booking reference not found' });
    }

    const isPrivileged =
      req.isAdmin ||
      (req.member &&
        (booking.memberId === req.member.id ||
          booking.contactEmail.toLowerCase() === req.member.email.toLowerCase()));

    res.json({ booking: isPrivileged ? booking : sanitizeBookingForPublicView(booking) });
  } catch (error) {
    next(error);
  }
});

// GET booking by ID
router.get('/:id', optionalUserOrMember, async (req, res, next) => {
  try {
    const { id } = req.params;
    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        departure: true,
        route: true,
        travellers: true,
        payments: { orderBy: { createdAt: 'desc' } },
        refunds: { orderBy: { createdAt: 'desc' } },
        uploadedDocuments: { orderBy: { createdAt: 'desc' } },
        consentRecords: { orderBy: { acceptedAt: 'desc' } },
      },
    });

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    // Authorization & Ownership Verification
    if (req.user || req.member) {
      const isAuthorized =
        req.isAdmin ||
        (req.member &&
          (booking.memberId === req.member.id ||
            booking.contactEmail.toLowerCase() === req.member.email.toLowerCase()));

      if (!isAuthorized) {
        return res.status(403).json({
          error: 'Access denied: You cannot view another devotee\'s booking information.',
        });
      }
      return res.json({ booking });
    }

    // For unauthenticated access (e.g. initial booking payment redirect before login), return sanitized view
    res.json({ booking: sanitizeBookingForPublicView(booking) });
  } catch (error) {
    next(error);
  }
});

// POST record contractual consent for a booking
const consentSchema = z.object({
  termsAccepted: z.boolean().optional(),
  consentedToMasterTerms: z.boolean().optional(),
  termsVersion: z.string().default('DRAFT-V1.0-NOV-2026'),
  cancellationAccepted: z.boolean().optional(),
  consentedToCancellationPolicy: z.boolean().optional(),
  cancellationVersion: z.string().default('DRAFT-V1.0-NOV-2026'),
  scheduleAccepted: z.boolean().optional(),
  consentedToServiceSchedule: z.boolean().optional(),
  scheduleVersion: z.string().default('2027-V1.0'),
  riskAcknowledged: z.boolean().optional(),
  consentedToRiskNotice: z.boolean().optional(),
  riskVersion: z.string().default('DRAFT-V1.0-NOV-2026'),
  privacyConsent: z.boolean().optional(),
  consentedToPrivacyNotice: z.boolean().optional(),
  marketingConsent: z.boolean().default(false),
  consentMarketingOptional: z.boolean().optional(),
  publicityConsent: z.boolean().default(false),
  consentMediaOptional: z.boolean().optional(),
  ipAddress: z.string().optional(),
  userAgent: z.string().optional(),
}).transform((data) => ({
  termsAccepted: Boolean(data.termsAccepted ?? data.consentedToMasterTerms),
  cancellationAccepted: Boolean(data.cancellationAccepted ?? data.consentedToCancellationPolicy),
  scheduleAccepted: Boolean(data.scheduleAccepted ?? data.consentedToServiceSchedule),
  riskAcknowledged: Boolean(data.riskAcknowledged ?? data.consentedToRiskNotice),
  privacyConsent: Boolean(data.privacyConsent ?? data.consentedToPrivacyNotice),
  marketingConsent: Boolean(data.marketingConsent || data.consentMarketingOptional),
  publicityConsent: Boolean(data.publicityConsent || data.consentMediaOptional),
  termsVersion: data.termsVersion,
  cancellationVersion: data.cancellationVersion,
  scheduleVersion: data.scheduleVersion,
  riskVersion: data.riskVersion,
}));

router.post('/:id/consent', async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = consentSchema.parse(req.body);

    const booking = await prisma.booking.findUnique({ where: { id } });
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    // Must accept all 5 mandatory contracts to proceed
    if (
      !data.termsAccepted ||
      !data.cancellationAccepted ||
      !data.scheduleAccepted ||
      !data.riskAcknowledged ||
      !data.privacyConsent
    ) {
      return res.status(400).json({
        error: 'All mandatory contractual documents must be affirmatively accepted before proceeding to payment.',
      });
    }

    const consentRecord = await prisma.consentRecord.create({
      data: {
        bookingId: booking.id,
        termsAccepted: data.termsAccepted,
        termsVersion: data.termsVersion,
        cancellationAccepted: data.cancellationAccepted,
        cancellationVersion: data.cancellationVersion,
        scheduleAccepted: data.scheduleAccepted,
        scheduleVersion: data.scheduleVersion,
        riskAcknowledged: data.riskAcknowledged,
        riskVersion: data.riskVersion,
        privacyConsent: data.privacyConsent,
        marketingConsent: data.marketingConsent,
        publicityConsent: data.publicityConsent,
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
      },
    });

    await prisma.booking.update({
      where: { id },
      data: { termsAcceptedVersion: data.termsVersion },
    });

    await prisma.auditLog.create({
      data: {
        userEmail: booking.contactEmail,
        action: 'CONTRACT_CONSENT_RECORDED',
        entity: 'BOOKING',
        entityId: booking.id,
        details: JSON.stringify({
          consentId: consentRecord.id,
          termsVersion: data.termsVersion,
          marketingConsent: data.marketingConsent,
          publicityConsent: data.publicityConsent,
        }),
        ipAddress: req.ip,
      },
    });

    res.json({ message: 'Contractual consent successfully recorded', consent: consentRecord });
  } catch (error) {
    next(error);
  }
});

// POST upload / attach document to booking
const documentUploadSchema = z.object({
  travellerId: z.string().optional().nullable(),
  documentType: z.enum(['PASSPORT', 'PHOTO', 'MEDICAL_CERTIFICATE', 'INSURANCE', 'OTHER']),
  originalFilename: z.string().min(1),
  filePath: z.string().min(1),
  fileSizeBytes: z.number().int().min(1),
  mimeType: z.string().min(1),
});

router.post('/:id/documents', optionalUserOrMember, async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = documentUploadSchema.parse(req.body);

    const booking = await prisma.booking.findUnique({ where: { id } });
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    // Access control check
    if (req.user || req.member) {
      const isOwner =
        req.isAdmin ||
        (req.member &&
          (booking.memberId === req.member.id ||
            booking.contactEmail.toLowerCase() === req.member.email.toLowerCase()));
      if (!isOwner) {
        return res.status(403).json({ error: 'Access denied: You cannot upload documents to another devotee\'s booking.' });
      }
    }

    // Sanitize path against directory traversal
    const safeFilePath = path.basename(data.filePath).replace(/[^a-zA-Z0-9._-]/g, '_');
    const safeFilename = path.basename(data.originalFilename).replace(/[^a-zA-Z0-9._-]/g, '_');

    const doc = await prisma.uploadedDocument.create({
      data: {
        bookingId: booking.id,
        travellerId: data.travellerId || null,
        documentType: data.documentType,
        originalFilename: safeFilename,
        filePath: safeFilePath,
        fileSizeBytes: data.fileSizeBytes,
        mimeType: data.mimeType,
        status: 'PENDING',
      },
    });

    await prisma.auditLog.create({
      data: {
        userEmail: booking.contactEmail,
        action: 'DOCUMENT_UPLOADED',
        entity: 'DOCUMENT',
        entityId: doc.id,
        details: JSON.stringify({
          documentType: data.documentType,
          originalFilename: safeFilename,
          sizeBytes: data.fileSizeBytes,
        }),
        ipAddress: req.ip,
      },
    });

    res.status(201).json({ message: 'Document uploaded successfully', document: doc });
  } catch (error) {
    next(error);
  }
});

// POST cancel booking request and calculate contractual refund
const cancelRequestSchema = z.object({
  cancellationReason: z.string().min(5, 'Cancellation reason is required'),
  contactEmail: z.string().optional(),
});

router.post('/:id/cancel-request', optionalUserOrMember, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { cancellationReason, contactEmail } = cancelRequestSchema.parse(req.body);

    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        departure: true,
        payments: { where: { status: 'SUCCESS' } },
      },
    });

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    // Access control: Ensure user owns the booking before cancellation
    if (req.user || req.member) {
      const isOwner =
        req.isAdmin ||
        (req.member &&
          (booking.memberId === req.member.id ||
            booking.contactEmail.toLowerCase() === req.member.email.toLowerCase()));
      if (!isOwner) {
        return res.status(403).json({ error: 'Access denied: You cannot cancel another devotee\'s booking.' });
      }
    } else if (contactEmail) {
      if (contactEmail.toLowerCase().trim() !== booking.contactEmail.toLowerCase()) {
        return res.status(403).json({ error: 'Verification email does not match booking contact email.' });
      }
    } else if (process.env.NODE_ENV === 'production') {
      const verifyHeader = (req.headers['x-contact-email'] || '').toLowerCase().trim();
      if (!verifyHeader || verifyHeader !== booking.contactEmail.toLowerCase()) {
        return res.status(401).json({
          error: 'Authentication or verified contact email required to cancel this booking.',
        });
      }
    }

    if (booking.status === 'CANCELLED') {
      return res.status(400).json({ error: 'Booking is already cancelled' });
    }

    // Calculate calendar days before departure
    const now = new Date();
    const depDate = new Date(booking.departure.arrivalDate);
    const diffMs = depDate.getTime() - now.getTime();
    const daysBeforeDeparture = Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));

    // Contractual refund slabs:
    // >= 75 days: 25% charge (75% refund)
    // 60-74 days: 50% charge (50% refund)
    // 30-59 days: 75% charge (25% refund)
    // < 30 days: 100% charge (0% refund)
    let cancellationChargeRate = 1.0;
    if (daysBeforeDeparture >= 75) {
      cancellationChargeRate = 0.25;
    } else if (daysBeforeDeparture >= 60) {
      cancellationChargeRate = 0.5;
    } else if (daysBeforeDeparture >= 30) {
      cancellationChargeRate = 0.75;
    } else {
      cancellationChargeRate = 1.0;
    }

    const packageBasePrice = booking.baseAmount;
    const cancellationChargeAmount = Math.round(packageBasePrice * cancellationChargeRate);

    // Sum of all successful payments made towards package
    const totalPaid = booking.payments.reduce((sum, p) => sum + p.amount, 0);

    // Single refund formula from contract C4:
    // Package Refund = max(0, totalPaid - cancellationChargeAmount)
    // Note: GST collected is non-refundable per tax regulations
    const netRefundAmount = Math.max(0, totalPaid - cancellationChargeAmount);

    const refundReference = `REF-2027-${Math.floor(1000 + Math.random() * 9000)}`;

    const result = await prisma.$transaction(async (tx) => {
      // 1. Create Refund record
      const refund = await tx.refund.create({
        data: {
          bookingId: booking.id,
          refundReference,
          cancellationReason,
          noticeDate: now,
          daysBeforeDeparture,
          packageBasePrice,
          totalPaid,
          cancellationChargeRate,
          cancellationChargeAmount,
          taxRefundAmount: 0,
          netRefundAmount,
          status: 'PENDING',
          notes: `Voluntary cancellation ${daysBeforeDeparture} days prior to departure. Proposed ${Math.round(
            (1 - cancellationChargeRate) * 100
          )}% refund slab applied. Pending finance verification.`,
        },
      });

      // 2. Update Booking status
      await tx.booking.update({
        where: { id: booking.id },
        data: {
          status: 'CANCELLED',
          paymentStatus: netRefundAmount > 0 ? 'REFUNDED' : booking.paymentStatus,
          cancellationReason,
          cancelledAt: now,
          refundAmount: netRefundAmount,
        },
      });

      // 3. Release seat capacity back to departure
      const newBookedSeats = Math.max(0, booking.departure.bookedSeats - booking.totalTravellers);
      let newDepStatus = booking.departure.status;
      if (newBookedSeats < booking.departure.totalCapacity) {
        newDepStatus = booking.departure.totalCapacity - newBookedSeats <= 5 ? 'FAST_FILLING' : 'AVAILABLE';
      }
      await tx.departure.update({
        where: { id: booking.departure.id },
        data: {
          bookedSeats: newBookedSeats,
          status: newDepStatus,
        },
      });

      // 4. Audit log
      await tx.auditLog.create({
        data: {
          userEmail: booking.contactEmail,
          action: 'BOOKING_CANCELLED',
          entity: 'BOOKING',
          entityId: booking.id,
          details: JSON.stringify({
            refundReference,
            daysBeforeDeparture,
            cancellationChargeRate,
            netRefundAmount,
            reason: cancellationReason,
          }),
          ipAddress: req.ip,
        },
      });

      return refund;
    });

    res.json({
      message: 'Cancellation request recorded and refund calculation generated',
      refund: result,
      refundCalculation: {
        refundReference: result.refundReference,
        daysBeforeDeparture,
        packageBasePrice,
        totalPaid,
        cancellationChargeRate: `${Math.round(cancellationChargeRate * 100)}%`,
        cancellationChargeAmount,
        taxRefundAmount: 0,
        taxRefundNote: 'Statutory GST is non-refundable per Indian tax regulations',
        netRefundAmount,
        status: 'PENDING_APPROVAL',
      },
    });
  } catch (error) {
    next(error);
  }
});

export default router;
