# Shlloka Yatra Private Limited — Kailash Mansarovar Parikrama Yatra 2027

> **Official Full-Stack Booking Management Platform & Sacred Pilgrimage Web Application**
> Built for **Shlloka Yatra Private Limited** | Season: Kailash Mansarovar Yatra 2027.
> Sole Contracting Organiser: Shlloka Yatra Private Limited, Flat No. 7164, ATS One Hamlet Tower 7, Sector 104, Noida, UP 201304, India.

---

## 1. Executive Summary & Capabilities

This is a production-grade full-stack pilgrimage reservation platform built according to the official Kailash Mansarovar Parikrama Yatra 2027 brochure, the 3 master contractual documents, and the original visual prototypes.

- **Zero Dummy UI**: All forms, inventory seats, pricing tiers, payment rails, document verification, refund formulas, and administrative dashboards are connected to live database models with real transactions.
- **Contractual Precision**: Formally marked `DRAFT V1.0 — FOR LEGAL AND MANAGEMENT APPROVAL | 12 November 2026`. Strictly binds **Shlloka Yatra Private Limited** as the sole contracting entity.
- **Single Refund Formula (Clause C4)**: `Package Refund = max(0, Base Price paid - Cancellation Charge)`. No double-deductions of the initial ₹25,000 / $250 registration advance.
- **7-Checkbox Consent Architecture (Annex B)**: 5 mandatory unchecked legal acceptance checkboxes (Master Terms, Cancellation Policy, Service Schedule, Risk Acknowledgement, Privacy Notice) and 2 optional unchecked consents (Promotions, Media).
- **100% Automated Test Suite**: 13 comprehensive end-to-end unit and integration tests passing with a 100% pass rate.

---

## 2. Technology Stack

- **Frontend**: React.js 18, Vite 6, Tailwind CSS, React Router DOM v6, React Hook Form, Zod schema validation, Lucide React icons, Framer Motion.
- **Backend**: Node.js v20+, Express.js, REST API architecture, Morgan logging, CORS security headers.
- **Database**: PostgreSQL 15+ ready with dual-engine Prisma ORM (`v5.22.0`). Includes pre-configured SQLite (`prisma/dev.db`) for immediate zero-config execution.
- **Authentication**: Stateless HMAC SHA-256 JWT tokens, Bcrypt salt hashing, protected routing, and 6-level Role-Based Access Control (`SUPER_ADMIN`, `ADMIN`, `TRAVEL_OPS`, `FINANCE`, `SUPPORT`, `PARTICIPANT`).

---

## 3. Seeded Demo Accounts & Credentials

The database has been seeded with authorized RBAC personnel:

| Role | Email Address | Password | Permissions & Scope |
|---|---|---|---|
| **Super Admin** | `admin@shlloka.com` | `ShllokaAdmin@2027` | Master root access, audit logs, revenue metrics, pricing overrides |
| **Travel Operations** | `operations@shlloka.com` | `ShllokaOps@2027` | Passenger manifests, departures capacity, document verification |
| **Finance** | `finance@shlloka.com` | `ShllokaFin@2027` | Payment verification, invoicing, refund approval and disbursement |
| **Customer Support** | `support@shlloka.com` | `ShllokaSup@2027` | Lead CRM, support tickets, enquiries, yatri assistance |
| **Registered Devotee** | `rajesh.sharma@example.com` | `Devotee@2027` | Devotee account portal, booking vouchers, document uploads |

---

## 4. Complete 10-Step Booking Workflow

Accessible at `/book` with real-time seat lock and instant voucher generation:

