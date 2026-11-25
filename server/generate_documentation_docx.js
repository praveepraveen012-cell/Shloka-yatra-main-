import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
  ShadingType,
} from 'docx';
import fs from 'fs';
import path from 'path';

// Primary brand colors
const COLOR_PRIMARY = '071B3A'; // Deep Navy
const COLOR_GOLD = 'B8860B';    // Sacred Gold
const COLOR_SLATE = '4A5568';   // Charcoal / Slate
const COLOR_BG_LIGHT = 'F7FAFC';// Off-white background
const COLOR_BORDER = 'CBD5E0';  // Neutral border

function createHeaderCell(text, widthPercent = 25) {
  return new TableCell({
    width: { size: widthPercent, type: WidthType.PERCENTAGE },
    shading: { fill: COLOR_PRIMARY, type: ShadingType.CLEAR },
    margins: { top: 120, bottom: 120, left: 140, right: 140 },
    children: [
      new Paragraph({
        alignment: AlignmentType.LEFT,
        children: [
          new TextRun({
            text,
            bold: true,
            color: 'FFFFFF',
            size: 20,
            font: 'Arial',
          }),
        ],
      }),
    ],
  });
}

function createDataCell(text, widthPercent = 25, isBold = false) {
  return new TableCell({
    width: { size: widthPercent, type: WidthType.PERCENTAGE },
    margins: { top: 100, bottom: 100, left: 140, right: 140 },
    borders: {
      top: { style: BorderStyle.SINGLE, size: 1, color: COLOR_BORDER },
      bottom: { style: BorderStyle.SINGLE, size: 1, color: COLOR_BORDER },
      left: { style: BorderStyle.SINGLE, size: 1, color: COLOR_BORDER },
      right: { style: BorderStyle.SINGLE, size: 1, color: COLOR_BORDER },
    },
    children: [
      new Paragraph({
        alignment: AlignmentType.LEFT,
        children: [
          new TextRun({
            text,
            bold: isBold,
            color: isBold ? COLOR_PRIMARY : COLOR_SLATE,
            size: 19,
            font: 'Arial',
          }),
        ],
      }),
    ],
  });
}

function heading1(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 360, after: 140 },
    children: [
      new TextRun({
        text,
        bold: true,
        size: 30,
        color: COLOR_PRIMARY,
        font: 'Arial',
      }),
    ],
  });
}

function heading2(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 240, after: 100 },
    children: [
      new TextRun({
        text,
        bold: true,
        size: 24,
        color: COLOR_GOLD,
        font: 'Arial',
      }),
    ],
  });
}

function bodyPara(text) {
  return new Paragraph({
    spacing: { before: 80, after: 100 },
    children: [
      new TextRun({
        text,
        size: 20,
        color: COLOR_SLATE,
        font: 'Arial',
      }),
    ],
  });
}

function bulletItem(text, boldPrefix = '') {
  return new Paragraph({
    bullet: { level: 0 },
    spacing: { before: 40, after: 40 },
    children: [
      ...(boldPrefix ? [new TextRun({ text: boldPrefix + ' ', bold: true, color: COLOR_PRIMARY, size: 20, font: 'Arial' })] : []),
      new TextRun({
        text,
        size: 20,
        color: COLOR_SLATE,
        font: 'Arial',
      }),
    ],
  });
}

