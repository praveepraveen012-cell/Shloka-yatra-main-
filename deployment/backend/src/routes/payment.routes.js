import { Router } from 'express';
import crypto from 'crypto';
import { z } from 'zod';
import prisma from '../prisma.js';

const router = Router();

const createOrderSchema = z.object({
  bookingId: z.string().min(1, 'Booking ID is required'),
  installmentType: z.enum(['REGISTRATION', 'FIRST_INSTALLMENT', 'FINAL_BALANCE', 'FULL']).default('REGISTRATION'),
});

const verifyPaymentSchema = z
  .object({
    bookingId: z.string().min(1, 'Booking ID is required'),
    transactionId: z.string().optional(),
    orderId: z.string().optional(),
    paymentId: z.string().optional(),
    paymentMethod: z.string().default('SANDBOX_PAYMENT_GATEWAY'),
    method: z.string().optional(),
    status: z.string().optional(),
    signature: z.string().optional(),
    razorpay_order_id: z.string().optional(),
    razorpay_payment_id: z.string().optional(),
    razorpay_signature: z.string().optional(),
  })
  .transform((data) => ({
    bookingId: data.bookingId,
    transactionId: data.razorpay_payment_id || data.transactionId || data.paymentId || data.orderId || `TXN-${Date.now()}`,
    orderId: data.razorpay_order_id || data.orderId || null,
    paymentMethod: data.method || data.paymentMethod || 'SANDBOX_PAYMENT_GATEWAY',
    signature: data.razorpay_signature || data.signature || null,
  }));

// POST initialize / create payment order
router.post('/create-order', async (req, res, next) => {
  try {
    const { bookingId, installmentType } = createOrderSchema.parse(req.body);

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        departure: true,
        route: true,
        payments: { where: { status: 'SUCCESS' } },
      },
    });

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    if (booking.status === 'CANCELLED') {
      return res.status(400).json({ error: 'Cannot process payment for a cancelled booking' });
    }

    const totalPaidSoFar = booking.payments.reduce((sum, p) => sum + p.amount, 0);
    const remainingBalance = Math.max(0, booking.totalAmount - totalPaidSoFar);

    if (remainingBalance <= 0) {
      return res.status(400).json({ error: 'This booking is already fully paid.' });
    }

    // Determine amount to charge based on installment
    let amountToCharge = 0;
    const registrationDepositPerPerson = booking.passportType === 'INDIAN' ? 25000 : 25000; // in INR
    const totalRegistrationDeposit = registrationDepositPerPerson * booking.totalTravellers;

    if (installmentType === 'REGISTRATION') {
      amountToCharge = Math.min(totalRegistrationDeposit, remainingBalance);
    } else if (installmentType === 'FIRST_INSTALLMENT') {
      // 50% of total package cost (credited with registration deposit)
      const halfPackage = Math.round(booking.totalAmount * 0.5);
      amountToCharge = Math.min(Math.max(0, halfPackage - totalPaidSoFar), remainingBalance);
    } else if (installmentType === 'FINAL_BALANCE' || installmentType === 'FULL') {
      amountToCharge = remainingBalance;
    }

    const isSandbox = (process.env.PAYMENT_GATEWAY_MODE || 'sandbox') === 'sandbox';

    const generatedOrderId = `ORD_${Date.now()}_${Math.floor(1000 + Math.random() * 9000)}`;

    const orderPayload = {
      orderId: generatedOrderId,
      gatewayOrderId: generatedOrderId,
      bookingId: booking.id,
      bookingReference: booking.bookingReference,
      amount: amountToCharge,
      currency: booking.currency,
      installmentType,
      totalAmount: booking.totalAmount,
      totalPaidSoFar,
      remainingAfterPayment: Math.max(0, remainingBalance - amountToCharge),
      isSandbox,
      gatewayKey: isSandbox ? 'rzp_test_sandbox_mode' : process.env.RAZORPAY_KEY_ID,
      environmentNotice: isSandbox
        ? 'SANDBOX TEST ENVIRONMENT: Secure simulated payment transaction. Test cards and UPI IDs supported.'
        : 'PRODUCTION SECURE GATEWAY: 256-bit SSL encrypted transaction.',
    };

    res.json({ order: orderPayload });
  } catch (error) {
    next(error);
  }
});

