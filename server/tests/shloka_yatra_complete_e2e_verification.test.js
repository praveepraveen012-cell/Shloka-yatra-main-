import { test, describe, before } from 'node:test';
import assert from 'node:assert';
import request from 'supertest';
import app from '../src/index.js';
import prisma from '../src/prisma.js';
import { bootstrapAdmin, ADMIN_TEMPORARY_PASSWORD } from '../src/bootstrap.js';

describe('Shloka Yatra 2027 — End-to-End Authentication, Payment & Security Test Suite', async () => {
  let adminToken = '';
  let memberToken = '';
  let memberId = '';
  let memberClerkId = `user_clerk_test_${Date.now()}`;
  let memberEmail = `devotee.e2e.${Date.now()}@shlloka.com`;

  let routes = [];
  let departures = [];

  let bookingPkg1 = null;
  let bookingPkg2 = null;
  let bookingPkg3 = null;

  before(async () => {
    await bootstrapAdmin();

    // Fetch live routes and departures from database
    routes = await prisma.route.findMany({ where: { isActive: true } });
    departures = await prisma.departure.findMany({ where: { status: 'AVAILABLE' } });

    assert.ok(routes.length >= 3, 'Must have at least 3 active routes');
    assert.ok(departures.length >= 1, 'Must have at least 1 available departure batch');
  });

  // =========================================================================
  // SECTION 1: ADMIN AUTHENTICATION & ACCESS CONTROL
  // =========================================================================
  describe('1. Admin Authentication & Access Control', () => {
    test('1.1. Admin logs in via POST /api/auth/login and receives JWT with role ADMIN', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'admin@shloka.com',
          password: ADMIN_TEMPORARY_PASSWORD,
        });

      assert.strictEqual(res.status, 200);
      assert.ok(res.body.token, 'Token must be issued');
      assert.strictEqual(res.body.user.role, 'ADMIN');
      adminToken = res.body.token;
    });

    test('1.2. Public or unauthenticated request to /api/admin/dashboard-stats is rejected (401)', async () => {
      const res = await request(app).get('/api/admin/dashboard-stats');
      assert.strictEqual(res.status, 401);
    });
  });

  // =========================================================================
  // SECTION 2: CLERK AUTHENTICATION & GOOGLE SIGN-IN SYNCHRONIZATION
  // =========================================================================
  describe('2. Clerk Authentication & Member Synchronization', () => {
    test('2.1. Member authenticates via Clerk Google Sign-In and syncs with backend database', async () => {
      const clerkPayload = {
        clerkId: memberClerkId,
        email: memberEmail,
        firstName: 'Venkata',
        lastName: 'Ramanathan',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100',
        mobile: '+91 9840123456',
      };

      const res = await request(app)
        .post('/api/membership/clerk-sync')
        .send(clerkPayload);

      assert.strictEqual(res.status, 200);
      assert.ok(res.body.token, 'Must issue application session token');
      assert.ok(res.body.member, 'Member profile must be returned');
      assert.strictEqual(res.body.member.clerkId, memberClerkId);
      assert.strictEqual(res.body.member.email, memberEmail.toLowerCase());
      assert.ok(res.body.member.membershipReference.startsWith('SHL-MEM-2027-'));

      memberToken = res.body.token;
      memberId = res.body.member.id;
    });

    test('2.2. Subsequent Clerk login updates lastLoginAt without duplicate accounts (idempotency)', async () => {
      const res = await request(app)
        .post('/api/membership/clerk-sync')
        .send({
          clerkId: memberClerkId,
          email: memberEmail,
          firstName: 'Venkata',
          lastName: 'Ramanathan',
        });

      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.body.member.id, memberId, 'Member ID must be identical (no duplicate account)');
    });

    test('2.3. Member retrieves profile via GET /api/membership/me with session token', async () => {
      const res = await request(app)
        .get('/api/membership/me')
        .set('Authorization', `Bearer ${memberToken}`);

      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.body.member.id, memberId);
      assert.strictEqual(res.body.member.email, memberEmail.toLowerCase());
    });
  });

  // =========================================================================
  // SECTION 3: END-TO-END BOOKING FOR PACKAGES 1, 2, AND 3
  // =========================================================================
  describe('3. Pilgrimage Bookings (Packages 1, 2, and 3)', () => {
    test('3.1. Package 1 (Bus Overland) — Create booking with verified pricing', async () => {
      const pkg1 = routes.find((r) => r.code === 'bus-both-ways') || routes[0];
      const dep = departures[0];

      const res = await request(app)
        .post('/api/bookings')
        .send({
          routeId: pkg1.id,
          departureId: dep.id,
          passportType: 'INDIAN',
          contactName: 'Venkata Ramanathan',
          contactEmail: memberEmail,
          contactPhone: '+91 9840123456',
          notes: 'Special senior devotee assistance requested at Kerung border',
          travellers: [
            {
              fullName: 'Venkata Ramanathan',
              passportNumber: 'Z8765432',
              nationality: 'Indian',
              age: 52,
              gender: 'MALE',
              dietaryPreference: 'PURE_VEGETARIAN',
              medicalConditions: 'Mild hypertension, controlled',
              emergencyContactName: 'Lakshmi Ramanathan',
              emergencyContactPhone: '+91 9840123457',
            },
          ],
          consent: {
            termsAccepted: true,
            cancellationAccepted: true,
            scheduleAccepted: true,
            riskAcknowledged: true,
            privacyConsent: true,
          },
        });

      assert.ok([200, 201].includes(res.status), `Booking creation must return 200/201, got ${res.status}`);
      assert.ok(res.body.booking);
      assert.ok(res.body.booking.bookingReference.startsWith('SHY-2027-'));
      assert.strictEqual(res.body.booking.totalTravellers, 1);
      assert.strictEqual(res.body.booking.status, 'PENDING');
      bookingPkg1 = res.body.booking;
    });

    test('3.2. Package 2 (Flight to Lhasa) — Create multi-traveller booking', async () => {
      const pkg2 = routes.find((r) => r.code === 'flight-to-lhasa') || routes[1];
      const dep = departures[0];

      const res = await request(app)
        .post('/api/bookings')
        .send({
          routeId: pkg2.id,
          departureId: dep.id,
          passportType: 'INDIAN',
          contactName: 'Venkata Ramanathan',
          contactEmail: memberEmail,
          contactPhone: '+91 9840123456',
          travellers: [
            {
              fullName: 'Venkata Ramanathan',
              passportNumber: 'Z8765432',
              nationality: 'Indian',
              age: 52,
              gender: 'MALE',
              emergencyContactName: 'Lakshmi Ramanathan',
              emergencyContactPhone: '+91 9840123457',
            },
            {
              fullName: 'Lakshmi Ramanathan',
              passportNumber: 'Z8765433',
              nationality: 'Indian',
              age: 48,
              gender: 'FEMALE',
              emergencyContactName: 'Karthik Ramanathan',
              emergencyContactPhone: '+91 9840123458',
            },
          ],
        });

      assert.ok([200, 201].includes(res.status), `Booking creation must return 200/201, got ${res.status}`);
      assert.ok(res.body.booking);
      assert.strictEqual(res.body.booking.totalTravellers, 2);
      bookingPkg2 = res.body.booking;
    });

    test('3.3. Package 3 (Flight Lhasa-Ali-Pulan) — Create Foreign/NRI passport booking', async () => {
      const pkg3 = routes.find((r) => r.code === 'lhasa-ali-pulan') || routes[2];
      const dep = departures[0];

      const res = await request(app)
        .post('/api/bookings')
        .send({
          routeId: pkg3.id,
          departureId: dep.id,
          passportType: 'FOREIGN',
          contactName: 'Venkata Ramanathan',
          contactEmail: memberEmail,
          contactPhone: '+91 9840123456',
          travellers: [
            {
              fullName: 'Devotee Overseas',
              passportNumber: 'USA-9988776',
              nationality: 'American',
              age: 45,
              gender: 'MALE',
              emergencyContactName: 'Spouse Name',
              emergencyContactPhone: '+1 415 555 2671',
            },
          ],
        });

      assert.ok([200, 201].includes(res.status), `Booking creation must return 200/201, got ${res.status}`);
      assert.ok(res.body.booking);
      assert.strictEqual(res.body.booking.passportType, 'FOREIGN');
      bookingPkg3 = res.body.booking;
    });

    test('3.4. Member Dashboard retrieves all 3 bookings linked to user profile', async () => {
      const res = await request(app)
        .get('/api/membership/bookings')
        .set('Authorization', `Bearer ${memberToken}`);

      assert.strictEqual(res.status, 200);
      assert.ok(res.body.bookings.length >= 3, 'Must contain all 3 devotee bookings');
      const refs = res.body.bookings.map((b) => b.bookingReference);
      assert.ok(refs.includes(bookingPkg1.bookingReference));
      assert.ok(refs.includes(bookingPkg2.bookingReference));
      assert.ok(refs.includes(bookingPkg3.bookingReference));
    });

    test('3.5. Admin Panel retrieves all bookings including Package 1, 2, and 3', async () => {
      const res = await request(app)
        .get('/api/admin/bookings')
        .set('Authorization', `Bearer ${adminToken}`);

      assert.strictEqual(res.status, 200);
      assert.ok(res.body.bookings.length >= 3);
      const refs = res.body.bookings.map((b) => b.bookingReference);
      assert.ok(refs.includes(bookingPkg1.bookingReference));
    });
  });

  // =========================================================================
  // SECTION 4: PAYMENT ORDER CREATION, VERIFICATION & WEBHOOK PROCESSING
  // =========================================================================
  describe('4. Complete Payment Processing & State Transitions', () => {
    let paymentTxnId = `TXN_TEST_${Date.now()}`;
    let generatedReceiptNumber = '';

    test('4.1. Create payment order for booking deposit (POST /api/payments/create-order)', async () => {
      const res = await request(app)
        .post('/api/payments/create-order')
        .send({
          bookingId: bookingPkg1.id,
          installmentType: 'REGISTRATION',
        });

      assert.strictEqual(res.status, 200);
      assert.ok(res.body.order.orderId);
      assert.strictEqual(res.body.order.amount, 25000); // 1 traveller registration deposit
      assert.strictEqual(res.body.order.bookingReference, bookingPkg1.bookingReference);
    });

    test('4.2. Authoritatively verify payment (POST /api/payments/verify)', async () => {
      const res = await request(app)
        .post('/api/payments/verify')
        .send({
          bookingId: bookingPkg1.id,
          transactionId: paymentTxnId,
          paymentMethod: 'SANDBOX_UPI_GATEWAY',
          signature: 'simulated_hmac_sha256_signature_pass',
        });

      assert.strictEqual(res.status, 200);
      assert.ok(res.body.payment);
      assert.strictEqual(res.body.payment.status, 'SUCCESS');
      assert.ok(res.body.receipt.receiptNumber.startsWith('REC-2027-'));
      generatedReceiptNumber = res.body.receipt.receiptNumber;

      // Check authoritative booking transition to CONFIRMED
      assert.strictEqual(res.body.booking.status, 'CONFIRMED');
      assert.strictEqual(res.body.booking.paymentStatus, 'PARTIALLY_PAID');
    });

    test('4.3. Idempotency: Re-submitting the same verified payment returns idempotent success', async () => {
      const res = await request(app)
        .post('/api/payments/verify')
        .send({
          bookingId: bookingPkg1.id,
          transactionId: paymentTxnId,
        });

      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.body.receipt.receiptNumber, generatedReceiptNumber);
    });

    test('4.4. Security: Replay attack with same transaction ID on a different booking is rejected (400)', async () => {
      const res = await request(app)
        .post('/api/payments/verify')
        .send({
          bookingId: bookingPkg2.id,
          transactionId: paymentTxnId, // Reusing txn from booking 1
        });

      assert.strictEqual(res.status, 400);
      assert.ok(res.body.error.includes('already recorded'));
    });

    test('4.5. Webhook: Asynchronous gateway notification processes successfully (POST /api/payments/webhook)', async () => {
      const res = await request(app)
        .post('/api/payments/webhook')
        .send({
          event: 'payment.captured',
          payload: {
            payment: {
              entity: {
                id: `pay_webhook_${Date.now()}`,
                amount: 5000000, // 50,000 INR in paise
                notes: { bookingReference: bookingPkg2.bookingReference },
              },
            },
          },
        });

      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.body.status, 'ok');
    });

    test('4.6. Admin Panel displays updated revenue and payment transactions', async () => {
      const res = await request(app)
        .get('/api/admin/dashboard-stats')
        .set('Authorization', `Bearer ${adminToken}`);

      assert.strictEqual(res.status, 200);
      const stats = res.body.stats || res.body;
      assert.ok(stats.totalAmountCollected > 0, 'Total collected revenue must be greater than zero');
      assert.ok(stats.totalBookings >= 3, 'Total bookings must be at least 3');
    });
  });

  // =========================================================================
  // SECTION 5: SECURITY AUDIT, HEADERS & RBAC VERIFICATION
  // =========================================================================
  describe('5. Application Security & Access Hardening', () => {
    test('5.1. Standard security headers (X-Content-Type-Options, X-Frame-Options) are enforced', async () => {
      const res = await request(app).get('/api/health');
      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.headers['x-content-type-options'], 'nosniff');
      assert.strictEqual(res.headers['x-frame-options'], 'SAMEORIGIN');
    });

    test('5.2. Role-Based Access Control: Regular Member token is rejected on Admin routes (403)', async () => {
      const res = await request(app)
        .get('/api/admin/dashboard-stats')
        .set('Authorization', `Bearer ${memberToken}`); // Member token, not Admin

      assert.strictEqual(res.status, 403);
      assert.ok(res.body.error);
    });

    test('5.3. Secret Exposure Check: Health and Public endpoints never leak private keys', async () => {
      const res = await request(app).get('/api/health');
      const bodyStr = JSON.stringify(res.body);
      assert.ok(!bodyStr.includes('JWT_SECRET'));
      assert.ok(!bodyStr.includes('CLERK_SECRET_KEY'));
      assert.ok(!bodyStr.includes('RAZORPAY_KEY_SECRET'));
    });
  });
});
