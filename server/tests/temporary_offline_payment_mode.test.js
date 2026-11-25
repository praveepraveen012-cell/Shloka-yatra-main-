import { describe, it, before, after } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import app from '../src/index.js';
import prisma from '../src/prisma.js';

describe('Temporary Offline Test Payment Mode & Booking Workflow (Tests 1 - 6)', () => {
  let adminToken;
  let testDeparture;
  let testRoute;
  let testPricingTier;
  let createdTestBooking;
  let memberToken;

  before(async () => {
    // 1. Admin Authentication
    const adminRes = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'admin@shloka.com',
        password: process.env.ADMIN_TEMP_PASSWORD || 'ShlokaAdmin@2027',
      });
    assert.equal(adminRes.status, 200, `Admin login failed: ${JSON.stringify(adminRes.body)}`);
    adminToken = adminRes.body.token;

    // 2. Create a dedicated test departure batch with high capacity
    const ts = Date.now();
    const randomBatch = Math.floor(10000 + Math.random() * 90000);
    testDeparture = await prisma.departure.create({
      data: {
        batchNumber: randomBatch,
        name: `Offline Payment Test Batch ${randomBatch}`,
        slug: `offline-batch-${ts}`,
        arrivalDate: new Date('2027-05-15T00:00:00.000Z'),
        departureDate: new Date('2027-05-29T00:00:00.000Z'),
        totalCapacity: 50,
        bookedSeats: 0,
        totalDays: 14,
        status: 'OPEN',
      },
    });

    testRoute = await prisma.route.findFirst({
      where: { code: 'bus-both-ways' },
    });
    if (!testRoute) {
      testRoute = await prisma.route.findFirst();
    }
    testPricingTier = await prisma.pricingTier.findFirst({
      where: { routeId: testRoute.id, passportType: 'INDIAN' },
    });

    // 3. Register or authenticate a standard test member
    const uniqueEmail = `yatri.offline.${Date.now()}@example.com`;
    const memberRes = await request(app)
      .post('/api/membership/register')
      .send({
        firstName: 'Rameshwar',
        lastName: 'Sharma',
        email: uniqueEmail,
        mobile: `+9198${Math.floor(10000000 + Math.random() * 90000000)}`,
        password: 'DevoteePass@2027',
        confirmPassword: 'DevoteePass@2027',
        acceptTerms: true,
        acceptPrivacy: true,
      });
    memberToken = memberRes.body.token;
  });

  // TEST 1 – Complete registration with Offline Test Payment
  it('TEST 1: Complete registration with paymentMethod="OFFLINE_TEST" persists in DB with PENDING_CONFIRMATION / PENDING_VERIFICATION', async () => {
    const payload = {
      departureId: testDeparture.id,
      routeId: testRoute.id,
      passportType: 'INDIAN',
      contactName: 'Rameshwar Devotee Sharma',
      contactEmail: `yatri.test.${Date.now()}@shlloka.com`,
      contactPhone: '+91 98765 43210',
      notes: 'Address: Sector 62, Noida, Uttar Pradesh - 201309. Notes: Vegetarian sattvic meal requested.',
      paymentMethod: 'OFFLINE_TEST',
      travellers: [
        {
          fullName: 'Rameshwar Devotee Sharma',
          passportNumber: 'Z9876543',
          nationality: 'Indian',
          age: 48,
          gender: 'MALE',
          dietaryPreference: 'PURE_VEGETARIAN',
          medicalConditions: 'None',
          emergencyContactName: 'Sunita Sharma',
          emergencyContactRelationship: 'Spouse',
          emergencyContactPhone: '+91 98765 43211',
        },
      ],
      consent: {
        termsAccepted: true,
        cancellationAccepted: true,
        scheduleAccepted: true,
        riskAcknowledged: true,
        privacyConsent: true,
      },
    };

    const res = await request(app)
      .post('/api/bookings')
      .send(payload);

    assert.equal(res.status, 201, `Booking creation failed: ${JSON.stringify(res.body)}`);
    assert.ok(res.body.booking, 'Response must return created booking object');
    createdTestBooking = res.body.booking;

    // Verify booking reference adheres to SHY-2027-XXXXXX format
    assert.match(createdTestBooking.bookingReference, /^SHY-2027-\d{6}$/);
    assert.equal(createdTestBooking.status, 'PENDING_CONFIRMATION');
    assert.equal(createdTestBooking.paymentStatus, 'PENDING_VERIFICATION');
    assert.equal(createdTestBooking.paymentMethod, 'OFFLINE_TEST');
    assert.equal(createdTestBooking.totalTravellers, 1);
    assert.equal(createdTestBooking.baseAmount, testPricingTier.basePrice);

    // Verify SQLite database persistence directly
    const dbRecord = await prisma.booking.findUnique({
      where: { id: createdTestBooking.id },
      include: { travellers: true, payments: true },
    });
    assert.ok(dbRecord, 'Booking must exist in database');
    assert.equal(dbRecord.paymentMethod, 'OFFLINE_TEST');
    assert.equal(dbRecord.status, 'PENDING_CONFIRMATION');
    assert.equal(dbRecord.paymentStatus, 'PENDING_VERIFICATION');
    assert.equal(dbRecord.travellers.length, 1);
    assert.equal(dbRecord.travellers[0].fullName, 'Rameshwar Devotee Sharma');
    assert.equal(dbRecord.payments.length, 1);
    assert.equal(dbRecord.payments[0].status, 'PENDING_VERIFICATION');
  });

  // TEST 2 – Admin Panel retrieves test booking with complete details
  it('TEST 2: Admin Panel retrieves offline test booking with details, amounts and PENDING_VERIFICATION', async () => {
    // 1. List bookings filtered by PENDING_VERIFICATION
    const listRes = await request(app)
      .get('/api/admin/bookings?paymentStatus=PENDING_VERIFICATION')
      .set('Authorization', `Bearer ${adminToken}`);

    assert.equal(listRes.status, 200);
    const foundInList = listRes.body.bookings.find((b) => b.id === createdTestBooking.id);
    assert.ok(foundInList, 'Test booking must appear in Admin Bookings list');
    assert.equal(foundInList.paymentMethod, 'OFFLINE_TEST');
    assert.equal(foundInList.paymentStatus, 'PENDING_VERIFICATION');

    // 2. Retrieve detailed booking record
    const detailRes = await request(app)
      .get(`/api/admin/bookings/${createdTestBooking.id}`)
      .set('Authorization', `Bearer ${adminToken}`);

    assert.equal(detailRes.status, 200);
    const detail = detailRes.body.booking;
    assert.equal(detail.bookingReference, createdTestBooking.bookingReference);
    assert.equal(detail.contactName, 'Rameshwar Devotee Sharma');
    assert.equal(detail.passportType, 'INDIAN');
    assert.equal(detail.totalAmount, createdTestBooking.totalAmount);
    assert.equal(detail.paymentMethod, 'OFFLINE_TEST');
    assert.ok(detail.travellers && detail.travellers.length === 1);
    assert.equal(detail.travellers[0].passportNumber, 'Z9876543');
  });

  // TEST 3 – Database persistence & Admin Verification
  it('TEST 3: Admin verifies test payment, updating status to CONFIRMED / PAID with audit trail', async () => {
    const verifyRes = await request(app)
      .put(`/api/admin/bookings/${createdTestBooking.id}/verify-offline-payment`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        verifiedAmount: createdTestBooking.totalAmount,
        referenceNumber: 'UTR-TEST-BANK-998822',
        notes: 'Verified offline test remittance during QA execution.',
      });

    assert.equal(verifyRes.status, 200);
    assert.equal(verifyRes.body.booking.status, 'CONFIRMED');
    assert.equal(verifyRes.body.booking.paymentStatus, 'PAID');
    assert.ok(
      verifyRes.body.booking.offlinePaymentVerifiedBy === 'admin@shloka.com' ||
      verifyRes.body.booking.offlinePaymentVerifiedBy === 'admin@shlloka.com'
    );
    assert.ok(verifyRes.body.booking.offlinePaymentVerifiedAt);

    // Verify DB update
    const dbBooking = await prisma.booking.findUnique({
      where: { id: createdTestBooking.id },
      include: { payments: true },
    });
    assert.equal(dbBooking.status, 'CONFIRMED');
    assert.equal(dbBooking.paymentStatus, 'PAID');
    const successfulPayment = dbBooking.payments.find((p) => p.status === 'SUCCESS');
    assert.ok(successfulPayment, 'A SUCCESS payment record must be created or updated');
    assert.equal(successfulPayment.amount, createdTestBooking.totalAmount);
    assert.equal(successfulPayment.referenceNumber, 'UTR-TEST-BANK-998822');
  });

  // TEST 4 – Security & RBAC: Member cannot verify or alter payments
  it('TEST 4: Non-admin users cannot verify offline payments (HTTP 401/403) and pricing is authoritative', async () => {
    // 1. Unauthenticated request
    const unauthRes = await request(app)
      .put(`/api/admin/bookings/${createdTestBooking.id}/verify-offline-payment`)
      .send({ verifiedAmount: 1000 });
    assert.equal(unauthRes.status, 401);

    // 2. Regular member request
    const memberAttempt = await request(app)
      .put(`/api/admin/bookings/${createdTestBooking.id}/verify-offline-payment`)
      .set('Authorization', `Bearer ${memberToken}`)
      .send({ verifiedAmount: 1000 });
    assert.equal(memberAttempt.status, 403);

    // 3. Price tampering attempt on booking creation: user passes fake price
    const tamperPayload = {
      departureId: testDeparture.id,
      routeId: testRoute.id,
      passportType: 'INDIAN',
      contactName: 'Tamper Tester',
      contactEmail: 'tamper@test.com',
      contactPhone: '+91 99999 11111',
      totalAmount: 100, // Attempted price manipulation
      baseAmount: 100,
      paymentMethod: 'OFFLINE_TEST',
      travellers: [
        {
          fullName: 'Tamper Traveller',
          passportNumber: 'T9999999',
          nationality: 'Indian',
          age: 40,
          gender: 'MALE',
          emergencyContactName: 'Emergency',
          emergencyContactPhone: '+91 99999 22222',
        },
      ],
    };

    const tamperRes = await request(app).post('/api/bookings').send(tamperPayload);
    assert.equal(tamperRes.status, 201);
    // Backend must enforce real tier price regardless of client input
    assert.equal(tamperRes.body.booking.baseAmount, testPricingTier.basePrice);
    assert.notEqual(tamperRes.body.booking.baseAmount, 100);
  });

  // TEST 5 – Existing online payment remains completely intact
  it('TEST 5: Existing online payment workflow remains fully operational with paymentMethod="ONLINE"', async () => {
    // 1. Create booking in standard online mode
    const onlineBookingRes = await request(app)
      .post('/api/bookings')
      .send({
        departureId: testDeparture.id,
        routeId: testRoute.id,
        passportType: 'INDIAN',
        contactName: 'Online Devotee Test',
        contactEmail: `online.${Date.now()}@test.com`,
        contactPhone: '+91 98765 00000',
        paymentMethod: 'ONLINE',
        travellers: [
          {
            fullName: 'Online Devotee',
            passportNumber: 'P1122334',
            nationality: 'Indian',
            age: 45,
            gender: 'FEMALE',
            emergencyContactName: 'Emergency',
            emergencyContactPhone: '+91 98765 11111',
          },
        ],
      });

    assert.equal(onlineBookingRes.status, 201);
    const onlineBooking = onlineBookingRes.body.booking;
    assert.equal(onlineBooking.status, 'PENDING');
    assert.equal(onlineBooking.paymentStatus, 'UNPAID');
    assert.equal(onlineBooking.paymentMethod, 'ONLINE');

    // 2. Create online payment order
    const orderRes = await request(app)
      .post('/api/payments/create-order')
      .send({
        bookingId: onlineBooking.id,
        installmentType: 'REGISTRATION',
      });
    assert.equal(orderRes.status, 200);
    assert.ok(orderRes.body.order.orderId);
    assert.equal(orderRes.body.order.amount, 25000);

    // 3. Verify online payment
    const verifyRes = await request(app)
      .post('/api/payments/verify')
      .send({
        bookingId: onlineBooking.id,
        transactionId: `TXN-SANDBOX-${Date.now()}`,
        paymentMethod: 'UPI',
        signature: 'simulated_sig',
      });
    assert.equal(verifyRes.status, 200);
    assert.equal(verifyRes.body.payment.status, 'SUCCESS');
  });

  // TEST 6 – Feature Flag: Disable ENABLE_OFFLINE_TEST_PAYMENT and verify rejection
  it('TEST 6: Disabling ENABLE_OFFLINE_TEST_PAYMENT rejects offline test requests with HTTP 403', async () => {
    // Temporarily set flag to false
    const previousEnv = process.env.ENABLE_OFFLINE_TEST_PAYMENT;
    process.env.ENABLE_OFFLINE_TEST_PAYMENT = 'false';

    try {
      const offlineAttempt = await request(app)
        .post('/api/bookings')
        .send({
          departureId: testDeparture.id,
          routeId: testRoute.id,
          passportType: 'INDIAN',
          contactName: 'Blocked Offline User',
          contactEmail: 'blocked@test.com',
          contactPhone: '+91 98765 88888',
          paymentMethod: 'OFFLINE_TEST',
          travellers: [
            {
              fullName: 'Blocked User',
              passportNumber: 'B8888888',
              nationality: 'Indian',
              age: 42,
              gender: 'MALE',
              emergencyContactName: 'Contact',
              emergencyContactPhone: '+91 98765 77777',
            },
          ],
        });

      assert.equal(offlineAttempt.status, 403);
      assert.ok(offlineAttempt.body.error.includes('Offline test payment mode is disabled'));
    } finally {
      // Restore feature flag
      process.env.ENABLE_OFFLINE_TEST_PAYMENT = previousEnv || 'true';
    }
  });
});
