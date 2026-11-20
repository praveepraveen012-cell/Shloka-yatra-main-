import { test, describe, before, after } from 'node:test';
import assert from 'node:assert';
import request from 'supertest';
import app from '../src/index.js';
import prisma from '../src/prisma.js';

let adminToken;
let memberToken;
let createdBookingId;
let createdBookingRef;
let createdDocId;
let createdRefundId;

after(async () => {
  await prisma.$disconnect();
});

describe('Shlloka Yatra 2027 Full Stack API & Business Logic Test Suite', () => {
  // TEST 1: Health & System Baseline
  test('1. GET /api/health should return operational status', async () => {
    const res = await request(app).get('/api/health');
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.status, 'ok');
    assert.strictEqual(res.body.service, 'Shloka Yatra Backend API');
  });

  // TEST 2: Departures and Batches
  test('2. GET /api/departures should return all 8 configured 2027 departure batches', async () => {
    const res = await request(app).get('/api/departures');
    assert.strictEqual(res.status, 200);
    assert.ok(Array.isArray(res.body.departures));
    assert.strictEqual(res.body.departures.length, 8);
    assert.ok(res.body.departures[0].name.includes('May'));
    assert.strictEqual(res.body.departures[0].isFullMoon, true);
    assert.ok(typeof res.body.departures[0].remainingSeats === 'number');
  });

  // TEST 3: Routes and Itineraries
  test('3. GET /api/routes should return all 3 pilgrimage travel routes with itineraries and highlights', async () => {
    const res = await request(app).get('/api/routes');
    assert.strictEqual(res.status, 200);
    assert.ok(Array.isArray(res.body.routes));
    assert.strictEqual(res.body.routes.length, 3);

    const codes = res.body.routes.map((r) => r.code);
    assert.ok(codes.includes('bus-both-ways'));
    assert.ok(codes.includes('flight-to-lhasa'));
    assert.ok(codes.includes('lhasa-ali-pulan'));

    const route1 = res.body.routes.find((r) => r.code === 'bus-both-ways');
    assert.ok(Array.isArray(route1.highlights));
    assert.ok(Array.isArray(route1.itinerary));
    assert.ok(route1.itinerary.length >= 14);
  });

  // TEST 4: Pricing Quotation Calculation
  test('4. POST /api/pricing/calculate should accurately compute package base, 5% GST and deposit', async () => {
    const routesRes = await request(app).get('/api/routes');
    const route1 = routesRes.body.routes.find((r) => r.code === 'bus-both-ways');

    // Indian Passport: 2 travellers
    const res = await request(app)
      .post('/api/pricing/calculate')
      .send({
        routeId: route1.id,
        passportType: 'INDIAN',
        travellersCount: 2,
      });

    assert.strictEqual(res.status, 200);
    const { calculation } = res.body;
    assert.strictEqual(calculation.basePricePerPerson, 350000);
    assert.strictEqual(calculation.baseAmount, 700000);
    assert.strictEqual(calculation.gstAmount, 35000); // 5% GST
    assert.strictEqual(calculation.totalAmount, 735000);
    assert.strictEqual(calculation.depositAmount, 50000); // 25,000 * 2
  });

  // TEST 5: Authentication & RBAC Login
  test('5. POST /api/auth/login should authenticate Admin and issue JWT token', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'admin@shloka.com',
        password: 'Shloka#2027$AdminKailash!Secure',
      });

    assert.strictEqual(res.status, 200);
    assert.ok(res.body.token);
    assert.ok(['SUPER_ADMIN', 'ADMIN'].includes(res.body.user.role));
    adminToken = res.body.token;
  });

  // TEST 6: Enquiry Submission & Admin Verification (USER JOURNEY 1)
  test('6. POST /api/enquiries submits enquiry, and Admin can view it in CRM', async () => {
    const enquiryPayload = {
      name: 'Vaidyanathan Iyer',
      email: 'v.iyer@example.com',
      phone: '+91 9841098765',
      preferredBatch: 'may-batch-full-moon-2027',
      preferredRoute: 'Option 1: Classic Overland',
      travellersCount: 2,
      message: 'Looking for twin sharing room in Kathmandu and pure vegetarian sattvic food guidance.',
    };

    const submitRes = await request(app).post('/api/enquiries').send(enquiryPayload);
    assert.strictEqual(submitRes.status, 201);
    assert.ok(submitRes.body.enquiry.id);

    // Admin CRM listing
    const adminEnqRes = await request(app)
      .get('/api/admin/enquiries')
      .set('Authorization', `Bearer ${adminToken}`);
    assert.strictEqual(adminEnqRes.status, 200);
    const found = adminEnqRes.body.enquiries.find((e) => e.email === 'v.iyer@example.com');
    assert.ok(found);
    assert.strictEqual(found.status, 'NEW');
  });

  // TEST 7: Complete Multi-Step Booking Registration (USER JOURNEY 2)
  test('7. POST /api/bookings should validate travellers, reserve capacity and create booking', async () => {
    const depRes = await request(app).get('/api/departures');
    const dep2 = depRes.body.departures.find((d) => d.batchNumber === 2);
    const routesRes = await request(app).get('/api/routes');
    const route2 = routesRes.body.routes.find((r) => r.code === 'flight-to-lhasa');

    const initialSeats = dep2.bookedSeats;

    const bookingPayload = {
      departureId: dep2.id,
      routeId: route2.id,
      passportType: 'INDIAN',
      contactName: 'Kalyan Sundaram',
      contactEmail: 'kalyan.sundaram@example.com',
      contactPhone: '+91 9840998877',
      notes: 'Please arrange airport assistance in Kathmandu.',
      travellers: [
        {
          fullName: 'Kalyan Sundaram',
          passportNumber: 'Z9876543',
          nationality: 'Indian',
          age: 46,
          gender: 'MALE',
          medicalConditions: 'Mild hypertension, clinically controlled',
          allergies: 'None',
          dietaryPreference: 'PURE_VEGETARIAN',
          emergencyContactName: 'Geetha Sundaram',
          emergencyContactRelationship: 'Spouse',
          emergencyContactPhone: '+91 9840998878',
          isPrimary: true,
        },
      ],
      consent: {
        termsAccepted: true,
        cancellationAccepted: true,
        scheduleAccepted: true,
        riskAcknowledged: true,
        privacyConsent: true,
        marketingConsent: true,
        publicityConsent: false,
      },
    };

    const res = await request(app).post('/api/bookings').send(bookingPayload);
    assert.strictEqual(res.status, 201);
    assert.ok(res.body.booking.bookingReference.startsWith('SHY-2027-'));
    assert.strictEqual(res.body.booking.status, 'PENDING');
    assert.strictEqual(res.body.booking.totalTravellers, 1);
    // Base 437000 + 5% GST = 458850
    assert.strictEqual(res.body.booking.totalAmount, 458850);

    createdBookingId = res.body.booking.id;
    createdBookingRef = res.body.booking.bookingReference;

    // Verify seat capacity updated on departure batch
    const checkDep = await request(app).get(`/api/departures/${dep2.id}`);
    assert.strictEqual(checkDep.body.departure.bookedSeats, initialSeats + 1);
  });

  // TEST 8: Document Upload & Verification Workflow
  test('8. POST /api/bookings/:id/documents attaches participant document and Admin can verify', async () => {
    const uploadRes = await request(app)
      .post(`/api/bookings/${createdBookingId}/documents`)
      .send({
        documentType: 'PASSPORT',
        originalFilename: 'kalyan_passport_scan.pdf',
        filePath: '/uploads/documents/kalyan_passport_scan.pdf',
        fileSizeBytes: 1450200,
        mimeType: 'application/pdf',
      });

    assert.strictEqual(uploadRes.status, 201);
    assert.strictEqual(uploadRes.body.document.status, 'PENDING');
    createdDocId = uploadRes.body.document.id;

    // Admin verifies document
    const verifyRes = await request(app)
      .put(`/api/admin/documents/${createdDocId}/verify`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ status: 'VERIFIED' });

    assert.strictEqual(verifyRes.status, 200);
    assert.strictEqual(verifyRes.body.document.status, 'VERIFIED');
  });

  // TEST 9: Payment Order Creation and Sandbox Verification (USER JOURNEY 3)
  test('9. POST /api/payments/create-order and /verify processes deposit and updates status', async () => {
    // 1. Create order for registration deposit
    const orderRes = await request(app)
      .post('/api/payments/create-order')
      .send({
        bookingId: createdBookingId,
        installmentType: 'REGISTRATION',
      });

    assert.strictEqual(orderRes.status, 200);
    assert.strictEqual(orderRes.body.order.amount, 25000);
    assert.strictEqual(orderRes.body.order.isSandbox, true);

    // 2. Verify payment with simulated gateway transaction
    const txnId = `TXN_TEST_${Date.now()}`;
    const verifyRes = await request(app)
      .post('/api/payments/verify')
      .send({
        bookingId: createdBookingId,
        transactionId: txnId,
        paymentMethod: 'SANDBOX_UPI',
      });

    assert.strictEqual(verifyRes.status, 200);
    assert.strictEqual(verifyRes.body.payment.status, 'SUCCESS');
    assert.strictEqual(verifyRes.body.payment.amount, 25000);
    assert.ok(verifyRes.body.receipt.receiptNumber.startsWith('REC-2027-'));
    assert.strictEqual(verifyRes.body.booking.paymentStatus, 'PARTIALLY_PAID');
  });

  // TEST 10: Contractual Cancellation & Single Refund Formula (USER JOURNEY 6)
  test('10. POST /api/bookings/:id/cancel-request accurately calculates contractual refund slab and releases seat', async () => {
    const cancelRes = await request(app)
      .post(`/api/bookings/${createdBookingId}/cancel-request`)
      .send({
        cancellationReason: 'Doctor advised deferral of high-altitude trek due to acute medical advice',
      });

    assert.strictEqual(cancelRes.status, 200);
    assert.ok(cancelRes.body.refund);
    assert.strictEqual(cancelRes.body.refund.status, 'PENDING');
    createdRefundId = cancelRes.body.refund.id;

    const calc = cancelRes.body.refundCalculation;
    assert.ok(calc.daysBeforeDeparture > 75); // 2027 departure is > 75 days away
    assert.strictEqual(calc.cancellationChargeRate, '25%'); // 75+ days slab

    // Admin / Finance approves refund
    const approveRes = await request(app)
      .put(`/api/admin/refunds/${createdRefundId}/status`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        status: 'APPROVED',
        notes: 'Verified cancellation notice date. 75% refund approved by Finance.',
      });

    assert.strictEqual(approveRes.status, 200);
    assert.strictEqual(approveRes.body.refund.status, 'APPROVED');
  });

  // TEST 11: Security & Unauthorised Access Protection (USER JOURNEY 7)
  test('11. Unauthorised requests without valid admin token must be rejected with 401 or 403', async () => {
    const res = await request(app).get('/api/admin/dashboard-stats');
    assert.strictEqual(res.status, 401);

    const badTokenRes = await request(app)
      .get('/api/admin/dashboard-stats')
      .set('Authorization', 'Bearer invalid_forged_token');
    assert.strictEqual(badTokenRes.status, 403);
  });

  // TEST 12: Input Validation Rejection on Malformed Data (USER JOURNEY 8)
  test('12. POST /api/bookings rejects invalid age, malformed email, or empty travellers', async () => {
    const badPayload = {
      departureId: 'non-existent',
      routeId: 'non-existent',
      passportType: 'INDIAN',
      contactName: '', // empty name
      contactEmail: 'not-an-email', // invalid email
      contactPhone: '123', // too short
      travellers: [], // empty travellers array
    };

    const res = await request(app).post('/api/bookings').send(badPayload);
    assert.strictEqual(res.status, 400);
    assert.ok(res.body.details);
  });

  // TEST 13: Legal Documents & Knowledge Base
  test('13. GET /api/legal and /api/gallery return authentic documents and images', async () => {
    const legalRes = await request(app).get('/api/legal');
    assert.strictEqual(legalRes.status, 200);
    assert.ok(legalRes.body.documents.length >= 4);

    const termsRes = await request(app).get('/api/legal/terms-and-conditions');
    assert.strictEqual(termsRes.status, 200);
    assert.ok(termsRes.body.document.contentMarkdown.includes('T1 Contracting entity'));

    const galleryRes = await request(app).get('/api/gallery');
    assert.strictEqual(galleryRes.status, 200);
    assert.ok(galleryRes.body.gallery.length >= 12);
  });
});