// POST verify payment and authoritatively update booking & payment records
router.post('/verify', async (req, res, next) => {
  try {
    const { bookingId, transactionId, orderId, paymentMethod, signature } = verifyPaymentSchema.parse(req.body);

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        departure: true,
        route: true,
        payments: { where: { status: 'SUCCESS' } },
      },
    });

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    const isSandbox = (process.env.PAYMENT_GATEWAY_MODE || 'sandbox') === 'sandbox';

    if (!transactionId || transactionId.trim().length < 5) {
      return res.status(400).json({ error: 'Invalid payment transaction reference from gateway' });
    }

    // Cryptographic Signature Verification in Live Mode
    if (!isSandbox) {
      const secret = process.env.RAZORPAY_KEY_SECRET;
      if (!secret || secret.includes('placeholder')) {
        return res.status(500).json({ error: 'Production payment gateway secret is not properly configured.' });
      }
      if (!signature || !orderId) {
        return res.status(400).json({
          error: 'Cryptographic signature and gateway order ID are mandatory in production payment verification.',
        });
      }
      const generatedSignature = crypto
        .createHmac('sha256', secret)
        .update(`${orderId}|${transactionId}`)
        .digest('hex');

      if (generatedSignature !== signature) {
        return res.status(400).json({ error: 'Payment signature verification failed. Fraudulent transaction rejected.' });
      }
    }

    // Check for replay attack or duplicate transaction ID (with idempotent handling for verified re-requests)
    const existingTx = await prisma.payment.findUnique({ where: { transactionId } });
    if (existingTx) {
      if (existingTx.bookingId === booking.id && existingTx.status === 'SUCCESS') {
        return res.json({
          message: 'Payment already verified and recorded',
          payment: existingTx,
          booking,
          receipt: {
            receiptNumber: existingTx.receiptNumber,
            bookingReference: booking.bookingReference,
            contactName: booking.contactName,
            contactEmail: booking.contactEmail,
            amountPaid: existingTx.amount,
            currency: booking.currency,
            status: 'SUCCESS',
            date: existingTx.createdAt,
          },
        });
      }
      return res.status(400).json({ error: 'Transaction ID already recorded in system' });
    }

    const totalPaidBefore = booking.payments.reduce((sum, p) => sum + p.amount, 0);
    const balanceRemaining = Math.max(0, booking.totalAmount - totalPaidBefore);

    // Calculate installment amount (if balance remains, pay balance or registration amount)
    const depositTotal = 25000 * booking.totalTravellers;
    let paymentAmount = totalPaidBefore === 0 ? depositTotal : balanceRemaining;
    if (paymentAmount > balanceRemaining) paymentAmount = balanceRemaining;
    if (paymentAmount <= 0) paymentAmount = balanceRemaining;

    const newTotalPaid = totalPaidBefore + paymentAmount;
    const isNowFullyPaid = newTotalPaid >= booking.totalAmount;

    const receiptNumber = `REC-2027-${Math.floor(10000 + Math.random() * 90000)}`;

    const updated = await prisma.$transaction(async (tx) => {
      // 1. Create Payment record
      const payment = await tx.payment.create({
        data: {
          bookingId: booking.id,
          transactionId: transactionId || `TXN_${Date.now()}`,
          installmentType: isNowFullyPaid ? 'FULL' : totalPaidBefore === 0 ? 'REGISTRATION' : 'FINAL_BALANCE',
          receiptNumber,
          paymentMethod: isSandbox ? 'SANDBOX_SIMULATED_GATEWAY' : paymentMethod,
          amount: paymentAmount,
          currency: booking.currency,
          status: 'SUCCESS',
          webhookVerified: true,
          gatewayResponse: JSON.stringify({
            verifiedAt: new Date().toISOString(),
            isSandbox,
            signatureProvided: !!signature,
          }),
        },
      });

      // 2. Update Booking payment status and transition overall status to CONFIRMED
      const updatedBooking = await tx.booking.update({
        where: { id: booking.id },
        data: {
          paymentStatus: isNowFullyPaid ? 'PAID' : 'PARTIALLY_PAID',
          status: 'CONFIRMED', // Advance payment authoritatively confirms the booking
        },
        include: {
          departure: true,
          route: true,
          travellers: true,
          payments: true,
        },
      });

      // 3. Ensure departure batch seat inventory is updated and locked
      const departure = await tx.departure.findUnique({ where: { id: booking.departureId } });
      if (departure) {
        const activeTravellersCount = await tx.booking.aggregate({
          where: {
            departureId: departure.id,
            status: { in: ['CONFIRMED', 'PENDING'] },
          },
          _sum: { totalTravellers: true },
        });
        const totalBookedSeats = activeTravellersCount._sum.totalTravellers || departure.bookedSeats;
        let departureStatus = departure.status;
        if (totalBookedSeats >= departure.totalCapacity) {
          departureStatus = 'SOLD_OUT';
        } else if (departure.totalCapacity - totalBookedSeats <= 5) {
          departureStatus = 'FAST_FILLING';
        }
        await tx.departure.update({
          where: { id: departure.id },
          data: {
            bookedSeats: Math.min(departure.totalCapacity, totalBookedSeats),
            status: departureStatus,
          },
        });
      }

      // 4. Log audit entry
      await tx.auditLog.create({
        data: {
          userEmail: booking.contactEmail,
          action: 'PAYMENT_VERIFIED',
          entity: 'PAYMENT',
          entityId: payment.id,
          details: JSON.stringify({
            transactionId,
            receiptNumber,
            amount: paymentAmount,
            isNowFullyPaid,
            bookingStatus: 'CONFIRMED',
          }),
          ipAddress: req.ip,
        },
      });

      return { payment, booking: updatedBooking };
    });

    res.json({
      message: 'Payment verified and credited successfully',
      payment: updated.payment,
      booking: updated.booking,
      receipt: {
        receiptNumber,
        bookingReference: booking.bookingReference,
        contactName: booking.contactName,
        contactEmail: booking.contactEmail,
        route: booking.route.name,
        departureBatch: booking.departure.name,
        amountPaid: paymentAmount,
        currency: booking.currency,
        totalPaidToDate: newTotalPaid,
        outstandingBalance: Math.max(0, booking.totalAmount - newTotalPaid),
        status: 'SUCCESS',
        date: new Date().toISOString(),
      },
    });
  } catch (error) {
    next(error);
  }
});

