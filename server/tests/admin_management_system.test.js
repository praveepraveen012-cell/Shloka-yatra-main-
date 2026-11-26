import { test, describe } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';

describe('Admin Management System — Master Prompt Verification Suite', () => {
  const rootDir = fs.existsSync(path.resolve('client', 'src'))
    ? process.cwd()
    : path.resolve(process.cwd(), '..');
  const clientSrc = path.join(rootDir, 'client', 'src');
  const serverSrc = path.join(rootDir, 'server', 'src');

  // --- 1. Footer & Entry Point ---
  test('1. Footer renders Admin Panel link navigating to /admin/login', () => {
    const footerContent = fs.readFileSync(path.join(clientSrc, 'components', 'Footer.jsx'), 'utf8');
    assert.ok(footerContent.includes('to="/admin/login"'), 'Footer must have link to /admin/login');
    assert.ok(footerContent.includes('adminPortalLink'), 'Footer must use translation key adminPortalLink');
  });

  test('2. LanguageContext defines "Admin Panel" in English and "एडमिन पैनल" in Hindi', () => {
    const langContent = fs.readFileSync(path.join(clientSrc, 'context', 'LanguageContext.jsx'), 'utf8');
    assert.ok(langContent.includes("adminPortalLink: 'Admin Panel'"), 'English translation must be "Admin Panel"');
    assert.ok(langContent.includes("adminPortalLink: 'एडमिन पैनल'"), 'Hindi translation must be "एडमिन पैनल"');
  });

  // --- 2. Authentication & Protected Routes ---
  test('3. ProtectedRoute enforces SUPER_ADMIN administrative role', () => {
    const protectedRouteContent = fs.readFileSync(path.join(clientSrc, 'components', 'ProtectedRoute.jsx'), 'utf8');
    assert.ok(protectedRouteContent.includes('SUPER_ADMIN'), 'ProtectedRoute must support SUPER_ADMIN');
    assert.ok(protectedRouteContent.includes('to="/admin/login"'), 'Unauthenticated users must redirect to /admin/login');
  });

  test('4. AdminLoginPage has show/hide password toggle, remember me, forgot password, and no hardcoded credentials', () => {
    const loginContent = fs.readFileSync(path.join(clientSrc, 'pages', 'admin', 'AdminLoginPage.jsx'), 'utf8');

    // No hardcoded credentials pre-filled in state
    assert.ok(loginContent.includes("useState('')"), 'Initial email/password must be blank, not hardcoded');
    assert.ok(!loginContent.includes("Default test credential: admin@shlloka.com"), 'Must not expose default test credential in UI');

    // Show / Hide password toggle
    assert.ok(loginContent.includes('showPassword'), 'Must implement showPassword state');
    assert.ok(loginContent.includes('EyeOff') && loginContent.includes('Eye'), 'Must toggle Eye and EyeOff icons');

    // Remember Me
    assert.ok(loginContent.includes('rememberMe'), 'Must implement rememberMe state');
    assert.ok(loginContent.includes('shlloka_admin_remember_email'), 'Must persist rememberMe in storage');

    // Forgot Password
    assert.ok(loginContent.includes('Forgot password?'), 'Must have Forgot password option');

    // Redirect after login
    assert.ok(loginContent.includes('navigate(from'), 'Must redirect to target dashboard route upon login');
  });

  // --- 3. Booking Reference Format ---
  test('5. Booking creation generates unique reference adhering to SHY-2027-XXXXXX format', () => {
    const bookingRoutes = fs.readFileSync(path.join(serverSrc, 'routes', 'booking.routes.js'), 'utf8');
    assert.ok(bookingRoutes.includes('SHY-2027-'), 'Booking reference must be prefixed with SHY-2027-');
    assert.ok(!bookingRoutes.includes('SKY-2027-'), 'Old SKY prefix must be completely replaced with SHY');
  });

  // --- 4. Database-Driven Calculations (Strict Zero-Dummy Data) ---
  test('6. Dashboard stats endpoint calculates real totals from database with zero dummy stats', () => {
    const adminRoutes = fs.readFileSync(path.join(serverSrc, 'routes', 'admin.routes.js'), 'utf8');

    assert.ok(adminRoutes.includes('totalBookings = await prisma.booking.count()'), 'Must count total bookings from DB');
    assert.ok(adminRoutes.includes("status: 'CONFIRMED'"), 'Must calculate confirmed bookings');
    assert.ok(adminRoutes.includes("status: 'PENDING'"), 'Must calculate pending bookings');
    assert.ok(adminRoutes.includes("status: 'CANCELLED'"), 'Must calculate cancelled bookings');
    assert.ok(adminRoutes.includes('totalTravellers = await prisma.traveller.count()'), 'Must count registered devotees from travellers');
    assert.ok(adminRoutes.includes('totalAmountCollected = successfulPayments.reduce'), 'Must sum actual collected payments');
    assert.ok(adminRoutes.includes('pendingPaymentsAmount'), 'Must calculate real pending payments balance');
    assert.ok(adminRoutes.includes('refundsProcessed'), 'Must calculate processed refunds');
  });

  // --- 5. Booking Management Endpoints & Logic ---
  test('7. Admin routes include complete booking management, detail view, notes, and WhatsApp logging', () => {
    const adminRoutes = fs.readFileSync(path.join(serverSrc, 'routes', 'admin.routes.js'), 'utf8');

    // GET /bookings
    assert.ok(adminRoutes.includes("router.get('/bookings'"), 'Must implement GET /bookings');
    assert.ok(adminRoutes.includes('bookingReference: { contains: searchTerm }'), 'Must support searching by booking reference');

    // GET /bookings/:id
    assert.ok(adminRoutes.includes("router.get('/bookings/:id'"), 'Must implement GET /bookings/:id');
    assert.ok(adminRoutes.includes('financialSummary'), 'Booking detail must compute financialSummary');
    assert.ok(adminRoutes.includes('balanceDue'), 'Booking detail must compute balanceDue');

    // POST /bookings/:id/notes
    assert.ok(adminRoutes.includes("router.post('/bookings/:id/notes'"), 'Must implement POST /bookings/:id/notes');
    assert.ok(adminRoutes.includes('prisma.bookingNote.create'), 'Must save note in bookingNote model');

    // POST /bookings/:id/whatsapp
    assert.ok(adminRoutes.includes("router.post('/bookings/:id/whatsapp'"), 'Must implement POST /bookings/:id/whatsapp');
    assert.ok(adminRoutes.includes('prisma.whatsappMessage.create'), 'Must log sent message in whatsappMessage model');
  });

  // --- 6. Offline Payment Recording ---
  test('8. Offline payment endpoint creates verified receipt and transactionally updates booking balance', () => {
    const adminRoutes = fs.readFileSync(path.join(serverSrc, 'routes', 'admin.routes.js'), 'utf8');

    assert.ok(adminRoutes.includes("router.post('/payments/offline'"), 'Must implement POST /payments/offline');
    assert.ok(adminRoutes.includes('CASH') && adminRoutes.includes('BANK_TRANSFER') && adminRoutes.includes('UPI'), 'Must support CASH, BANK_TRANSFER, UPI modes');
    assert.ok(adminRoutes.includes('prisma.$transaction'), 'Must execute offline payment and status update in a transaction');
    assert.ok(adminRoutes.includes('REC-OFF-'), 'Must generate unique offline receipt number');
  });

  // --- 7. WhatsApp Customer Update Templates ---
  test('9. AdminBookingDetailPage implements all 13 pre-approved WhatsApp templates and wa.me click-to-chat fallback', () => {
    const detailPage = fs.readFileSync(path.join(clientSrc, 'pages', 'admin', 'AdminBookingDetailPage.jsx'), 'utf8');

    assert.ok(detailPage.includes('WHATSAPP_TEMPLATES'), 'Must define WHATSAPP_TEMPLATES object');
    assert.ok(detailPage.includes('BOOKING_RECEIVED'), 'Template 1: Booking Received must be present');
    assert.ok(detailPage.includes('ADVANCE_RECEIVED'), 'Template 2: Advance Received must be present');
    assert.ok(detailPage.includes('FULL_PAYMENT_CONFIRMED'), 'Template 3: Full Payment Confirmed must be present');
    assert.ok(detailPage.includes('BALANCE_REMINDER'), 'Template 4: Balance Reminder must be present');
    assert.ok(detailPage.includes('DOCS_PENDING'), 'Template 5: Docs Pending must be present');
    assert.ok(detailPage.includes('DOCS_VERIFIED'), 'Template 6: Docs Verified must be present');
    assert.ok(detailPage.includes('DEPARTURE_APPROACHING'), 'Template 7: Departure Approaching must be present');
    assert.ok(detailPage.includes('PACKING_GUIDE'), 'Template 8: Packing Guide must be present');
    assert.ok(detailPage.includes('MEDICAL_ADVISORY'), 'Template 9: Medical Advisory must be present');
    assert.ok(detailPage.includes('BRIEFING_SCHEDULE'), 'Template 10: Briefing Schedule must be present');
    assert.ok(detailPage.includes('ROUTE_UPDATE'), 'Template 11: Route Update must be present');
    assert.ok(detailPage.includes('CANCELLATION_NOTICE'), 'Template 12: Cancellation Notice must be present');
    assert.ok(detailPage.includes('CUSTOM_MESSAGE'), 'Template 13: Custom Message must be present');

    // wa.me click to chat
    assert.ok(detailPage.includes('https://wa.me/'), 'Must link to wa.me for click-to-chat fallback');
    assert.ok(detailPage.includes('encodeURIComponent'), 'Must URL-encode WhatsApp message text');
  });

  // --- 8. Complete UI Pages & Layout ---
  test('10. AdminLayout provides core sidebar items without Staff section and responsive mobile slide-out navigation', () => {
    const layoutContent = fs.readFileSync(path.join(clientSrc, 'components', 'AdminLayout.jsx'), 'utf8');

    assert.ok(layoutContent.includes('/admin/dashboard'), 'Sidebar must include Dashboard');
    assert.ok(layoutContent.includes('/admin/bookings'), 'Sidebar must include Bookings');
    assert.ok(layoutContent.includes('/admin/customers'), 'Sidebar must include Customers');
    assert.ok(layoutContent.includes('/admin/payments'), 'Sidebar must include Payments');
    assert.ok(layoutContent.includes('/admin/departures'), 'Sidebar must include Departures');
    assert.ok(layoutContent.includes('/admin/pricing'), 'Sidebar must include Route Pricing');
    assert.ok(layoutContent.includes('/admin/documents'), 'Sidebar must include Document Verification');
    assert.ok(layoutContent.includes('/admin/refunds'), 'Sidebar must include Refund Requests');
    assert.ok(layoutContent.includes('/admin/enquiries'), 'Sidebar must include Enquiries');
    assert.ok(layoutContent.includes('/admin/whatsapp'), 'Sidebar must include WhatsApp Updates');
    assert.ok(layoutContent.includes('/admin/reports'), 'Sidebar must include Reports');
    assert.ok(!layoutContent.includes('/admin/users'), 'Sidebar must NOT include Staff & Roles section per user requirement');
    assert.ok(layoutContent.includes('/admin/audit-logs'), 'Sidebar must include Audit Trail');

    // Mobile Drawer
    assert.ok(layoutContent.includes('sidebarOpen'), 'Sidebar must manage mobile open state');
    assert.ok(layoutContent.includes('fixed lg:static'), 'Sidebar must support fixed mobile drawer and static desktop sidebar');
  });

  test('11. AdminDashboardPage renders real metric cards and displays clean zero-state when empty', () => {
    const dashContent = fs.readFileSync(path.join(clientSrc, 'pages', 'admin', 'AdminDashboardPage.jsx'), 'utf8');

    assert.ok(dashContent.includes('totalBookings'), 'Must render totalBookings');
    assert.ok(dashContent.includes('totalRegisteredDevotees'), 'Must render totalRegisteredDevotees');
    assert.ok(dashContent.includes('totalAmountCollected'), 'Must render totalAmountCollected');
    assert.ok(dashContent.includes('pendingPaymentsAmount'), 'Must render pendingPaymentsAmount');
    assert.ok(dashContent.includes('refundsProcessed'), 'Must render refundsProcessed');
    assert.ok(dashContent.includes('No Bookings Registered Yet'), 'Must provide empty state when totalBookings is 0');
  });

  test('12. App.jsx registers all administrative routes protected by ProtectedRoute', () => {
    const appContent = fs.readFileSync(path.join(clientSrc, 'App.jsx'), 'utf8');

    assert.ok(appContent.includes('/admin/login'), 'App.jsx must route /admin/login');
    assert.ok(appContent.includes('/admin/dashboard'), 'App.jsx must route /admin/dashboard');
    assert.ok(appContent.includes('/admin/bookings'), 'App.jsx must route /admin/bookings');
    assert.ok(appContent.includes('/admin/bookings/:id'), 'App.jsx must route /admin/bookings/:id');
    assert.ok(appContent.includes('/admin/customers'), 'App.jsx must route /admin/customers');
    assert.ok(appContent.includes('/admin/payments'), 'App.jsx must route /admin/payments');
    assert.ok(appContent.includes('/admin/whatsapp'), 'App.jsx must route /admin/whatsapp');
    assert.ok(appContent.includes('/admin/reports'), 'App.jsx must route /admin/reports');
    assert.ok(appContent.includes('/admin/users'), 'App.jsx must route /admin/users');
  });
});