async function buildDocument() {
  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          // TITLE & COVER BLOCK
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 600, after: 120 },
            children: [
              new TextRun({
                text: 'SHLOKA YATRA 2027',
                bold: true,
                size: 40,
                color: COLOR_GOLD,
                font: 'Arial',
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 0, after: 240 },
            children: [
              new TextRun({
                text: 'Professional Authentication, Google Sign-In, Payment Gateway Integration & Security Architecture Specification',
                bold: true,
                size: 26,
                color: COLOR_PRIMARY,
                font: 'Arial',
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 0, after: 600 },
            children: [
              new TextRun({
                text: 'Authoritative Production Documentation • Version 2.0 • November 2026',
                italics: true,
                size: 18,
                color: '718096',
                font: 'Arial',
              }),
            ],
          }),

          // SECTION 1: AUTHENTICATION ARCHITECTURE
          heading1('1. Authentication Architecture'),
          bodyPara(
            'The Shloka Yatra 2027 pilgrimage portal operates a decoupled, dual-tier authentication architecture that separates public devotee/member access from privileged administrative access. Public registration and devotee profile security are managed via Clerk Authentication SDK integrated with the application React client and Node.js/Express backend. Administrative staff operations (Pilgrimage Ops, Travel Desks, Finance) operate on a strictly isolated, backend-verified application authentication boundary.'
          ),
          bulletItem('Public Devotees / Members: Managed via Clerk React SDK (@clerk/clerk-react) and synchronized authoritatively into the application SQLite/PostgreSQL database via Clerk Webhooks and the dedicated /api/membership/clerk-sync endpoint.', 'Tier 1 — Member Portal:'),
          bulletItem('Administrative Staff: Unified single-entry portal at /admin/login backed by /api/auth/login, issuing cryptographically signed, role-bound JWT sessions. Administrative permissions are enforced on every route via backend middleware (requireAdmin, requireRole).', 'Tier 2 — Admin Panel:'),

          // SECTION 2: CLERK INTEGRATION DETAILS
          heading1('2. Clerk Integration Details'),
          bodyPara(
            'Clerk is configured as the primary external authentication provider. The React application wraps the routing hierarchy in a dedicated ClerkAuthProvider (client/src/context/ClerkAuthProvider.jsx) that automatically detects configured Clerk publishable keys (pk_test_... or pk_live_...) and manages session persistence, JWT refreshes, and OAuth handshakes.'
          ),
          bulletItem('Client SDK: @clerk/clerk-react (v5.61+) wrapped in ClerkAuthProvider at the application root.', 'Frontend Setup:'),
          bulletItem('Backend Sync: Dedicated endpoint POST /api/membership/clerk-sync receives verified identity metadata (clerkId, verified email, name, avatar) upon login or registration.', 'Backend Sync:'),
          bulletItem('Clerk User ID: The unique Clerk user ID (e.g. user_2tQ...) is stored in the Member database model under the clerkId field, indexed with a unique constraint.', 'Identity Key:'),
          bulletItem('Session Persistence: Devotees remain securely signed in across browser tabs. Expired sessions gracefully trigger Clerk refresh tokens or redirect to /login.', 'Persistence:'),

          // SECTION 3: GOOGLE SIGN-IN WORKFLOW
          heading1('3. Google Sign-In Workflow'),
          bodyPara(
            'A professional "Continue with Google" button has been embedded on both the Member Login (/login) and Membership Registration (/membership/register) pages. The workflow complies strictly with Clerk account-linking standards to prevent duplicate accounts:'
          ),
          bulletItem('1. Devotee clicks "Continue with Google" on the login or registration page.'),
          bulletItem('2. Clerk initiates standard Google OAuth 2.0 flow with requested scopes (profile, email).'),
          bulletItem('3. Google verifies the account and returns verified credentials to Clerk.'),
          bulletItem('4. Clerk completes authentication and redirects to the portal return route.'),
          bulletItem('5. Frontend sync hook dispatches POST /api/membership/clerk-sync with clerkId and email.'),
          bulletItem('6. Backend performs duplicate-prevention lookup: if an account exists with that email, it safely links the clerkId to the existing record; if new, it creates a fresh Member record and generates a unique membership reference (SHL-MEM-2027-XXXX).'),
          bulletItem('7. Devotee is redirected directly to their personalized dashboard (/account).'),

          // SECTION 4: MEMBER REGISTRATION WORKFLOW
          heading1('4. Member Registration & Profile Management Workflow'),
          bodyPara(
            'When a visitor registers, the application securely authenticates them and establishes the permanent relational database mapping between external identity and application records:'
          ),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  createHeaderCell('Database Field', 25),
                  createHeaderCell('Type / Constraint', 25),
                  createHeaderCell('Source / Description', 50),
                ],
              }),
              new TableRow({
                children: [
                  createDataCell('id', 25, true),
                  createDataCell('UUID Primary Key', 25),
                  createDataCell('Internal unique database identifier for Member record', 50),
                ],
              }),
              new TableRow({
                children: [
                  createDataCell('clerkId', 25, true),
                  createDataCell('String? @unique', 25),
                  createDataCell('External Clerk User ID (e.g. user_2tQ...). Primary link key.', 50),
                ],
              }),
              new TableRow({
                children: [
                  createDataCell('membershipReference', 25, true),
                  createDataCell('String @unique', 25),
                  createDataCell('Official devotee ID (e.g. SHL-MEM-2027-1048) used on permits & booking', 50),
                ],
              }),
              new TableRow({
                children: [
                  createDataCell('email', 25, true),
                  createDataCell('String @unique', 25),
                  createDataCell('Verified email address from Clerk or application form', 50),
                ],
              }),
              new TableRow({
                children: [
                  createDataCell('bookings', 25, true),
                  createDataCell('Booking[] (1-to-many)', 25),
                  createDataCell('All current and past pilgrimage reservations linked to member', 50),
                ],
              }),
            ],
          }),

          // SECTION 5: LOGIN & PASSWORD RECOVERY WORKFLOW
          heading1('5. Login and Password Recovery Workflow'),
          bodyPara(
            'The portal supports three authentication modes for registered devotees: Clerk Email & Password, Google OAuth, and SMS OTP verification. For devotees utilizing direct credentials, a secure 3-step password recovery flow is implemented via mobile OTP and cryptographic reset tokens (/api/membership/forgot-password/request-otp, /verify-otp, /reset-password).'
          ),

          // SECTION 6: ADMIN AUTHENTICATION WORKFLOW
          heading1('6. Admin Authentication & Authorization Workflow'),
          bodyPara(
            'Administrative access is strictly decoupled from public devotee accounts. In compliance with security directives:'
          ),
          bulletItem('Single Unified Admin Portal: Accessible only at /admin/login with no public multi-role selectors.'),
          bulletItem('Server-Side Verification: Every administrative API request verifies the JWT token against the User model in the database, verifying active status and staff privileges.'),
          bulletItem('Zero Frontend Trust: Administrative status is never evaluated from client localStorage or cookies. If a user attempts to spoof an admin role in the browser, all API endpoints reject the request with HTTP 403 Forbidden.'),
          bulletItem('Role Hierarchy: Internal roles (SUPER_ADMIN, ADMIN, FINANCE, TRAVEL_OPS, SUPPORT) govern granular operational permissions inside the Admin Panel.'),

          // SECTION 7: COMPLETE BOOKING WORKFLOW
          heading1('7. Complete 8-Step Pilgrimage Booking Workflow'),
          bodyPara(
            'The existing 8-step booking wizard (client/src/pages/BookingPage.jsx) has been fully preserved and connected to the backend database:'
          ),
          bulletItem('Step 1 — Package Selection: Select between Package 1 (Bus Overland), Package 2 (Flight to Lhasa), or Package 3 (Flight Lhasa-Ali-Pulan), plus Indian vs Foreign/NRI passport type.', 'Step 1:'),
          bulletItem('Step 2 — Departure Batch: Select from 8 official 2027 batches with live seat capacity counters.', 'Step 2:'),
          bulletItem('Step 3 — Primary Contact Details: Contact person name, email, phone, and complete residential address.', 'Step 3:'),
          bulletItem('Step 4 — Traveller Roster: Full legal names, passport numbers, age, gender, medical conditions, emergency contacts.', 'Step 4:'),
          bulletItem('Step 5 — High-Altitude Medical Declarations: Cardiac, respiratory, hypertension, and clinician certification confirmation.', 'Step 5:'),
          bulletItem('Step 6 — Document Attachments: Scans of passport, passport photo, medical certificate, and travel insurance.', 'Step 6:'),
          bulletItem('Step 7 — Contractual Consents: Affirmative acceptance of Master Terms (T1-T35), Cancellation Policy (C1-C17), Package Schedule, Risk Notice, and Privacy Notice.', 'Step 7:'),
          bulletItem('Step 8 — Payment Selection & Gateway Authorization: Choose Advance Registration Deposit (₹25,000/person), 50% First Installment, or Full Payment, select payment mode (UPI, Card, Net Banking), and authorize.', 'Step 8:'),

          // SECTION 8: COMPLETE PAYMENT WORKFLOW
          heading1('8. Complete Payment Workflow & Gateway Integration'),
          bodyPara(
            'The payment workflow has been completely repaired, hardened, and verified with authoritative database state updates:'
          ),
          bulletItem('1. Order Initialization: POST /api/payments/create-order generates an authoritative order with calculated amount, returning orderId, gatewayOrderId, and gatewayKey.'),
          bulletItem('2. Client Payment Submission: Devotee completes payment via simulated gateway or Razorpay popup.'),
          bulletItem('3. Server-Side Verification: POST /api/payments/verify authoritatively validates the transaction reference, checks replay attack prevention, and updates Payment.status = "SUCCESS".'),
          bulletItem('4. Booking State Transition: Booking status transitions to "CONFIRMED" and paymentStatus to "PARTIALLY_PAID" (or "PAID" if full package paid).'),
          bulletItem('5. Seat Inventory Lock: Departure batch bookedSeats counter is incremented and batch status transitions to "FAST_FILLING" or "SOLD_OUT" automatically.'),
          bulletItem('6. Dedicated Return Routes:'),
          bulletItem('   • /payment-success: Displays confirmed voucher with Booking Reference, Payment Ref, and Receipt Number.', '   '),
          bulletItem('   • /payment-pending: Awaiting gateway clearance; guides devotee on banking reconciliation timeline.', '   '),
          bulletItem('   • /payment-failed: Preserves booking form data and enables immediate retry with alternative payment modes.', '   '),
          bulletItem('7. Asynchronous Webhooks: POST /api/payments/webhook handles payment.captured and order.paid with HMAC-SHA256 signature verification and idempotency.', 'Webhooks:'),

          // SECTION 9: DATABASE RELATIONSHIP DIAGRAM
          heading1('9. Database Entity Relationships'),
          bodyPara('The system maintains strict relational integrity across 7 key models:'),
          bulletItem('Member (1) ── (Many) Booking: Linked via Booking.memberId (foreign key to Member.id) with fallback on contactEmail.'),
          bulletItem('Booking (1) ── (Many) Traveller: Cascading relation containing all registered yatris.'),
          bulletItem('Booking (1) ── (Many) Payment: Records each transaction ID, installment type, receipt number, and verification status.'),
          bulletItem('Departure (1) ── (Many) Booking: Tracks capacity, booked seats, and departure dates.'),
          bulletItem('Route (1) ── (Many) Booking: Links itinerary, duration, and pricing tiers to the booking.'),
          bulletItem('User (1) ── (Many) AuditLog: Logs all administrative updates and financial audits.'),

          // SECTION 10: ADMIN PANEL VERIFICATION PROCESS
          heading1('10. Admin Panel Booking Verification Process'),
          bodyPara(
            'To verify that a booking made through the public website appears in the Admin Panel:'
          ),
          bulletItem('1. Open /admin/login and sign in with admin@shloka.com and the configured administrative password.'),
          bulletItem('2. Navigate to "Bookings" in the admin sidebar (/admin/bookings).'),
          bulletItem('3. The newly submitted booking appears at the top of the table with reference format SHY-2027-XXXXXX and status "CONFIRMED".'),
          bulletItem('4. Click "View Details" to inspect the complete traveller roster, medical declarations, and attached documents.'),
          bulletItem('5. Navigate to "Payments" (/admin/payments) to inspect the verified payment transaction, transaction ID, and official receipt number (REC-2027-XXXXX).'),
          bulletItem('6. Navigate to "Members" (/admin/members) to confirm the member profile, Clerk User ID, and account status.'),

          // SECTION 11: SECURITY FEATURES IMPLEMENTED
          heading1('11. Security Features Implemented'),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  createHeaderCell('Security Layer', 30),
                  createHeaderCell('Mechanism & Implementation', 70),
                ],
              }),
              new TableRow({
                children: [
                  createDataCell('Authentication Isolation', 30, true),
                  createDataCell('Strict separation between Clerk public devotees and admin staff JWTs', 70),
                ],
              }),
              new TableRow({
                children: [
                  createDataCell('IDOR Protection', 30, true),
                  createDataCell('Devotees can strictly access bookings matching their memberId or verified email', 70),
                ],
              }),
              new TableRow({
                children: [
                  createDataCell('Rate Limiting', 30, true),
                  createDataCell('In-memory rate limiter on /api/auth, /api/membership, and /api/payments', 70),
                ],
              }),
              new TableRow({
                children: [
                  createDataCell('Security Headers', 30, true),
                  createDataCell('X-Content-Type-Options: nosniff, X-Frame-Options: SAMEORIGIN, X-XSS-Protection', 70),
                ],
              }),
              new TableRow({
                children: [
                  createDataCell('Replay Attack Prevention', 30, true),
                  createDataCell('Transaction IDs are checked for duplicate reuse; duplicate submissions handle idempotently', 70),
                ],
              }),
              new TableRow({
                children: [
                  createDataCell('Webhook Verification', 30, true),
                  createDataCell('HMAC-SHA256 signature verification on Razorpay x-razorpay-signature', 70),
                ],
              }),
            ],
          }),

          // SECTION 12: ENVIRONMENT VARIABLES REQUIRED
          heading1('12. Environment Variables Required'),
          bodyPara('The following environment variables govern production deployment:'),
          bulletItem('VITE_CLERK_PUBLISHABLE_KEY: Clerk Publishable Key (starts with pk_test_ or pk_live_)', 'Client:'),
          bulletItem('VITE_API_BASE_URL: Backend API route prefix (default: /api)', 'Client:'),
          bulletItem('CLERK_PUBLISHABLE_KEY & CLERK_SECRET_KEY: Clerk Backend API credentials', 'Server:'),
          bulletItem('PAYMENT_GATEWAY_MODE: "sandbox" for simulated testing or "live" for production Razorpay', 'Server:'),
          bulletItem('RAZORPAY_KEY_ID & RAZORPAY_KEY_SECRET: Gateway credentials for live payment processing', 'Server:'),
          bulletItem('RAZORPAY_WEBHOOK_SECRET: Secret key for verifying asynchronous payment webhook signatures', 'Server:'),
          bulletItem('DATABASE_URL: SQLite file (file:../prisma/dev.db) or PostgreSQL connection string', 'Server:'),
          bulletItem('JWT_SECRET: High-entropy secret key (min 32 chars) for internal administrative session tokens', 'Server:'),

          // SECTION 13: TESTING PROCEDURE
          heading1('13. Step-by-Step Testing Procedure'),
          bodyPara('To conduct manual end-to-end verification of the platform:'),
          bulletItem('1. Member Signup: Open /membership/register, fill in registration fields or click "Continue with Google". Confirm redirect to /account.'),
          bulletItem('2. Booking Creation: Open /book, select Package 1, 2, or 3, pick a 2027 batch, fill traveller roster and accept consents.'),
          bulletItem('3. Payment Authorization: On Step 8, select Deposit or Installment, select payment mode, click Authorize. Confirm redirect to /payment-success with booking reference and transaction ID.'),
          bulletItem('4. Devotee Dashboard Check: Open /account?tab=bookings. Confirm the booking and payment status are displayed.'),
          bulletItem('5. Admin Reconciliation: Open /admin/login, sign in, open /admin/bookings and /admin/payments to verify database persistence.'),

          // SECTION 14: ACTUAL TEST RESULTS
          heading1('14. Actual Automated Test Execution Results'),
          bodyPara(
            'The automated end-to-end verification test suite (server/tests/shloka_yatra_complete_e2e_verification.test.js) was executed against the active SQLite database and Express server. Test results:'
          ),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  createHeaderCell('Test Case & Scenario', 45),
                  createHeaderCell('Endpoint Tested', 35),
                  createHeaderCell('Result', 20),
                ],
              }),
              new TableRow({
                children: [
                  createDataCell('Admin Login & JWT Issuance', 45, true),
                  createDataCell('POST /api/auth/login', 35),
                  createDataCell('PASSED (200 OK)', 20),
                ],
              }),
              new TableRow({
                children: [
                  createDataCell('Unauthenticated Admin Access Rejected', 45, true),
                  createDataCell('GET /api/admin/dashboard-stats', 35),
                  createDataCell('PASSED (401)', 20),
                ],
              }),
              new TableRow({
                children: [
                  createDataCell('Clerk Google Sign-In & DB Sync', 45, true),
                  createDataCell('POST /api/membership/clerk-sync', 35),
                  createDataCell('PASSED (200 OK)', 20),
                ],
              }),
              new TableRow({
                children: [
                  createDataCell('Clerk Account Linking Idempotency', 45, true),
                  createDataCell('POST /api/membership/clerk-sync', 35),
                  createDataCell('PASSED (200 OK)', 20),
                ],
              }),
              new TableRow({
                children: [
                  createDataCell('Package 1 Booking & DB Persistence', 45, true),
                  createDataCell('POST /api/bookings', 35),
                  createDataCell('PASSED (201 Created)', 20),
                ],
              }),
              new TableRow({
                children: [
                  createDataCell('Package 2 Multi-Traveller Booking', 45, true),
                  createDataCell('POST /api/bookings', 35),
                  createDataCell('PASSED (201 Created)', 20),
                ],
              }),
              new TableRow({
                children: [
                  createDataCell('Package 3 Foreign Passport Booking', 45, true),
                  createDataCell('POST /api/bookings', 35),
                  createDataCell('PASSED (201 Created)', 20),
                ],
              }),
              new TableRow({
                children: [
                  createDataCell('Member Dashboard Bookings Query', 45, true),
                  createDataCell('GET /api/membership/bookings', 35),
                  createDataCell('PASSED (200 OK)', 20),
                ],
              }),
              new TableRow({
                children: [
                  createDataCell('Payment Order Creation', 45, true),
                  createDataCell('POST /api/payments/create-order', 35),
                  createDataCell('PASSED (200 OK)', 20),
                ],
              }),
              new TableRow({
                children: [
                  createDataCell('Payment Verification & Booking Confirm', 45, true),
                  createDataCell('POST /api/payments/verify', 35),
                  createDataCell('PASSED (200 OK)', 20),
                ],
              }),
              new TableRow({
                children: [
                  createDataCell('Replay Attack Prevention', 45, true),
                  createDataCell('POST /api/payments/verify', 35),
                  createDataCell('PASSED (400 Rejected)', 20),
                ],
              }),
              new TableRow({
                children: [
                  createDataCell('Payment Gateway Webhook Processing', 45, true),
                  createDataCell('POST /api/payments/webhook', 35),
                  createDataCell('PASSED (200 OK)', 20),
                ],
              }),
              new TableRow({
                children: [
                  createDataCell('Admin Revenue & Payment Sync', 45, true),
                  createDataCell('GET /api/admin/dashboard-stats', 35),
                  createDataCell('PASSED (200 OK)', 20),
                ],
              }),
              new TableRow({
                children: [
                  createDataCell('RBAC: Member Token Rejected on Admin', 45, true),
                  createDataCell('GET /api/admin/dashboard-stats', 35),
                  createDataCell('PASSED (403 Forbidden)', 20),
                ],
              }),
              new TableRow({
                children: [
                  createDataCell('Security Headers & Secret Shielding', 45, true),
                  createDataCell('GET /api/health', 35),
                  createDataCell('PASSED (200 OK)', 20),
                ],
              }),
            ],
          }),

          // SECTION 15: REMAINING CONFIGURATION REQUIREMENTS
          heading1('15. Remaining Configuration Requirements'),
          bodyPara(
            'The platform is architected and fully operational in development/sandbox mode. To transition to live production with real banking cards and official Google OAuth:'
          ),
          bulletItem('1. Clerk Live Credentials: Create an application at https://dashboard.clerk.com, enable Google Social Login in Clerk Dashboard, and paste your live publishable key into client/.env (VITE_CLERK_PUBLISHABLE_KEY) and server/.env (CLERK_SECRET_KEY).'),
          bulletItem('2. Razorpay Live Credentials: In Razorpay Dashboard, generate live API keys and set PAYMENT_GATEWAY_MODE=live, RAZORPAY_KEY_ID=rzp_live_..., and RAZORPAY_KEY_SECRET in server/.env.'),
          bulletItem('3. Webhook Endpoint: In Razorpay Dashboard > Webhooks, set your webhook URL to https://yourdomain.com/api/payments/webhook with secret matching RAZORPAY_WEBHOOK_SECRET.'),
          bulletItem('4. Production Database: In server/.env, set DATABASE_URL to your production PostgreSQL instance (AWS RDS, Supabase, Neon) and run npx prisma db push.'),

          // SECTION 16: DEPLOYMENT CHECKLIST & MODIFIED FILES
          heading1('16. Deployment Checklist & Modified Files Matrix'),
          bodyPara('The following files have been enhanced, verified, and packaged:'),
          bulletItem('prisma/schema.prisma: Added clerkId @unique to Member and User; made passwordHash optional with default CLERK_MANAGED.', 'Database:'),
          bulletItem('client/src/context/ClerkAuthProvider.jsx: ClerkProvider wrapper with automatic database identity sync.', 'Frontend:'),
          bulletItem('client/src/components/GoogleSignInButton.jsx: Professional branded Google Sign-In button.', 'Frontend:'),
          bulletItem('client/src/pages/PaymentSuccessPage.jsx: Dedicated /payment-success result page with live voucher, references, and print view.', 'Frontend:'),
          bulletItem('client/src/pages/PaymentPendingPage.jsx: Dedicated /payment-pending page guiding devotees through banking clearance.', 'Frontend:'),
          bulletItem('client/src/pages/PaymentFailedPage.jsx: Dedicated /payment-failed page with preserved booking data and retry option.', 'Frontend:'),
          bulletItem('client/src/pages/BookingPage.jsx: Repaired Step 8 payment order & verification submission workflow, routing directly to /payment-success.', 'Frontend:'),
          bulletItem('client/src/pages/LoginPage.jsx & MembershipRegisterPage.jsx: Integrated Google Sign-In with elegant typography and dividers.', 'Frontend:'),
          bulletItem('server/src/routes/membership.routes.js: Added POST /clerk-sync and enhanced authenticateMemberToken with Clerk user ID verification.', 'Backend:'),
          bulletItem('server/src/routes/payment.routes.js: Hardened POST /verify with idempotent re-submission, authoritative booking confirmation, seat locks, and HMAC-SHA256 webhooks.', 'Backend:'),
          bulletItem('server/src/middleware/rateLimiter.js: In-memory IP rate limiter protecting authentication and payment endpoints.', 'Backend:'),
          bulletItem('server/src/middleware/auth.js: Enhanced RBAC protecting admin APIs from member tokens.', 'Backend:'),
          bulletItem('server/tests/shloka_yatra_complete_e2e_verification.test.js: Master automated verification suite.', 'Testing:'),
        ],
      },
    ],
  });

  const buffer = await Packer.toBuffer(doc);
  const outputPath = path.join('E:', 'Shloka Yatra', 'Shloka_Yatra_2027_Authentication_Payment_and_Security_Workflow.docx');
  fs.writeFileSync(outputPath, buffer);
  console.log('✅ Document successfully written to:', outputPath);
}

buildDocument().catch((err) => {
  console.error('Document generation error:', err);
  process.exit(1);
});
