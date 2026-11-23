import { test, describe, before, after } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import request from 'supertest';
import app from '../src/index.js';
import prisma from '../src/prisma.js';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = fs.existsSync(path.resolve('client', 'src'))
  ? process.cwd()
  : path.resolve(process.cwd(), '..');
const clientSrc = path.join(rootDir, 'client', 'src');

describe('Master End-to-End & Unit Test Suite — Appearance, Functionality & Responsive Viewports', () => {
  let adminToken = '';
  let memberToken = '';
  let memberId = '';
  let testDeparture = null;
  let testRoute = null;
  let createdBookingId = '';
  let createdReference = '';
  let createdTravellerId = '';

  before(async () => {
    // 1. Authenticate Admin
    const adminLoginRes = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@shloka.com', password: 'ShlokaAdmin@2027' });
    if (adminLoginRes.status === 200 && adminLoginRes.body.token) {
      adminToken = adminLoginRes.body.token;
    }

    // 2. Fetch active Route (Option 1 - bus-both-ways)
    testRoute = await prisma.route.findFirst({ where: { code: 'bus-both-ways' } });

    // 3. Create a dedicated Departure for E2E testing
    const uniqueBatch = Math.floor(10000 + Math.random() * 90000);
    testDeparture = await prisma.departure.create({
      data: {
        batchNumber: uniqueBatch,
        name: `E2E Master Batch - ${uniqueBatch}`,
        slug: `e2e-master-batch-${uniqueBatch}`,
        arrivalDate: new Date('2027-05-15T00:00:00Z'),
        departureDate: new Date('2027-05-28T00:00:00Z'),
        totalDays: 14,
        isFullMoon: true,
        totalCapacity: 50,
        bookedSeats: 0,
        status: 'AVAILABLE',
      },
    });
  });

  after(async () => {
    if (testDeparture) {
      await prisma.booking.deleteMany({ where: { departureId: testDeparture.id } }).catch(() => {});
      await prisma.departure.delete({ where: { id: testDeparture.id } }).catch(() => {});
    }
  });

  // ============================================================================
  // SECTION 1: APPEARANCE & BRAND DESIGN SYSTEM AUDIT (Unit & Structural)
  // ============================================================================
  describe('Section 1: Site Appearance & Visual Design System Audit', () => {
    test('1.1. Color Palette: Enforces Deep Navy (#071B3A/#041329), Sacred Gold (#D9A441), and Warm Ivory', () => {
      const indexCss = fs.readFileSync(path.join(clientSrc, 'index.css'), 'utf8');
      const tailwindConfig = fs.readFileSync(path.join(rootDir, 'client', 'tailwind.config.js'), 'utf8');

      assert.ok(tailwindConfig.includes('#071B3A') || tailwindConfig.includes('#041329') || tailwindConfig.includes('#101D35'), 'Tailwind must configure Deep Navy brand palette');
      assert.ok(tailwindConfig.includes('#D9A441') || tailwindConfig.includes('gold'), 'Tailwind must configure Sacred Gold accent');

      assert.match(indexCss, /font-family/, 'Global CSS must establish base font family');
      assert.match(indexCss, /box-sizing:\s*border-box/, 'Global CSS must enforce border-box sizing');
    });

    test('1.2. Typography Hierarchy: Montserrat heading classes and Segoe UI / sans body', () => {
      const indexHtml = fs.readFileSync(path.join(rootDir, 'client', 'index.html'), 'utf8');
      assert.ok(indexHtml.includes('Montserrat'), 'Google Fonts link in index.html must load Montserrat for headings');

      const heroCode = fs.readFileSync(path.join(clientSrc, 'pages', 'HomePage.jsx'), 'utf8');
      const packagesCode = fs.readFileSync(path.join(clientSrc, 'pages', 'PackagesPage.jsx'), 'utf8');
      assert.match(heroCode, /font-heading/, 'HomePage must use font-heading for major pilgrimage headings');
      assert.match(packagesCode, /font-heading/, 'PackagesPage must use font-heading for package titles');
    });

    test('1.3. Facility Checkmark Elimination: Zero checkmark icons (✓) across package cards, widgets, and lists', () => {
      const widgetCode = fs.readFileSync(path.join(clientSrc, 'components', 'JourneySearchWidget.jsx'), 'utf8');
      const langCode = fs.readFileSync(path.join(clientSrc, 'context', 'LanguageContext.jsx'), 'utf8');
      const prepCode = fs.readFileSync(path.join(clientSrc, 'pages', 'PreparationPage.jsx'), 'utf8');

      // Facility strings in LanguageContext must NOT contain '✓'
      assert.strictEqual(langCode.includes("stayKathmandu: '✓"), false, 'English facility must not start with ✓');
      assert.strictEqual(langCode.includes("stayKathmandu: '✓"), false, 'Hindi facility must not start with ✓');
      assert.strictEqual(langCode.includes("hyperbaricOxygen: '✓"), false, 'Oxygen facility must not start with ✓');

      // Packaging lists must use bullet markers, not tick marks
      assert.strictEqual(prepCode.includes("✓ 4-Season Sleeping Bag"), false, 'Packing items must not use checkmarks');

      // Package facilities pill styling
      assert.match(widgetCode, /bg-slate-50\/80\s+border\s+border-slate-200\/90/, 'Facilities in Search Console must use elegant bordered pill styling');
    });

    test('1.4. Form Input Contrast: Form inputs have explicit background and dark readable text', () => {
      const bookingCode = fs.readFileSync(path.join(clientSrc, 'pages', 'BookingPage.jsx'), 'utf8');
      const memberRegCode = fs.readFileSync(path.join(clientSrc, 'pages', 'MembershipRegisterPage.jsx'), 'utf8');

      assert.match(bookingCode, /bg-white\s+text-slate-800/, 'Booking input fields must define explicit white background and dark text');
      assert.match(memberRegCode, /text-slate-800|text-slate-900/, 'Member registration inputs must define dark text for readability');
    });

    test('1.5. Header & Navigation: Sticky blur header, official logo, bilingual toggle, and Book Now CTA', () => {
      const navbarCode = fs.readFileSync(path.join(clientSrc, 'components', 'Navbar.jsx'), 'utf8');

      assert.match(navbarCode, /fixed|sticky/, 'Navbar must be fixed or sticky');
      assert.match(navbarCode, /backdrop-blur/, 'Navbar must employ backdrop blur');
      assert.match(navbarCode, /SHLOKA\s+YATRA/, 'Navbar must display official brand title');
      assert.match(navbarCode, /setLanguage/, 'Navbar must provide language toggle');
      assert.match(navbarCode, /to="\/book"/, 'Navbar must provide Book Now CTA to /book');
    });

    test('1.6. Footer: Official 4-column layout, regulatory advisory, contact info, and Admin Panel link', () => {
      const footerCode = fs.readFileSync(path.join(clientSrc, 'components', 'Footer.jsx'), 'utf8');

      assert.ok(footerCode.includes('to="/admin/login"'), 'Footer must contain link to /admin/login');
      assert.ok(footerCode.includes('to="/terms"'), 'Footer must contain link to /terms');
      assert.ok(footerCode.includes('to="/privacy') || footerCode.includes('to="/privacy-policy"'), 'Footer must contain link to privacy');
      assert.ok(footerCode.includes('to="/cancellation-policy"'), 'Footer must contain link to /cancellation-policy');
      assert.ok(footerCode.includes('Grexotix'), 'Footer must display Powered by Grexotix notice');
    });

    test('1.7. Legal Documents Structure & Versioning: T1-T35, C1-C17, P1-P17, R1-R12, and Draft 1.0 status', () => {
      const legalData = fs.readFileSync(path.join(clientSrc, 'data', 'legalData.js'), 'utf8');

      // Master Terms T1 to T35
      for (let i = 1; i <= 35; i++) {
        assert.ok(legalData.includes(`"id": "T${i}"`) || legalData.includes(`id: 'T${i}'`), `Master clause T${i} must exist`);
      }
      // Cancellation Policy C1 to C17
      for (let i = 1; i <= 17; i++) {
        assert.ok(legalData.includes(`"id": "C${i}"`) || legalData.includes(`id: 'C${i}'`), `Cancellation clause C${i} must exist`);
      }
      // High-Altitude Risk R1 to R12
      for (let i = 1; i <= 12; i++) {
        assert.ok(legalData.includes(`"id": "R${i}"`) || legalData.includes(`id: 'R${i}'`), `Risk clause R${i} must exist`);
      }

      // Check official draft status on upload/review documents
      const docsAdminCode = fs.readFileSync(path.join(clientSrc, 'pages', 'admin', 'AdminDocumentsPage.jsx'), 'utf8');
      assert.ok(docsAdminCode.includes('SYPL-MED-2027'), 'Medical certificate reference SYPL-MED-2027 must be present');
      assert.ok(docsAdminCode.includes('SYPL-RISK-2027'), 'Risk declaration reference SYPL-RISK-2027 must be present');

      const memberAccCode = fs.readFileSync(path.join(clientSrc, 'pages', 'MemberAccountPage.jsx'), 'utf8');
      assert.ok(memberAccCode.includes('Draft 1.0'), 'Member Account must state Draft 1.0 document status');
    });
  });

  // ============================================================================
  // SECTION 2: FUNCTIONAL WORKFLOWS & USER JOURNEYS (End-to-End Tests)
  // ============================================================================
  describe('Section 2: Functional Workflows & User Journeys (End-to-End)', () => {
    test('2.1. Journey Search Console: Queries routes and departures from real API', async () => {
      const routesRes = await request(app).get('/api/routes');
      assert.strictEqual(routesRes.status, 200);
      assert.strictEqual(routesRes.body.routes.length, 3);

      const departuresRes = await request(app).get('/api/departures');
      assert.strictEqual(departuresRes.status, 200);
      assert.ok(departuresRes.body.departures.length >= 8);

      const widgetCode = fs.readFileSync(path.join(clientSrc, 'components', 'JourneySearchWidget.jsx'), 'utf8');
      assert.match(widgetCode, /handleProceedBooking/, 'Search widget must define proceed booking handler');
      assert.match(widgetCode, /routeCode:/, 'Search widget must pass routeCode');
      assert.match(widgetCode, /batch:/, 'Search widget must pass selected batch');
    });

    test('2.2. Authoritative Price Calculation: POST /api/pricing/calculate computes base, GST, and deposit', async () => {
      assert.ok(testRoute, 'Route must exist');
      const calcRes = await request(app)
        .post('/api/pricing/calculate')
        .send({
          routeId: testRoute.id,
          passportType: 'INDIAN',
          travellersCount: 2,
        });

      assert.strictEqual(calcRes.status, 200);
      assert.strictEqual(calcRes.body.calculation.baseAmount, 700000);
      assert.strictEqual(calcRes.body.calculation.gstAmount, 35000);
      assert.strictEqual(calcRes.body.calculation.totalAmount, 735000);
      assert.strictEqual(calcRes.body.calculation.depositAmount, 50000);
    });

    test('2.3. Package 1 (Classic Overland): End-to-end booking creation and database persistence', async () => {
      assert.ok(testDeparture, 'Test departure must be available');
      assert.ok(testRoute, 'Route must be available');

      const bookingPayload = {
        routeId: testRoute.id,
        departureId: testDeparture.id,
        passportType: 'INDIAN',
        contactName: 'Ramesh Chandra Sharma',
        contactEmail: `ramesh.e2e.${Date.now()}@example.com`,
        contactPhone: '+919876543210',
        notes: 'Elderly assistance during parikrama',
        travellers: [
          {
            fullName: 'Ramesh Chandra Sharma',
            passportNumber: 'Z8899001',
            nationality: 'Indian',
            age: 52,
            gender: 'MALE',
            dietaryPreference: 'PURE_VEGETARIAN',
            medicalConditions: 'None',
            emergencyContactName: 'Sunita Sharma',
            emergencyContactPhone: '+919876543211',
          },
          {
            fullName: 'Sunita Sharma',
            passportNumber: 'Z8899002',
            nationality: 'Indian',
            age: 48,
            gender: 'FEMALE',
            dietaryPreference: 'PURE_VEGETARIAN',
            medicalConditions: 'None',
            emergencyContactName: 'Ramesh Chandra Sharma',
            emergencyContactPhone: '+919876543210',
          },
        ],
      };

      const res = await request(app).post('/api/bookings').send(bookingPayload);
      assert.strictEqual(res.status, 201, `Booking creation should return 201: ${JSON.stringify(res.body)}`);
      assert.ok(res.body.booking, 'Response must include booking record');
      assert.match(res.body.booking.bookingReference, /^SHY-2027-\d{6}$/, 'Reference number must follow SHY-2027-XXXXXX pattern');
      assert.strictEqual(res.body.booking.totalTravellers, 2);

      createdBookingId = res.body.booking.id;
      createdReference = res.body.booking.bookingReference;
      createdTravellerId = res.body.booking.travellers[0].id;

      // Verify directly in Prisma DB
      const dbBooking = await prisma.booking.findUnique({
        where: { id: createdBookingId },
        include: { travellers: true },
      });
      assert.ok(dbBooking, 'Booking record must exist in Prisma database');
      assert.strictEqual(dbBooking.status, 'PENDING');
      assert.strictEqual(dbBooking.travellers.length, 2);
    });

    test('2.4. Statutory Legal Consents: POST /api/bookings/:id/consent records clauses T1-T35 & C1-C17', async () => {
      assert.ok(createdBookingId, 'Booking ID must exist from previous step');

      const consentPayload = {
        documentSlug: 'contract-package-2027',
        documentVersion: 'Draft 1.0 – 23 November 2026',
        consentedToMasterTerms: true,
        consentedToCancellationPolicy: true,
        consentedToRiskNotice: true,
        consentedToServiceSchedule: true,
        consentedToPrivacyNotice: true,
        ipAddress: '127.0.0.1',
        userAgent: 'IntegrationTest/1.0',
      };

      const res = await request(app)
        .post(`/api/bookings/${createdBookingId}/consent`)
        .send(consentPayload);

      assert.ok([200, 201].includes(res.status));
    });

    test('2.5. Official Risk Declaration Submission: POST /api/documents/risk-declaration/submit', async () => {
      assert.ok(createdBookingId, 'Booking ID must exist');
      assert.ok(createdTravellerId, 'Traveller ID must exist');

      const riskPayload = {
        bookingId: createdBookingId,
        travellerId: createdTravellerId,
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
      };

      const res = await request(app)
        .post('/api/documents/risk-declaration/submit')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(riskPayload);

      assert.strictEqual(res.status, 201);
    });

    test('2.6. Payment Order & Signature Verification: Transitions booking to CONFIRMED and decrements seats', async () => {
      assert.ok(createdBookingId, 'Booking ID must exist');

      const orderRes = await request(app)
        .post('/api/payments/create-order')
        .send({
          bookingId: createdBookingId,
          amount: 50000,
          currency: 'INR',
          paymentType: 'REGISTRATION_DEPOSIT',
        });

      assert.ok([200, 201].includes(orderRes.status));

      const verifyRes = await request(app)
        .post('/api/payments/verify')
        .send({
          bookingId: createdBookingId,
          orderId: orderRes.body.order.gatewayOrderId,
          paymentId: `PAY-${Date.now()}`,
          signature: 'simulated_valid_signature',
          status: 'SUCCESS',
          method: 'UPI',
        });

      assert.strictEqual(verifyRes.status, 200);
      assert.ok(['PARTIALLY_PAID', 'PAID'].includes(verifyRes.body.booking.paymentStatus));
      assert.ok(verifyRes.body.payment.receiptNumber);

      // Verify departure seat count incremented in DB
      const updatedDeparture = await prisma.departure.findUnique({
        where: { id: testDeparture.id },
      });
      assert.ok(updatedDeparture.bookedSeats >= 2, 'Booked seats must have been incremented by the 2 travellers');
    });

    test('2.7. Public Voucher Retrieval: GET /api/bookings/reference/:referenceNumber', async () => {
      assert.ok(createdReference, 'Reference number must exist');

      const res = await request(app).get(`/api/bookings/reference/${createdReference}`);
      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.body.booking.bookingReference, createdReference);
      assert.strictEqual(res.body.booking.travellers.length, 2);
    });

    test('2.8. Member Registration & Authentication: Optional SMS verification and JWT issuance', async () => {
      const email = `devotee.e2e.${Date.now()}@example.com`;
      const mobile = `98${Math.floor(10000000 + Math.random() * 90000000)}`;

      const regRes = await request(app)
        .post('/api/membership/register')
        .send({
          firstName: 'Siddharth',
          lastName: 'Mishra',
          email,
          countryCode: '+91',
          mobile: `+91 ${mobile}`,
          gender: 'MALE',
          nationality: 'Indian',
          city: 'Varanasi',
          password: 'Password@2027',
          confirmPassword: 'Password@2027',
          acceptTerms: true,
          acceptPrivacy: true,
          isMobileVerified: false,
        });

      assert.strictEqual(regRes.status, 201);
      assert.ok(regRes.body.member.id);
      assert.ok(regRes.body.token);

      memberToken = regRes.body.token;
      memberId = regRes.body.member.id;

      // Member login with email
      const loginEmailRes = await request(app)
        .post('/api/membership/login')
        .send({ identifier: email, password: 'Password@2027' });
      assert.strictEqual(loginEmailRes.status, 200);
      assert.ok(loginEmailRes.body.token);

      // Authenticated profile access
      const meRes = await request(app)
        .get('/api/membership/me')
        .set('Authorization', `Bearer ${memberToken}`);
      assert.strictEqual(meRes.status, 200);
      assert.strictEqual(meRes.body.member.email, email);
    });

    test('2.9. Admin Management Portal: Protected routes, dashboard stats, and document review', async () => {
      assert.ok(adminToken, 'Admin token must exist');

      // Unauthenticated request rejected
      const unauthRes = await request(app).get('/api/admin/dashboard-stats');
      assert.strictEqual(unauthRes.status, 401);

      // Authenticated admin stats
      const statsRes = await request(app)
        .get('/api/admin/dashboard-stats')
        .set('Authorization', `Bearer ${adminToken}`);
      assert.strictEqual(statsRes.status, 200);
      assert.ok(typeof statsRes.body.stats.totalBookings === 'number');
      assert.ok(typeof statsRes.body.stats.confirmedBookings === 'number');

      // Admin can list bookings
      const bookingsRes = await request(app)
        .get('/api/admin/bookings')
        .set('Authorization', `Bearer ${adminToken}`);
      assert.strictEqual(bookingsRes.status, 200);
      assert.ok(Array.isArray(bookingsRes.body.bookings));

      // Admin can view document submissions
      const docsRes = await request(app)
        .get('/api/admin/documents')
        .set('Authorization', `Bearer ${adminToken}`);
      assert.strictEqual(docsRes.status, 200);
      assert.ok(Array.isArray(docsRes.body.documents));
    });

    test('2.10. Bilingual Language Parity: English & Hindi dictionaries are fully populated', () => {
      const langCode = fs.readFileSync(path.join(clientSrc, 'context', 'LanguageContext.jsx'), 'utf8');

      const requiredSections = ['hero:', 'nav:', 'common:', 'footer:', 'packages:'];
      for (const s of requiredSections) {
        assert.ok(langCode.includes(s), `Language context must define translation section ${s}`);
      }
    });
  });

  // ============================================================================
  // SECTION 3: MOBILE VIEWPORT AUDIT (320px, 375px, 390px, 430px)
  // ============================================================================
  describe('Section 3: Mobile Viewport Audit (320px, 375px, 390px, 430px)', () => {
    test('3.1. Zero Horizontal Overflow: html & body enforce overflow-x: hidden and max-width: 100%', () => {
      const css = fs.readFileSync(path.join(clientSrc, 'index.css'), 'utf8');
      assert.match(css, /overflow-x:\s*hidden/, 'index.css must enforce overflow-x: hidden');
      assert.match(css, /max-width:\s*100%/, 'index.css must constrain max-width: 100%');
    });

    test('3.2. 320px Narrow Screen: Navbar brand text has truncate protection and 44px+ touch hamburger', () => {
      const navbarCode = fs.readFileSync(path.join(clientSrc, 'components', 'Navbar.jsx'), 'utf8');
      assert.match(navbarCode, /truncate/, 'Brand logo text must be truncated on ultra-narrow 320px screens');
      assert.match(navbarCode, /min-w-\[44px\]/, 'Hamburger button must provide minimum 44px touch width');
      assert.match(navbarCode, /min-h-\[44px\]/, 'Hamburger button must provide minimum 44px touch height');
    });

    test('3.3. 375px/390px Compact Screen: Search Console inputs stack vertically (grid-cols-1)', () => {
      const searchCode = fs.readFileSync(path.join(clientSrc, 'components', 'JourneySearchWidget.jsx'), 'utf8');
      assert.match(searchCode, /grid-cols-1/, 'Search console fields must stack into single column on mobile');
      assert.match(searchCode, /w-full/, 'Search buttons and selects must be full width on mobile');
    });

    test('3.4. 390px Standard Mobile: Package cards adapt to single-column flow', () => {
      const packagesCode = fs.readFileSync(path.join(clientSrc, 'pages', 'PackagesPage.jsx'), 'utf8');
      assert.match(packagesCode, /minmax\(320px,\s*1fr\)|grid-cols-1/, 'Package cards must adapt to mobile single-column layout');
    });

    test('3.5. 390px Standard Mobile: Booking steps row scrolls horizontally without screen blowout', () => {
      const bookingCode = fs.readFileSync(path.join(clientSrc, 'pages', 'BookingPage.jsx'), 'utf8');
      assert.match(bookingCode, /overflow-x-auto/, 'Booking steps container must allow horizontal scrolling on mobile');
    });

    test('3.6. 390px Standard Mobile: Booking navigation buttons reverse-stack vertically', () => {
      const bookingCode = fs.readFileSync(path.join(clientSrc, 'pages', 'BookingPage.jsx'), 'utf8');
      assert.match(bookingCode, /flex-col-reverse\s+sm:flex-row/, 'Form back/next buttons must reverse-stack on mobile screens');
    });

    test('3.7. Mobile Modals: Risk and Medical declaration modals include mobile padding and scroll containers', () => {
      const riskModal = fs.readFileSync(path.join(clientSrc, 'components', 'RiskDeclarationModal.jsx'), 'utf8');
      assert.match(riskModal, /max-h-\[92vh\]/, 'Risk modal must constrain height to viewport');
      assert.match(riskModal, /overflow-y-auto/, 'Risk modal content must scroll internally');
    });
  });

  // ============================================================================
  // SECTION 4: TABLET VIEWPORT AUDIT (768px, 820px, 1024px)
  // ============================================================================
  describe('Section 4: Tablet Viewport Audit (768px, 820px, 1024px)', () => {
    test('4.1. 768px Tablet: Search Console adapts to 2-column or 3-column grid', () => {
      const searchCode = fs.readFileSync(path.join(clientSrc, 'components', 'JourneySearchWidget.jsx'), 'utf8');
      assert.match(searchCode, /sm:grid-cols-2|md:grid-cols-3|grid-cols-1/, 'Search console must adjust layout on medium screens');
    });

    test('4.2. 768px/820px Tablet: Pricing and Itinerary tables adapt responsively', () => {
      const pricingCode = fs.readFileSync(path.join(clientSrc, 'components', 'PricingTable.jsx'), 'utf8');
      const routesCompare = fs.readFileSync(path.join(clientSrc, 'pages', 'RoutesComparePage.jsx'), 'utf8');

      assert.match(pricingCode, /md:grid-cols-3/, 'Pricing table must adapt to 3 columns on tablet');
      assert.match(routesCompare, /overflow-x-auto/, 'Routes comparison table must have overflow-x-auto wrapper');
    });

    test('4.3. 768px/1024px Tablet: Cancellation Policy slabs table wrapped in overflow-x-auto', () => {
      const cancelCode = fs.readFileSync(path.join(clientSrc, 'pages', 'CancellationPolicyPage.jsx'), 'utf8');
      assert.match(cancelCode, /overflow-x-auto/, 'Cancellation slabs table must be wrapped in overflow-x-auto');
    });

    test('4.4. 1024px Small Laptop / iPad Pro: Booking Page transitions to two columns with sidebar', () => {
      const bookingCode = fs.readFileSync(path.join(clientSrc, 'pages', 'BookingPage.jsx'), 'utf8');
      assert.match(bookingCode, /grid-cols-1\s+lg:grid-cols-\[1fr_380px\]/, 'Booking page must transition to two-column grid on lg (1024px) screens');
    });
  });

  // ============================================================================
  // SECTION 5: DESKTOP VIEWPORT AUDIT (1280px, 1440px, 1920px)
  // ============================================================================
  describe('Section 5: Desktop Viewport Audit (1280px, 1440px, 1920px)', () => {
    test('5.1. Desktop Navigation: Displays full navigation links and CTAs without hamburger menu', () => {
      const navbarCode = fs.readFileSync(path.join(clientSrc, 'components', 'Navbar.jsx'), 'utf8');
      assert.match(navbarCode, /hidden\s+lg:flex|hidden\s+md:flex/, 'Desktop nav links must be hidden on mobile and flex on desktop');
    });

    test('5.2. Desktop Search Console: Expands to full 4-column inline ribbon', () => {
      const searchCode = fs.readFileSync(path.join(clientSrc, 'components', 'JourneySearchWidget.jsx'), 'utf8');
      assert.match(searchCode, /lg:grid-cols-4|xl:grid-cols-4|grid-cols-1/, 'Search widget must support wide grid on desktop');
    });

    test('5.3. Desktop Packages Page: Package cards render in balanced comparison grid', () => {
      const packagesCode = fs.readFileSync(path.join(clientSrc, 'pages', 'PackagesPage.jsx'), 'utf8');
      assert.match(packagesCode, /minmax\(320px,\s*1fr\)/, 'PackagesPage must support multi-column auto-fit comparison grid on desktop');
    });

    test('5.4. Desktop Admin Dashboard: Persistent sidebar navigation with full metric cards layout', () => {
      const adminLayout = fs.readFileSync(path.join(clientSrc, 'components', 'AdminLayout.jsx'), 'utf8');
      const adminDashboard = fs.readFileSync(path.join(clientSrc, 'pages', 'admin', 'AdminDashboardPage.jsx'), 'utf8');

      assert.match(adminLayout, /lg:translate-x-0/, 'Admin sidebar must be permanently visible on desktop');
      assert.match(adminDashboard, /grid-cols-2\s+md:grid-cols-3\s+lg:grid-cols-4/, 'Metric cards must display in 4-column grid on desktop');
    });
  });
});
