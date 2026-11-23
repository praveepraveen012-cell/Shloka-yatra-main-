import { test, describe, before } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import app from '../src/index.js';
import prisma from '../src/prisma.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..', '..');

describe('Critical Booking System Repair, Website Audit & PDF Content Verification Master Suite', () => {
  let adminToken;
  let testDeparture;
  let testRoutes = [];

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

    // 2. Fetch routes and create a dedicated clean test departure
    const routesRes = await request(app).get('/api/routes');
    assert.equal(routesRes.status, 200);
    testRoutes = routesRes.body.routes;
    assert.ok(testRoutes.length >= 3, 'Must have at least 3 official routes');

    const ts = Date.now();
    const randomBatch = Math.floor(1000 + Math.random() * 9000);
    testDeparture = await prisma.departure.create({
      data: {
        batchNumber: randomBatch,
        name: `May 2027 Full Moon Master Test Batch ${randomBatch}`,
        slug: `dep-test-${ts}`,
        arrivalDate: new Date('2027-05-15T00:00:00.000Z'),
        departureDate: new Date('2027-05-28T00:00:00.000Z'),
        totalDays: 14,
        isFullMoon: true,
        totalCapacity: 50,
        bookedSeats: 0,
        status: 'AVAILABLE',
      },
    });
  });

  // -------------------------------------------------------------
  // SECTION 1: Package Facilities Clean Labels (Checkmark Removal)
  // -------------------------------------------------------------
  test('Section 1: Package facilities display clean text labels with no tick/checkmark icons', () => {
    const langContextPath = path.join(rootDir, 'client', 'src', 'context', 'LanguageContext.jsx');
    const content = fs.readFileSync(langContextPath, 'utf8');

    // English facility strings must NOT have ✓
    assert.ok(content.includes("stayKathmandu: '5-Star Kathmandu Stay'"), 'English stayKathmandu must not have checkmark');
    assert.ok(content.includes("tibetVisa: 'Tibet Group Visa & Permits'"), 'English tibetVisa must not have checkmark');
    assert.ok(content.includes("sattvicMeals: 'Pure Sattvic Meals'"), 'English sattvicMeals must not have checkmark');
    assert.ok(content.includes("hyperbaricOxygen: 'Hyperbaric Oxygen Chamber'"), 'English hyperbaricOxygen must not have checkmark');

    // Hindi facility strings must NOT have ✓
    assert.ok(content.includes("stayKathmandu: 'काठमांडू में ५-सितारा प्रवास'"), 'Hindi stayKathmandu must not have checkmark');
    assert.ok(content.includes("tibetVisa: 'तिब्बत समूह वीज़ा एवं परमिट'"), 'Hindi tibetVisa must not have checkmark');
    assert.ok(content.includes("sattvicMeals: 'शुद्ध सात्विक भोजन'"), 'Hindi sattvicMeals must not have checkmark');
    assert.ok(content.includes("hyperbaricOxygen: 'हाइपरबेरिक ऑक्सीजन कक्ष'"), 'Hindi hyperbaricOxygen must not have checkmark');

    // Preparation page must NOT have raw checkmarks in packing list
    const prepPagePath = path.join(rootDir, 'client', 'src', 'pages', 'PreparationPage.jsx');
    const prepContent = fs.readFileSync(prepPagePath, 'utf8');
    assert.ok(!prepContent.includes('<li>✓'), 'Preparation page packing list must use clean bullets, not checkmarks');
  });

  // -------------------------------------------------------------
  // SECTION 2: Runtime Error & React Hooks Audit
  // -------------------------------------------------------------
  test('Section 2: BookingPage extracts getValues and defines all reactive watchers without ReferenceError', () => {
    const bookingPagePath = path.join(rootDir, 'client', 'src', 'pages', 'BookingPage.jsx');
    const content = fs.readFileSync(bookingPagePath, 'utf8');

    // getValues must be extracted from useForm
    assert.ok(content.includes('getValues,'), 'useForm must extract getValues');
    assert.ok(content.includes("const watchedContactName = watch('contactName');"), 'contactName must be watched');
    assert.ok(content.includes("const watchedContactCity = watch('contactCity');"), 'contactCity must be watched');

    // RiskDeclarationModal participantData must safely fallback
    assert.ok(content.includes('watchedTravellers?.[0]?.fullName || watchedContactName || getValues'), 'participantData must have safe fallbacks');

    // No bare undeclared getValues
    assert.ok(!content.includes("|| getValues('contactName')\n") && !content.includes("|| getValues('contactCity')\n"), 'getValues calls must be safely in scope');
  });

  // -------------------------------------------------------------
  // SECTION 3: Booking Links & Routing Audit
  // -------------------------------------------------------------
  test('Section 3: Audit all booking buttons and aliases across client pages', () => {
    const appPath = path.join(rootDir, 'client', 'src', 'App.jsx');
    const appContent = fs.readFileSync(appPath, 'utf8');

    // Query preserving redirects for backward compatibility
    assert.ok(appContent.includes('<RedirectWithQuery to="/book"'), 'App.jsx must redirect /book-now preserving query');
    assert.ok(appContent.includes('path="/booking" element={<RedirectWithQuery to="/book"'), 'App.jsx must redirect /booking preserving query');

    // Check JourneySearchWidget handleProceedBooking passes full params
    const widgetPath = path.join(rootDir, 'client', 'src', 'components', 'JourneySearchWidget.jsx');
    const widgetContent = fs.readFileSync(widgetPath, 'utf8');
    assert.ok(widgetContent.includes('routeCode: selectedRouteObj?.code'), 'Widget must pass routeCode to booking page');
    assert.ok(widgetContent.includes('count: totalDevotees.toString()'), 'Widget must pass count to booking page');

    // PackagesPage must link directly to /book with parameters
    const pkgPagePath = path.join(rootDir, 'client', 'src', 'pages', 'PackagesPage.jsx');
    const pkgContent = fs.readFileSync(pkgPagePath, 'utf8');
    assert.ok(pkgContent.includes('/book?package=option-'), 'PackagesPage must link to /book?package=');

    // MemberAccountPage must link to /book (not broken /booking)
    const memberAccPath = path.join(rootDir, 'client', 'src', 'pages', 'MemberAccountPage.jsx');
    const memberAccContent = fs.readFileSync(memberAccPath, 'utf8');
    assert.ok(!memberAccContent.includes('to="/booking"'), 'MemberAccountPage must not link to dead /booking');
    assert.ok(memberAccContent.includes('to="/book"'), 'MemberAccountPage must link to /book');
  });

  // -------------------------------------------------------------
  // SECTION 4: End-to-End Booking Creation & Persistence
  // -------------------------------------------------------------
  let createdBooking1;
  let createdBooking2;
  let createdBooking3;

  test('Section 4A: Package 1 (Classic Overland via Kerung) - Complete booking submission & DB persistence', async () => {
    const route1 = testRoutes.find((r) => r.routeNumber === 1) || testRoutes[0];

    // 1. Calculate price
    const calcRes = await request(app)
      .post('/api/pricing/calculate')
      .send({
        routeId: route1.id,
        passportType: 'INDIAN',
        travellersCount: 1,
      });
    assert.equal(calcRes.status, 200);
    assert.equal(calcRes.body.calculation.baseAmount, 350000);
    assert.equal(calcRes.body.calculation.gstAmount, 17500);
    assert.equal(calcRes.body.calculation.totalAmount, 367500);

    // 2. Submit booking to backend API
    const bookingRes = await request(app)
      .post('/api/bookings')
      .send({
        routeId: route1.id,
        departureId: testDeparture.id,
        passportType: 'INDIAN',
        contactName: 'Ramesh Chandra Sharma',
        contactEmail: 'ramesh.sharma@example.com',
        contactPhone: '+919876543210',
        notes: 'Address: Flat 402, Lotus Court, Sector 62, Noida, Uttar Pradesh - 201309.',
        policyAccepted: true,
        travellers: [
          {
            fullName: 'Ramesh Chandra Sharma',
            passportNumber: 'Z5849102',
            nationality: 'Indian',
            age: 52,
            gender: 'MALE',
            dietaryPreference: 'PURE_VEGETARIAN',
            medicalConditions: 'None',
            emergencyContactName: 'Sunita Sharma',
            emergencyContactPhone: '+919876543211',
          },
        ],
      });

    assert.equal(bookingRes.status, 201, 'Booking creation must return 201');
    createdBooking1 = bookingRes.body.booking;
    assert.ok(createdBooking1.id, 'Must have unique database id');
    assert.match(createdBooking1.bookingReference, /^SHY-2027-\d{6}$/, 'Booking reference must follow SHY-2027-XXXXXX');
    assert.equal(createdBooking1.baseAmount, 350000);
    assert.equal(createdBooking1.gstAmount, 17500);
    assert.equal(createdBooking1.totalAmount, 367500);

    // 3. Confirm persistence in Prisma DB directly
    const dbBooking = await prisma.booking.findUnique({
      where: { id: createdBooking1.id },
      include: { travellers: true },
    });
    assert.ok(dbBooking, 'Booking record must persist in database');
    assert.equal(dbBooking.travellers.length, 1);
    assert.equal(dbBooking.travellers[0].fullName, 'Ramesh Chandra Sharma');

    // 4. Affirmative Consent Record (Annex B)
    const consentRes = await request(app)
      .post(`/api/bookings/${createdBooking1.id}/consent`)
      .send({
        documentSlug: 'contract-package-2027',
        documentVersion: 'Draft 1.0 – 23 November 2026',
        consentedToMasterTerms: true,
        consentedToCancellationPolicy: true,
        consentedToRiskNotice: true,
        consentedToServiceSchedule: true,
        consentedToPrivacyNotice: true,
        ipAddress: '127.0.0.1',
        userAgent: 'IntegrationTest/1.0',
      });
    assert.ok([200, 201].includes(consentRes.status));

    // 5. Submit Risk Declaration (SYPL-RISK-2027)
    const riskRes = await request(app)
      .post('/api/documents/risk-declaration/submit')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        bookingId: createdBooking1.id,
        travellerId: createdBooking1.travellers[0].id,
        signerName: 'Ramesh Chandra Sharma',
        signerRelationship: 'SELF',
        signaturePlace: 'Noida, India',
        signatureDate: '2026-11-23',
        pageInitials: ['RCS', 'RCS', 'RCS', 'RCS', 'RCS'],
        acknowledgements: {
          ack1_extreme_altitude: true,
          ack2_medical_conditions: true,
          ack3_insurance_mandatory: true,
          ack4_leader_authority: true,
          ack5_evacuation_costs: true,
          ack6_uncertainties: true,
          ack7_limited_indemnity: true,
          ack8_read_all_pages: true,
        },
        emergencyContact: {
          name: 'Sunita Sharma',
          relationship: 'Spouse',
          phone: '+919876543211',
        },
      });
    assert.equal(riskRes.status, 201);

    // 6. Payment Order Creation & Verification
    const orderRes = await request(app)
      .post('/api/payments/create-order')
      .send({
        bookingId: createdBooking1.id,
        amount: 25000,
        currency: 'INR',
        paymentType: 'REGISTRATION_DEPOSIT',
      });
    assert.ok([200, 201].includes(orderRes.status));

    const verifyRes = await request(app)
      .post('/api/payments/verify')
      .send({
        bookingId: createdBooking1.id,
        orderId: orderRes.body.order.gatewayOrderId,
        paymentId: `PAY-${Date.now()}`,
        signature: 'simulated_secure_signature',
        status: 'SUCCESS',
        method: 'UPI',
      });
    assert.equal(verifyRes.status, 200);

    // 7. Verify retrieval by Reference endpoint
    const refRes = await request(app).get(`/api/bookings/reference/${createdBooking1.bookingReference}`);
    assert.equal(refRes.status, 200);
    assert.equal(refRes.body.booking.bookingReference, createdBooking1.bookingReference);
    assert.equal(refRes.body.booking.paymentStatus, 'PARTIALLY_PAID');
  });

  test('Section 4B: Package 2 (Fly to Lhasa, Continue by Road) - Multi-traveller booking submission', async () => {
    const route2 = testRoutes.find((r) => r.routeNumber === 2) || testRoutes[1];

    const bookingRes = await request(app)
      .post('/api/bookings')
      .send({
        routeId: route2.id,
        departureId: testDeparture.id,
        passportType: 'INDIAN',
        contactName: 'Ananya Mukherjee',
        contactEmail: 'ananya.mukherjee@example.com',
        contactPhone: '+919876512345',
        notes: 'Twin sharing room requested for senior devotees.',
        policyAccepted: true,
        travellers: [
          {
            fullName: 'Ananya Mukherjee',
            passportNumber: 'N4820194',
            nationality: 'Indian',
            age: 48,
            gender: 'FEMALE',
            dietaryPreference: 'PURE_VEGETARIAN',
            emergencyContactName: 'Subir Mukherjee',
            emergencyContactPhone: '+919876512340',
          },
          {
            fullName: 'Subir Mukherjee',
            passportNumber: 'N4820195',
            nationality: 'Indian',
            age: 55,
            gender: 'MALE',
            dietaryPreference: 'PURE_VEGETARIAN',
            emergencyContactName: 'Ananya Mukherjee',
            emergencyContactPhone: '+919876512345',
          },
        ],
      });

    assert.equal(bookingRes.status, 201);
    createdBooking2 = bookingRes.body.booking;
    assert.equal(createdBooking2.totalTravellers, 2);
    assert.equal(createdBooking2.baseAmount, 437000 * 2);
    assert.equal(createdBooking2.gstAmount, Math.round(437000 * 2 * 0.05));
    assert.equal(createdBooking2.totalAmount, 437000 * 2 * 1.05);

    // Confirm in DB
    const dbBooking = await prisma.booking.findUnique({
      where: { id: createdBooking2.id },
      include: { travellers: true },
    });
    assert.equal(dbBooking.travellers.length, 2);
  });

  test('Section 4C: Package 3 (Fly to Lhasa & Ali/Pulan) - Foreign/NRI passport booking submission', async () => {
    const route3 = testRoutes.find((r) => r.routeNumber === 3) || testRoutes[2];

    const bookingRes = await request(app)
      .post('/api/bookings')
      .send({
        routeId: route3.id,
        departureId: testDeparture.id,
        passportType: 'FOREIGN',
        contactName: 'Vikramaditya Rao',
        contactEmail: 'vikram.rao.nri@example.com',
        contactPhone: '+14155552671',
        notes: 'US Passport holder travelling from San Francisco.',
        policyAccepted: true,
        travellers: [
          {
            fullName: 'Vikramaditya Rao',
            passportNumber: 'USA88472910',
            nationality: 'United States',
            age: 42,
            gender: 'MALE',
            dietaryPreference: 'PURE_VEGETARIAN',
            emergencyContactName: 'Pooja Rao',
            emergencyContactPhone: '+14155552672',
          },
        ],
      });

    assert.equal(bookingRes.status, 201);
    createdBooking3 = bookingRes.body.booking;
    assert.equal(createdBooking3.passportType, 'FOREIGN');
    assert.ok(createdBooking3.baseAmount > 0);
  });

  // -------------------------------------------------------------
  // SECTION 5: Required Field Validation & Error Prevention
  // -------------------------------------------------------------
  test('Section 5: Backend rejects missing travellers, invalid email, or invalid departures', async () => {
    // Missing travellers array
    const invalidRes1 = await request(app)
      .post('/api/bookings')
      .send({
        routeId: testRoutes[0].id,
        departureId: testDeparture.id,
        contactName: 'Incomplete Devotee',
        contactEmail: 'incomplete@example.com',
        contactPhone: '+919999999999',
        travellers: [],
      });
    assert.equal(invalidRes1.status, 400);

    // Invalid email format
    const invalidRes2 = await request(app)
      .post('/api/bookings')
      .send({
        routeId: testRoutes[0].id,
        departureId: testDeparture.id,
        contactName: 'Bad Email',
        contactEmail: 'not-an-email',
        contactPhone: '+919999999999',
        travellers: [
          {
            fullName: 'Valid Name',
            passportNumber: 'P1234567',
            nationality: 'Indian',
            age: 30,
            gender: 'MALE',
            emergencyContactName: 'Contact',
            emergencyContactPhone: '+919999999999',
          },
        ],
      });
    assert.equal(invalidRes2.status, 400);

    // Non-existent departure batch
    const invalidRes3 = await request(app)
      .post('/api/bookings')
      .send({
        routeId: testRoutes[0].id,
        departureId: 'non-existent-batch-id-9999',
        contactName: 'Missing Batch',
        contactEmail: 'batch@example.com',
        contactPhone: '+919999999999',
        travellers: [
          {
            fullName: 'Valid Name',
            passportNumber: 'P1234567',
            nationality: 'Indian',
            age: 30,
            gender: 'MALE',
            emergencyContactName: 'Contact',
            emergencyContactPhone: '+919999999999',
          },
        ],
      });
    assert.equal(invalidRes3.status, 400);
  });

  // -------------------------------------------------------------
  // SECTION 6: Admin Panel Visibility
  // -------------------------------------------------------------
  test('Section 6: Admin Panel retrieves all bookings and inspects booking detail with compliance register', async () => {
    // 1. List bookings
    const listRes = await request(app)
      .get('/api/admin/bookings')
      .set('Authorization', `Bearer ${adminToken}`);
    assert.equal(listRes.status, 200);
    const bookings = listRes.body.bookings;

    const found1 = bookings.find((b) => b.id === createdBooking1.id);
    const found2 = bookings.find((b) => b.id === createdBooking2.id);
    const found3 = bookings.find((b) => b.id === createdBooking3.id);

    assert.ok(found1, 'Booking 1 must appear in Admin Panel');
    assert.ok(found2, 'Booking 2 must appear in Admin Panel');
    assert.ok(found3, 'Booking 3 must appear in Admin Panel');

    // 2. Fetch single booking detail
    const detailRes = await request(app)
      .get(`/api/admin/bookings/${createdBooking1.id}`)
      .set('Authorization', `Bearer ${adminToken}`);
    assert.equal(detailRes.status, 200);
    assert.equal(detailRes.body.booking.bookingReference, createdBooking1.bookingReference);
    assert.ok(detailRes.body.booking.documentSubmissions, 'Detail must include document submissions');
    assert.equal(detailRes.body.booking.documentSubmissions.length, 1, 'Should have the SYPL-RISK-2027 submission');
  });

  // -------------------------------------------------------------
  // SECTION 7: Official PDF Documents & Content Verification
  // -------------------------------------------------------------
  test('Section 7: Verify official PDF files and statutory contractual content in client and server', () => {
    // Official PDF templates must be in place
    const clientMedPath = path.join(rootDir, 'client', 'public', 'documents', 'Shlloka_Yatra_2027_Medical_Fitness_Certificate.pdf');
    const clientRiskPath = path.join(rootDir, 'client', 'public', 'documents', 'Shlloka_Yatra_2027_Risk_Declaration_and_Indemnity.pdf');
    const serverMedPath = path.join(rootDir, 'server', 'public', 'templates', 'Shlloka_Yatra_2027_Medical_Fitness_Certificate.pdf');
    const serverRiskPath = path.join(rootDir, 'server', 'public', 'templates', 'Shlloka_Yatra_2027_Risk_Declaration_and_Indemnity.pdf');

    assert.ok(fs.existsSync(clientMedPath), 'Client medical PDF must exist');
    assert.ok(fs.existsSync(clientRiskPath), 'Client risk declaration PDF must exist');
    assert.ok(fs.existsSync(serverMedPath), 'Server medical template PDF must exist');
    assert.ok(fs.existsSync(serverRiskPath), 'Server risk template PDF must exist');

    // Legal Data file must have all authoritative clauses
    const legalDataPath = path.join(rootDir, 'client', 'src', 'data', 'legalData.js');
    const legalContent = fs.readFileSync(legalDataPath, 'utf8');

    // Check Master Terms T1-T35
    assert.ok(legalContent.includes('"id": "T1"'), 'T1 clause must exist');
    assert.ok(legalContent.includes('"id": "T35"'), 'T35 clause must exist');

    // Check Cancellation Policy C1-C17
    assert.ok(legalContent.includes('"id": "C1"'), 'C1 clause must exist');
    assert.ok(legalContent.includes('"id": "C17"'), 'C17 clause must exist');

    // Check Privacy Policy P1-P17
    assert.ok(legalContent.includes('"id": "P1"'), 'P1 clause must exist');
    assert.ok(legalContent.includes('"id": "P17"'), 'P17 clause must exist');

    // Check Risk Acknowledgement R1-R12
    assert.ok(legalContent.includes('"id": "R1"'), 'R1 clause must exist');
    assert.ok(legalContent.includes('"id": "R12"'), 'R12 clause must exist');

    // Official Documents file must have SYPL-RISK-2027 and SYPL-MED-2027
    const officialDocsPath = path.join(rootDir, 'client', 'src', 'data', 'officialDocuments.js');
    const officialContent = fs.readFileSync(officialDocsPath, 'utf8');
    assert.ok(officialContent.includes("documentRef: 'SYPL-RISK-2027'"), 'SYPL-RISK-2027 must be defined');
    assert.ok(officialContent.includes("documentRef: 'SYPL-MED-2027'"), 'SYPL-MED-2027 must be defined');
    assert.ok(officialContent.includes("totalPages: 5"), 'Risk document must have 5 pages');
    assert.ok(officialContent.includes("totalPages: 3"), 'Medical document must have 3 pages');
  });
});
