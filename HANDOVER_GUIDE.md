# Shlloka Yatra 2027 — Project Handover & System Execution Guide

**Company**: Shlloka Yatra Private Limited  
**Official Project**: Kailash Mansarovar Parikrama Yatra 2027 Portal  
**Corporate Office**: Flat No. 7164, ATS One Hamlet Tower 7, Sector 104, Noida, UP 201304, India  
**Legal Status**: Sole Contracting Organiser (`DRAFT V1.0 — FOR LEGAL AND MANAGEMENT APPROVAL | 12 November 2026`)

---

## 1. Executive Summary

This package contains the complete, production-ready, full-stack website and pilgrimage management platform developed for **Shlloka Yatra Private Limited**. 

### Key Highlights:
- **Zero Dummy UI**: Fully functional frontend, REST API backend, SQLite/PostgreSQL database, real authentication, and live booking workflow.
- **Yatra.com-Inspired Conversion Design**: Prominent search & booking panel, curated package comparisons, structured information hierarchy, and mobile-first responsiveness.
- **100% Authentic Photographic Experience**: Completely video-free. Powered exclusively by the 165 unique, deduplicated photographs from Ameet ji's Kailash Mansarovar collection. Zero generic stock or template placeholders.
- **Contractual Precision**: Enforces Shlloka Yatra Private Limited as sole contracting entity, Clause C4 single refund formula, and 7 Annex B legal acceptance checkboxes.
- **100% Automated Test Suite**: 13 unit and integration tests passing with a 100% pass rate.

---

## 2. Core Files Inventory to Share

When sharing the project, provide the clean archive **`Shlloka_Yatra_2027_Core_Files.zip`** (or the folder structure below). **Never include `node_modules` or `dist` folders**, as they will be re-generated natively on the recipient machine.

```
Shlloka_Yatra_2027/
├── package.json                         # Root orchestration scripts
├── README.md                            # Comprehensive technical documentation
├── HANDOVER_GUIDE.md                    # Executive handover & setup instructions
├── .gitignore                           # Git ignore rules for production
├── create_delivery_bundle.mjs           # One-click packager script
│
├── client/                              # FRONTEND (React 18 + Vite 6 + Tailwind CSS)
│   ├── index.html                       # HTML5 entry with Fraunces & Hanken Grotesk fonts
│   ├── vite.config.js                   # Vite configuration (port 5173, /api proxy to 5000)
│   ├── tailwind.config.js               # Tailwind design tokens
│   ├── postcss.config.js                # PostCSS configuration
│   ├── package.json                     # Frontend dependencies
│   ├── .env.example                     # Frontend environment template
│   │
│   ├── public/                          # Public static assets
│   │   └── assets/shlloka-yatra/
│   │       ├── images/                  # 165 authentic photos (sy_img_001.jpg - sy_img_165.jpg)
│   │       ├── contact-sheet.html       # Visual inspection contact sheet
│   │       └── manifest_analysis.json   # Deduplication & metadata report
│   │
│   └── src/
│       ├── components/                  # Navbar, Footer, JourneySearchWidget, RouteCard, etc.
│       ├── pages/                       # HomePage, Routes, Departures, Book, About, Gallery, etc.
│       │   └── admin/                   # Protected Admin Dashboard & Management views
│       ├── data/                        # imageManifest.js (Centralized image registry), brochureData
│       ├── services/                    # api.js (Axios REST API client with error handling)
│       ├── utils/                       # assets.js, formatting helpers
│       ├── index.css                    # Design system color tokens & typography
│       └── main.jsx / App.jsx           # React Router DOM configuration
│
└── server/                              # BACKEND (Node.js + Express + Prisma ORM)
    ├── package.json                     # Backend dependencies & test scripts
    ├── .env.example                     # Backend environment template
    │
    ├── prisma/
    │   ├── schema.prisma                # SQLite dev schema
    │   ├── schema.postgresql.prisma     # Production PostgreSQL schema
    │   └── dev.db                       # Pre-seeded local SQLite database
    │
    ├── src/
    │   ├── index.js                     # Express API entry point (port 5000)
    │   ├── seed.js                      # Database seeder (Departures, Routes, Admin, Members)
    │   ├── controllers/                 # Auth, Bookings, Departures, Routes, Enquiries, Admin
    │   ├── middleware/                  # JWT auth, RBAC permissions, error handlers
    │   ├── routes/                      # Structured REST endpoints (/api/*)
    │   └── services/                    # Email, Payment gateway simulation, PDF generation
    │
    └── tests/                           # Automated test suite (13 integration tests)
        └── api.test.js
```