// POST Webhook handler for asynchronous gateway notifications
router.post('/webhook', async (req, res) => {
  try {
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || process.env.RAZORPAY_KEY_SECRET;
    const signature = req.headers['x-razorpay-signature'];

    if (signature && webhookSecret && webhookSecret !== 'rzp_test_placeholder_key_secret') {
      const expectedSignature = crypto
        .createHmac('sha256', webhookSecret)
        .update(JSON.stringify(req.body))
        .digest('hex');

      if (signature !== expectedSignature) {
        console.warn('Payment webhook signature mismatch rejected');
        return res.status(400).json({ error: 'Invalid webhook signature' });
      }
    }

    const event = req.body?.event;
    const payload = req.body?.payload;

    if (event === 'payment.captured' || event === 'order.paid') {
      const paymentEntity = payload?.payment?.entity;
      const txnId = paymentEntity?.id || `WH_TXN_${Date.now()}`;
      const amount = paymentEntity ? Math.round(paymentEntity.amount / 100) : 0;
      const bookingRef = paymentEntity?.notes?.bookingReference;

      if (bookingRef) {
        const booking = await prisma.booking.findUnique({
          where: { bookingReference: bookingRef },
          include: { payments: true },
        });

        if (booking) {
          const alreadyRecorded = await prisma.payment.findUnique({
            where: { transactionId: txnId },
          });

          if (!alreadyRecorded) {
            const receiptNumber = `REC-2027-${Math.floor(10000 + Math.random() * 90000)}`;
            await prisma.$transaction(async (tx) => {
              await tx.payment.create({
                data: {
                  bookingId: booking.id,
                  transactionId: txnId,
                  installmentType: 'REGISTRATION',
                  receiptNumber,
                  paymentMethod: 'RAZORPAY_WEBHOOK',
                  amount: amount || 25000 * booking.totalTravellers,
                  currency: booking.currency,
                  status: 'SUCCESS',
                  webhookVerified: true,
                  gatewayResponse: JSON.stringify(paymentEntity),
                },
              });

              await tx.booking.update({
                where: { id: booking.id },
                data: {
                  status: 'CONFIRMED',
                  paymentStatus: 'PAID',
                },
              });
            });
          }
        }
      }
    }

    res.status(200).json({ status: 'ok', received: true });
  } catch (err) {
    console.error('Webhook error:', err);
    res.status(400).json({ error: 'Webhook processing error', details: err.message });
  }
});

export default router;
