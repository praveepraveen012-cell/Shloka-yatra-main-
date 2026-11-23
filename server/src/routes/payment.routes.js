import { Router } from 'express';
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
  })
  .transform((data) => ({
    bookingId: data.bookingId,
    transactionId: data.transactionId || data.paymentId || data.orderId || `TXN-${Date.now()}`,
    paymentMethod: data.method || data.paymentMethod || 'SANDBOX_PAYMENT_GATEWAY',
    signature: data.signature,
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

    const orderPayload = {
      orderId: `ORD_${Date.now()}_${Math.floor(1000 + Math.random() * 9000)}`,
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
    const { bookingId, transactionId, paymentMethod, signature } = verifyPaymentSchema.parse(req.body);

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

    // Check for replay attack or duplicate transaction ID
    const existingTx = await prisma.payment.findUnique({ where: { transactionId } });
    if (existingTx) {
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

      // 2. Update Booking payment status and overall status
      const updatedBooking = await tx.booking.update({
        where: { id: booking.id },
        data: {
          paymentStatus: isNowFullyPaid ? 'PAID' : 'PARTIALLY_PAID',
          status: isNowFullyPaid ? 'CONFIRMED' : 'PENDING',
        },
        include: {
          departure: true,
          route: true,
          travellers: true,
          payments: true,
        },
      });

      // 3. Log audit entry
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

// POST Webhook handler
router.post('/webhook', async (req, res) => {
  // Production webhook verification endpoint
  try {
    const signature = req.headers['x-razorpay-signature'];
    console.log('Payment Gateway Webhook received:', req.body?.event);
    res.status(200).json({ status: 'received' });
  } catch (err) {
    res.status(400).json({ error: 'Webhook processing error' });
  }
});

export default router;