1. **Step 1 – Select Travel Package**: Option 1 Bus Both Ways, Option 2 Fly Lhasa Road, Option 3 Fly Lhasa & Ali/Pulan, with Indian vs Foreign passport toggle.
2. **Step 2 – Choose Departure Batch**: 8 confirmed 2027 departures with real-time capacity and Full Moon badges (Vaishakh, Saga Dawa, Guru Purnima, Shravana Purnima).
3. **Step 3 – Lead Contact & Address**: Full legal name, email, phone with country code, permanent street address, city, state, and pincode.
4. **Step 4 – Traveller Roster**: Multiple devotees per booking with passport names, passport numbers, age, gender, dietary preferences (Satvik/Jain/Pure Veg), and emergency contacts.
5. **Step 5 – High-Altitude Medical Declarations**: Pre-existing conditions check (cardiac, respiratory, hypertension, prior AMS/HAPE/HACE), daily medications, and clinical fitness affirmation.
6. **Step 6 – Secure Document Uploads**: Passport scans (front & back), recent portrait photos, Medical Fitness Certificate, and High-Altitude Evacuation Insurance policy.
7. **Step 7 – Contractual Acceptance (Annex B)**: 5 mandatory unchecked checkboxes (T1–T35, C1–C17, Annex A, R1–R12, P1–P17) and 2 optional unchecked consents. Captures IP address, user agent, and timestamp.
8. **Step 8 – Payment Gateway Integration**: Option to pay registration deposit (₹25,000 / $250 credited towards package price) or first 50% instalment. Sandbox simulation supporting UPI (VPA), Credit/Debit Card, and Net Banking with real backend order creation (`/api/payments/create-order`) and verification (`/api/payments/verify`).
9. **Step 9 – Booking Confirmation Voucher**: Generates unique booking reference `SKY-2027-XXXX`, receipt reference `REC-2027-XXXX`, printable voucher, and preparation checklist at `/booking-success?ref=SKY-2027-XXXX`.

---

## 5. Authoritative Legal Pages & Document Priority

Per Clause T2, the legal hierarchy is strictly enforced:
1. **Package Service Schedule (Annex A)** (`/service-schedule`): Prevails as to specific routes, transport sectors, accommodations, and itemized quotations.
2. **Cancellation, Refund & Force Majeure Policy (C1–C17)** (`/cancellation-policy`): Prevails for voluntary cancellation slabs (25% / 50% / 75% / 100%), the single refund formula, company reciprocal compensation, and force majeure events.
3. **Master Terms & Conditions (T1–T35)** (`/terms`): Governs general pilgrimage obligations, conduct, permits, and liabilities.
4. **High-Altitude Risk Acknowledgement & Medical Authorisation (R1–R12)** (`/risk-acknowledgement`): Voluntary assumption of extreme-altitude risks up to 5,630 m and clinical emergency proxy.
5. **Privacy & Data Protection Notice (P1–P17)** (`/privacy-policy`): Role-based handling of sensitive passport, visa, and health information.
6. **Indian Statutory Law**: Non-excludable consumer protections prevail in every circumstance.

---

## 6. Complete Application Sitemap

### Public Pilgrimage Portal
- `/` — Homepage with hero video, spiritual overview, 3 package highlights, departures summary, and FAQ preview.
- `/kailash-mansarovar-yatra-2027` — Dedicated 2027 campaign landing page.
- `/about` — Authentic company history, mission, and verified Noida office details.
- `/packages` — Interactive comparison of the 3 travel options with Indian vs Foreign pricing.
- `/routes` — Detailed route comparison table (distances, elevations, travel modes).
- `/routes/bus-both-ways` — Dedicated Option 1 overland route page.
- `/routes/flight-to-lhasa` — Dedicated Option 2 flight to Lhasa page.
- `/routes/lhasa-ali-pulan` — Dedicated Option 3 flight to Lhasa and Ali/Pulan page.
- `/departures` — 8 approved 2027 departure batches with live capacity counters.
- `/itinerary` — Comprehensive 13–16 day day-wise itineraries and 3-day Parikrama stages.
- `/gallery` — Categorized gallery with lightbox modal (Kailash, Manasarovar, Parikrama, Rituals, Trek).
- `/preparation-safety` — High-altitude acclimatisation guide, packing lists, and insurance advice.
- `/faqs` — Searchable pilgrimage questions and answers.
- `/contact` — Lead enquiry form, official phone (`+91 6366852888`), and email (`volunteers@shlloka.com`).
- `/book` — Complete 8-step live booking wizard.
- `/booking-success` — Printable booking voucher and payment confirmation.

### Member Devotee Portal
- `/login` — Devotee authentication.
- `/membership/register` — Free member registration wizard.
- `/account` — Devotee portal showing profile, active bookings, and document verification tracker.

