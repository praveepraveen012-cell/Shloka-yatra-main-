import { test, describe, before } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import app from '../src/index.js';
import prisma from '../src/prisma.js';

describe('Offline Payment Option Workflow Test Suite', () => {
  let adminToken;
  let testDeparture;
  let testRoute;
  let memberToken;
  let testMember;
  let offlineBooking;

  before(async () => {
    // 1. Authenticate Admin
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'admin@shloka.com',
        password: process.env.ADMIN_TEMP_PASSWORD || 'ShlokaAdmin@2027',
      });
    assert.equal(loginRes.status, 200, 'Admin login must succeed');
    adminToken = loginRes.body.token;

    // 2. Fetch routes and select Route 1
    const routesRes = await request(app).get('/api/routes');
    assert.equal(routesRes.status, 200);
    testRoute = routesRes.body.routes[0];
    assert.ok(testRoute, 'Must have at least 1 route');

    // 3. Create a dedicated test departure batch
    const ts = Date.now();
    const randomBatch = Math.floor(1000 + Math.random() * 9000);
    testDeparture = await prisma.departure.create({
      data: {
        batchNumber: randomBatch,
        name: `Offline Payment Test Batch ${randomBatch}`,
        slug: `offline-batch-${ts}`,
        arrivalDate: new Date('2027-05-15T00:00:00.000Z'),
        departureDate: new Date('2027-05-28T00:00:00.000Z'),
        totalDays: 14,
        totalCapacity: 30,
        bookedSeats: 0,
        status: 'AVAILABLE',
        isFullMoon: true,
      },
    });

    // 4. Create and register a test member
    const memberEmail = `offline.devotee.${ts}@example.com`;
    const regRes = await request(app)
      .post('/api/membership/register')
      .send({
        firstName: 'Ananya',
        lastName: 'Deshmukh',
        email: memberEmail,
        countryCode: '+91',
        mobile: `+91 98${Math.floor(10000000 + Math.random() * 90000000)}`,
        password: 'Password@2027',
        confirmPassword: 'Password@2027',
        acceptTerms: true,
        acceptPrivacy: true,
        isMobileVerified: false, // OTP is optional
      });
    assert.equal(regRes.status, 201, 'Member registration must succeed without mandatory OTP');
    memberToken = regRes.body.token;
    testMember = regRes.body.member;
  });

  // TEST CASE 1: Select offline payment and complete registration
  test('TC1: Create booking with paymentMethod="OFFLINE" in database', async () => {
    const bookingPayload = {
      departureId: testDeparture.id,
      routeId: testRoute.id,
      passportType: 'INDIAN',
      contactName: 'Ananya Deshmukh',
      contactEmail: testMember.email,
      contactPhone: '+91 9876543210',
      notes: 'Testing complete booking workflow with offline payment',
      paymentMethod: 'OFFLINE',
      travellers: [
        {
          fullName: 'Ananya Deshmukh',
          passportNumber: 'Z8899112',
          nationality: 'Indian',
          age: 48,
          gender: 'FEMALE',
          dietaryPreference: 'PURE_VEGETARIAN',
          emergencyContactName: 'Rohan Deshmukh',
          emergencyContactPhone: '+91 9876543211',
          isPrimary: true,
        },
      ],
    };

    const res = await request(app)
      .post('/api/bookings')
      .send(bookingPayload);

    assert.equal(res.status, 201, 'Booking creation must succeed');
    assert.ok(res.body.booking, 'Response must contain booking object');
    assert.ok(res.body.booking.bookingReference, 'Must generate unique bookingReference');

    offlineBooking = res.body.booking;

    // Verify database persistence and offline attributes
    const savedBooking = await prisma.booking.findUnique({
      where: { id: offlineBooking.id },
      include: { payments: true, travellers: true },
    });

    assert.ok(savedBooking, 'Booking must exist in SQLite database');
    assert.equal(savedBooking.paymentMethod, 'OFFLINE', 'paymentMethod must be OFFLINE');
    assert.equal(savedBooking.paymentStatus, 'PENDING_VERIFICATION', 'paymentStatus must be PENDING_VERIFICATION');
    assert.equal(savedBooking.status, 'PENDING_CONFIRMATION', 'status must be PENDING_CONFIRMATION');
    assert.ok(savedBooking.payments.length >= 1, 'Initial Payment transaction must be created');
    assert.equal(savedBooking.payments[0].status, 'PENDING_VERIFICATION', 'Initial payment status must be PENDING_VERIFICATION');
    assert.equal(savedBooking.payments[0].paymentMethod, 'OFFLINE', 'Payment method must be OFFLINE');
  });

  // TEST CASE 2: View offline booking in Admin Panel
  test('TC2: Admin can retrieve and view offline booking with PENDING_VERIFICATION', async () => {
    // 1. Search in admin bookings list
    const listRes = await request(app)
      .get(`/api/admin/bookings?paymentStatus=PENDING_VERIFICATION`)
      .set('Authorization', `Bearer ${adminToken}`);

    assert.equal(listRes.status, 200, 'Admin bookings list query must succeed');
    const matchInList = listRes.body.bookings.find((b) => b.id === offlineBooking.id);
    assert.ok(matchInList, 'Offline booking must be found under PENDING_VERIFICATION filter');
    assert.equal(matchInList.paymentMethod, 'OFFLINE');

    // 2. View booking detail
    const detailRes = await request(app)
      .get(`/api/admin/bookings/${offlineBooking.id}`)
      .set('Authorization', `Bearer ${adminToken}`);

    assert.equal(detailRes.status, 200, 'Admin booking detail must succeed');
    assert.equal(detailRes.body.booking.paymentMethod, 'OFFLINE');
    assert.equal(detailRes.body.booking.paymentStatus, 'PENDING_VERIFICATION');
    assert.equal(detailRes.body.booking.status, 'PENDING_CONFIRMATION');
  });

  // TEST CASE 3: Admin verify offline payment
  test('TC3: Admin verifies offline payment, records verified amount, timestamp, updates to PAID/CONFIRMED', async () => {
    const verifyPayload = {
      verifiedAmount: offlineBooking.totalAmount,
      referenceNumber: 'UTR-HDFC-99882211',
      notes: 'NEFT credit verified in primary pilgrimage operations bank statement',
    };

    const verifyRes = await request(app)
      .put(`/api/admin/bookings/${offlineBooking.id}/verify-offline-payment`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send(verifyPayload);

    assert.equal(verifyRes.status, 200, 'Verify offline payment must succeed');
    assert.equal(verifyRes.body.booking.paymentStatus, 'PAID', 'paymentStatus must be updated to PAID');
    assert.equal(verifyRes.body.booking.status, 'CONFIRMED', 'Booking status must be updated to CONFIRMED');
    assert.ok(verifyRes.body.booking.offlinePaymentVerifiedAt, 'Verification timestamp must be recorded');
    assert.equal(verifyRes.body.booking.offlinePaymentVerifiedBy, 'admin@shloka.com', 'Admin email must be recorded');

    // Check payment record status in DB
    const updatedPayment = await prisma.payment.findFirst({
      where: { bookingId: offlineBooking.id, status: 'SUCCESS' },
    });
    assert.ok(updatedPayment, 'Payment transaction must be updated to SUCCESS');
    assert.equal(updatedPayment.referenceNumber, 'UTR-HDFC-99882211');

    // Check audit log
    const audit = await prisma.auditLog.findFirst({
      where: { entityId: offlineBooking.id, action: 'OFFLINE_PAYMENT_VERIFIED' },
    });
    assert.ok(audit, 'Audit log entry must be created for OFFLINE_PAYMENT_VERIFIED');
  });

  // TEST CASE 4: Admin reject offline payment
  test('TC4: Admin rejects offline payment with required reason, updating status to REJECTED', async () => {
    // Create another offline booking specifically to test rejection
    const rejectBookingRes = await request(app)
      .post('/api/bookings')
      .send({
        departureId: testDeparture.id,
        routeId: testRoute.id,
        passportType: 'INDIAN',
        contactName: 'Vikram Joshi',
        contactEmail: 'vikram.joshi@example.com',
        contactPhone: '+91 9811223344',
        paymentMethod: 'OFFLINE',
        travellers: [
          {
            fullName: 'Vikram Joshi',
            passportNumber: 'V1122334',
            nationality: 'Indian',
            age: 52,
            gender: 'MALE',
            dietaryPreference: 'PURE_VEGETARIAN',
            emergencyContactName: 'Sunita Joshi',
            emergencyContactPhone: '+91 9811223355',
            isPrimary: true,
          },
        ],
      });

    assert.equal(rejectBookingRes.status, 201);
    const rejectBookingId = rejectBookingRes.body.booking.id;

    // Test rejection without reason (must fail validation)
    const failRes = await request(app)
      .put(`/api/admin/bookings/${rejectBookingId}/reject-offline-payment`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({});
    assert.equal(failRes.status, 400, 'Rejection without reason must fail');

    // Reject with valid reason
    const rejectRes = await request(app)
      .put(`/api/admin/bookings/${rejectBookingId}/reject-offline-payment`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        rejectionReason: 'Bank remittance not received within 7 business days. Invalid reference number provided.',
      });

    assert.equal(rejectRes.status, 200, 'Rejection with reason must succeed');
    assert.equal(rejectRes.body.booking.paymentStatus, 'REJECTED', 'paymentStatus must be REJECTED');
    assert.ok(rejectRes.body.booking.offlinePaymentRejectionReason.includes('Bank remittance not received'));

    // Check DB payment status
    const failedPayment = await prisma.payment.findFirst({
      where: { bookingId: rejectBookingId, status: 'FAILED' },
    });
    assert.ok(failedPayment, 'Payment transaction must be marked as FAILED');
  });

  // TEST CASE 5: Devotee / Member Dashboard visibility
  test('TC5: Devotee can view their offline booking and payment status in Member Dashboard', async () => {
    // 1. Verify Member Profile retrieval
    const memberProfileRes = await request(app)
      .get('/api/membership/me')
      .set('Authorization', `Bearer ${memberToken}`);
    assert.equal(memberProfileRes.status, 200, 'Member profile retrieval must succeed');
    assert.equal(memberProfileRes.body.member.email, testMember.email);

    // 2. Verify Member Bookings retrieval (dashboard tab)
    const memberBookingsRes = await request(app)
      .get('/api/membership/bookings')
      .set('Authorization', `Bearer ${memberToken}`);

    assert.equal(memberBookingsRes.status, 200, 'Member bookings retrieval must succeed');
    const memberBookings = memberBookingsRes.body.bookings;
    assert.ok(memberBookings && memberBookings.length >= 1, 'Member must see their booking');

    const devBooking = memberBookings.find((b) => b.id === offlineBooking.id);
    assert.ok(devBooking, 'Offline booking must be present in member bookings');
    assert.equal(devBooking.paymentMethod, 'OFFLINE');
    assert.equal(devBooking.totalAmount, offlineBooking.totalAmount);
    assert.equal(devBooking.depositPaid, offlineBooking.totalAmount, 'Verified amount must reflect as paid');
    assert.equal(devBooking.balanceDue, 0, 'Balance due must be zero once fully verified');
  });

  // TEST CASE 6: Security and access control
  test('TC6: Non-admin users cannot verify or reject offline payments (HTTP 401/403)', async () => {
    // 1. Unauthenticated request to verify
    const unauthVerify = await request(app)
      .put(`/api/admin/bookings/${offlineBooking.id}/verify-offline-payment`)
      .send({ verifiedAmount: 1000 });
    assert.equal(unauthVerify.status, 401, 'Unauthenticated verify must return 401');

    // 2. Member trying to call admin verification
    const memberVerify = await request(app)
      .put(`/api/admin/bookings/${offlineBooking.id}/verify-offline-payment`)
      .set('Authorization', `Bearer ${memberToken}`)
      .send({ verifiedAmount: 1000 });
    assert.equal(memberVerify.status, 403, 'Member token cannot verify payment (must return 403)');

    // 3. Member trying to call admin rejection
    const memberReject = await request(app)
      .put(`/api/admin/bookings/${offlineBooking.id}/reject-offline-payment`)
      .set('Authorization', `Bearer ${memberToken}`)
      .send({ rejectionReason: 'Hacking attempt' });
    assert.equal(memberReject.status, 403, 'Member token cannot reject payment (must return 403)');
  });
});
