# Shloka Yatra 2027 — Software Testing & Quality Assurance Guide

This guide documents the automated testing architecture, test suites, execution commands, and guidelines for running tests safely without affecting production data.

---

## 1. Testing Strategy & Principles

1. **Database Isolation:**
   * Automated tests connect to an isolated SQLite test database: `prisma/test.db`.
   * The live development database (`prisma/dev.db`), which holds genuine customer records, is protected and never touched during test execution.
2. **Deterministic & Self-Cleaning Tests:**
   * Test suites create dedicated test records with timestamped unique identifiers.
   * `after()` hooks clean up generated test departures, members, and bookings.
3. **No Mocking for Core Workflows:**
   * Business logic tests execute against the real Express application using `supertest` and real Prisma database operations.

---

## 2. Test Suites Inventory

All automated test suites are located in `server/tests/`:

| Suite File | Test Count | Description |
|---|---|---|
| `admin_management_system.test.js` | 12 | Tests Super Admin role enforcement, sidebar navigation without Staff, zero dummy stats, reference formatting. |
| `single_admin_auth.test.js` | 4 | Tests Super Admin login, profile updates, and password changes. |
| `temporary_offline_payment_mode.test.js` | 6 | Tests Step 8 offline payment workflow, DB persistence, status transitions, and feature flag disabling. |
| `member_registration_and_admin.test.js` | 20 | Tests mobile OTP verification, member registration, login, password resets, and Admin CRM integration. |
| `offline_payment_workflow.test.js` | 6 | Tests offline payment submission, admin verification, rejection, and member dashboard visibility. |
| `api.test.js` | 13 | Tests full-stack API endpoints (departures, routes, pricing, bookings, legal, gallery). |
| `document_management_master.test.js` | 12 | Tests SYPL compliance documents, physician declarations, and lifecycle reviews. |
| `site_e2e_appearance_functionality_viewport_master.test.js` | 28 | Tests responsive design viewports (320px to 1440px), modal containers, and navigation layout. |

---

## 3. Test Execution Commands

### Run Core Regression Suite (48 Tests)
```bash
$env:DATABASE_URL="file:../prisma/test.db"
node --test server/tests/admin_management_system.test.js server/tests/single_admin_auth.test.js server/tests/temporary_offline_payment_mode.test.js server/tests/member_registration_and_admin.test.js server/tests/offline_payment_workflow.test.js
```

### Run Super Admin Verification Suite
```bash
node --test server/tests/admin_management_system.test.js
```

### Run Temporary Offline Payment Workflow Tests
```bash
node --test server/tests/temporary_offline_payment_mode.test.js
```

### Run Member Registration & Auth Tests
```bash
node --test server/tests/member_registration_and_admin.test.js
```

---

## 4. Setting Up the Test Database

If `prisma/test.db` needs to be initialized or refreshed:
```bash
$env:DATABASE_URL="file:./test.db"; npx prisma db push --schema=prisma/schema.prisma
$env:DATABASE_URL="file:../prisma/test.db"; node server/src/seed.js
```