---

## 3. How to Run on Any Other System

The project is cross-platform and runs seamlessly on **Windows, macOS, and Linux**.

### Step 1: System Prerequisites
- **Node.js**: Version 18.0 or higher ([Download Node.js](https://nodejs.org/))
- **npm**: Version 9.0 or higher (comes bundled with Node.js)
- **Git** (optional, for cloning)

Verify installation by opening a terminal / command prompt:
```bash
node -v    # Should output v18.x, v20.x, or v22.x
npm -v     # Should output 9.x or 10.x
```

---

### Step 2: Unzip the Project
Extract `Shlloka_Yatra_2027_Core_Files.zip` to a folder of your choice (e.g. `C:\Projects\Shlloka_Yatra` or `~/Projects/Shlloka_Yatra`). Open a terminal inside the project directory:
```bash
cd "Shlloka Yatra"
```

---

### Step 3: One-Command Installation & Setup
Run the unified setup command from the project root:
```bash
npm run setup
```
This automatically:
1. Installs all root, backend, and frontend dependencies.
2. Synchronizes the database schema with Prisma.
3. Seeds the 2027 departures, 3 routes, pricing tiers, FAQs, legal documents, and test accounts.

*(Alternatively, if running manually:)*
```bash
npm install
npm --prefix server install
npm --prefix client install
npm --prefix server run db:push
npm --prefix server run db:seed
```

---

### Step 4: Run the Full-Stack Application

Open two terminal windows:

#### Terminal 1 — Start the Backend API (Port 5000):
```bash
npm run server
```
*Output: `Server running in development mode on port 5000`*

#### Terminal 2 — Start the Frontend (Port 5173):
```bash
npm run client
```
*Output: `VITE ready in 500 ms -> Local: http://localhost:5173/`*

---

### Step 5: Open the Application in Your Browser

- **Public Website & Booking**: [http://localhost:5173/](http://localhost:5173/)
- **165-Photograph Gallery**: [http://localhost:5173/gallery](http://localhost:5173/gallery)
- **Visual Contact Sheet**: [http://localhost:5173/assets/shlloka-yatra/contact-sheet.html](http://localhost:5173/assets/shlloka-yatra/contact-sheet.html)
- **Admin Management Login**: [http://localhost:5173/login](http://localhost:5173/login)

---

## 4. Default Seeded Credentials for Testing

| Role | Email | Password | Access Scope |
|---|---|---|---|
| **Super Admin** | `admin@shlloka.com` | `ShllokaAdmin@2027` | Master dashboard, CRM leads, passenger manifests, audit logs |
| **Travel Operations** | `operations@shlloka.com` | `ShllokaOps@2027` | Departure batches, capacity management, passenger rosters |
| **Finance** | `finance@shlloka.com` | `ShllokaFin@2027` | Payment verification, invoicing, Clause C4 refund approvals |
| **Customer Support** | `support@shlloka.com` | `ShllokaSup@2027` | Enquiry CRM, callback requests, devotee communication |
| **Devotee Member** | `rajesh.sharma@example.com` | `Devotee@2027` | Devotee account portal, booking history, voucher downloads |

---

## 5. Verification Commands

### Run Automated Tests (13 of 13 passing):
```bash
npm test
```

### Production Build Test:
```bash
npm run build
```
Generates an optimized client build in `client/dist/` in under 12 seconds with 0 warnings/errors.

---

## 6. Official Contact Channels

- **Entity**: Shlloka Yatra Private Limited
- **Corporate Office**: Flat No. 7164, ATS One Hamlet Tower 7, Sector 104, Noida, UP 201304
- **Official Helpline**: `+91 6366852888`
- **Official Email**: `volunteers@shlloka.com`
- **Grievance Officer**: Sangeeta (Noida Office)