### Protected Administrative Dashboard (`/admin/login`)
- `/admin/dashboard` — Live revenue, booking status counters, seat occupancy rate, and CRM leads.
- `/admin/members` — Registered member directory with search, status toggles, and CSV export.
- `/admin/departures` — Real-time seat allocation, capacity adjustments, and sold-out flags.
- `/admin/bookings` — Booking management, passenger manifests, and cancellation processing.
- `/admin/documents` — Pilgrimage document verification portal (Approve/Reject passport scans, medical certs).
- `/admin/refunds` — Cancellation and refund management (Approve and mark formula-calculated refunds as disbursed).
- `/admin/enquiries` — CRM lead tracker with status updates (`NEW`, `CONTACTED`, `CONVERTED`, `CLOSED`).
- `/admin/pricing` — Database-driven route pricing and tax rate configuration.
- `/admin/audit-logs` — Immutable audit log recording all administrative actions.

---

## 7. Local Setup & Execution Guide

### Prerequisites
- Node.js v18+ (tested on Node v20/v22/v26)
- npm 9+

### Step 1: Install Dependencies
```bash
# Backend dependencies
npm --prefix server install

# Frontend dependencies
npm --prefix client install
```

### Step 2: Database Setup & Seeding
```bash
# Push Prisma schema to SQLite database (prisma/dev.db)
npx --prefix server prisma db push --schema=../prisma/schema.prisma

# Generate Prisma Client
npx --prefix server prisma generate --schema=../prisma/schema.prisma

# Seed 2027 departures, routes, pricing tiers, admin users, and sample bookings
npm --prefix server run db:seed
```

### Step 3: Run Automated Test Suite
```bash
npm --prefix server test
```
*Expected Result: 13 of 13 tests passing (100% pass rate).*

### Step 4: Build Client
```bash
npm --prefix client run build
```

### Step 5: Start Unified Server
```bash
# Starts Express API and serves built client at http://localhost:5000
npm --prefix server start
```
Open your browser and navigate to: **`http://localhost:5000`**

To run in parallel development mode with Vite hot-module replacement (HMR):
```bash
# Terminal 1: Backend API
npm --prefix server run dev

# Terminal 2: Frontend Vite
npm --prefix client run dev
```

---

## 8. Automated Test Suite Results

```text
✔ 1. GET /api/health should return operational status
✔ 2. GET /api/departures should return all 8 configured 2027 departure batches
✔ 3. GET /api/routes should return all 3 pilgrimage travel routes with itineraries and highlights
✔ 4. POST /api/pricing/calculate should accurately compute package base, 5% GST and deposit
✔ 5. POST /api/auth/login should authenticate Admin and issue JWT token
✔ 6. POST /api/enquiries submits enquiry, and Admin can view it in CRM
✔ 7. POST /api/bookings should validate travellers, reserve capacity and create booking
✔ 8. POST /api/bookings/:id/documents attaches participant document and Admin can verify
✔ 9. POST /api/payments/create-order and /verify processes deposit and updates status
✔ 10. POST /api/bookings/:id/cancel-request accurately calculates contractual refund slab and releases seat
✔ 11. Unauthorised requests without valid admin token must be rejected with 401 or 403
✔ 12. POST /api/bookings rejects invalid age, malformed email, or empty travellers
✔ 13. GET /api/legal and /api/gallery return authentic documents and images

ℹ tests 13 | pass 13 | fail 0 | 100% Pass Rate
```

---

## 9. Official Contact & Entity Details

- **Company**: Shlloka Yatra Private Limited
- **Registered Office**: Flat No. 7164, ATS One Hamlet Tower 7, Sector 104, Noida, UP 201304, India
- **Official Phone**: `+91 6366852888`
- **Official Email**: `volunteers@shlloka.com`
- **Grievance Officer**: Sangeeta (Yatra Coordinator)
- **Legal Package Status**: `DRAFT V1.0 — FOR LEGAL AND MANAGEMENT APPROVAL | 12 November 2026`
- **Powered by**: Grexotix (`https://grexotix.com/`)
