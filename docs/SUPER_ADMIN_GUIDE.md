# Shloka Yatra 2027 — Super Admin Command Center Guide

The Shloka Yatra Administrative Portal provides full operational visibility and governance over 2027 pilgrimage departures, devotee memberships, bookings, financial ledgers, and document verifications.

---

## 1. Super Admin Authentication & Security

* **Portal URL:** Navigate to `/admin/login` (or click **Admin Portal** in the website footer).
* **Access Control:** Restricted strictly to user accounts possessing the single administrative role: **`SUPER_ADMIN`**.
* **Default Super Admin Credentials (Local Environment):**
  * **Email:** `admin@shloka.com` (or `admin`)
  * **Password:** `Shloka#2027$Admin!`
* **Security Guard:** Non-super-admin users, customers, and unauthenticated sessions attempting to access `/admin/*` routes are immediately redirected to `/admin/login`.
* **Password Policy:** Upon first login, Super Admins can update their password and profile via `/admin/settings`.

---

## 2. Dashboard Overview (`/admin/dashboard`)

The Pilgrimage Command Dashboard renders **live, database-calculated metrics** with zero hardcoded or demo data:

| Metric Card | Description |
|---|---|
| **Total Bookings** | Total pilgrimage bookings recorded in database with breakdown of Confirmed vs Pending. |
| **Registered Devotees** | Count of registered travellers (yatris) across all active booking records. |
| **Registered Sangha Members** | Total registered devotees in the member directory (`/admin/members`). |
| **Confirmed Bookings** | Bookings where deposit or full payment has been verified. |
| **Pending Bookings** | Bookings awaiting payment receipt or administrative verification. |
| **Total Amount Collected** | Sum of all verified payments recorded in the financial ledger. |
| **Pending Payments** | Outstanding balance due across active bookings. |
| **Total Occupancy** | Season seat occupancy percentage calculated against total capacity. |

---

## 3. Booking Management (`/admin/bookings`)

* **Search & Filter:** Search bookings by booking ID (`SHY-2027-XXXXXX`), devotee name, phone, or email. Filter by status (`CONFIRMED`, `PENDING_CONFIRMATION`, `CANCELLED`).
* **Booking Details View (`/admin/bookings/:id`):**
  * Inspect yatri passport details, emergency contacts, and medical alerts.
  * Review financial summary: Base Package, 5% GST, deposit paid, and balance due.
  * Add internal administrative notes.
  * Dispatch pre-approved WhatsApp pilgrimage updates.
  * Manage contractual cancellation and refund calculations.

---

## 4. Customer Directory (`/admin/customers`)

Unified directory aggregating pilgrim booking holders and registered sangha accounts, displaying:
* Devotee Name & Contact Details.
* Total Bookings count and lifetime pilgrimage expenditure.
* Account status and latest pilgrimage reference.

---

## 5. Offline Payment Verification (`/admin/payments`)

When a devotee chooses **Offline Payment** during registration, the booking is recorded with:
* `paymentStatus: PENDING_VERIFICATION`
* `bookingStatus: PENDING_CONFIRMATION`

**Verification Procedure:**
1. Navigate to `/admin/payments` and find the pending offline record.
2. Verify the devotee's bank transfer / RTGS remittance in your banking records.
3. Click **Verify Offline Payment**.
4. Enter the verified amount, remittance reference number, and admin note.
5. Click **Confirm Verification**:
   * A verified `Payment` receipt is created with unique number (`REC-OFF-XXXX`).
   * The booking balance due is updated.
   * Booking status transitions to `CONFIRMED`.

---

## 6. Document Verification Workflow (`/admin/documents`)

* Review submitted yatri documents (Passports, Medical Fitness Certificates, Travel Insurance).
* Status options: `VERIFIED`, `REJECTED`, or `PENDING`.
* If rejecting a document, provide an explicit reason (e.g. "Passport copy blurred", "Physician stamp missing"). The devotee receives an update in their member portal to re-upload.

---

## 7. Departure Batch Capacity (`/admin/departures`)

* Inspect the 8 official 2027 departure batches.
* Monitor reserved seats vs maximum capacity (default 25 seats per batch).
* Manage batch status (`AVAILABLE`, `FAST_FILLING`, `SOLD_OUT`).
