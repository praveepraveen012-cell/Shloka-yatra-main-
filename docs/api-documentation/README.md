# Shlloka Yatra 2027 — REST API Specification & Architecture Guide

This document describes the structured REST API architecture, security parameters, schemas, and endpoints for the **Shlloka Yatra Private Limited – Kailash Mansarovar Parikrama Yatra 2027** platform.

---

## 1. Architecture & Design Principles

- **Base URL**: `/api`
- **Protocol**: HTTP/HTTPS with JSON payloads
- **Validation**: Strict server-side schema validation via **Zod**
- **Authentication**: Stateless JSON Web Tokens (JWT) signed with HMAC SHA-256 (`JWT_SECRET`)
- **Authorization**: Granular Role-Based Access Control (RBAC):
  * `SUPER_ADMIN`: Full root access across finance, operations, content, and users
  * `ADMIN`: Booking management, departures, pricing, documents, and enquiries
  * `TRAVEL_OPS`: Ground operations, passenger rosters, and document verification
  * `FINANCE`: Payments, invoicing, refund approval, and bank reconciliations
  * `SUPPORT`: Customer enquiries, grievances, and support tickets
  * `PARTICIPANT`: Devotee portal access to view their own bookings, vouchers, and uploaded documents
- **Error Handling**: Standardized RFC-compliant JSON responses with explicit error codes and user-friendly diagnostics

---

## 2. Authentication & Session Management

### `POST /api/auth/login`
Authenticates an administrator or staff member.
- **Request Body**:
  ```json
  {
    "email": "admin@shlloka.com",
    "password": "ShllokaAdmin@2027"
  }
  ```
- **Response (200 OK)**:
  ```json
  {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "uuid-v4",
      "email": "admin@shlloka.com",
      "name": "Shlloka Master Admin",
      "role": "SUPER_ADMIN"
    }
  }
  ```

### `GET /api/auth/me`
Retrieves the profile and role of the currently authenticated admin/staff member.
- **Headers**: `Authorization: Bearer <token>`
- **Response (200 OK)**: User profile object

---

## 3. Public Pilgrimage Information Endpoints

### `GET /api/departures`
Returns all 8 approved brochure departure batches for 2027.
- **Response**: Array of departure objects with `batchNumber`, `name`, `arrivalDate`, `departureDate`, `totalDays`, `isFullMoon`, `totalCapacity`, `bookedSeats`, `availableSeats`, and `status`.

### `GET /api/routes`
Returns the 3 official pilgrimage routes (Option 1 Bus Both Ways, Option 2 Fly Lhasa Road, Option 3 Fly Lhasa & Ali/Pulan) with complete day-by-day itineraries, pricing tiers, and sector breakdowns.

### `POST /api/pricing/calculate`
Calculates dynamic pricing, 5% GST (for Indian passports), foreign flight supplements, and the non-refundable registration advance credit.
- **Request Body**:
  ```json
  {
    "routeId": "option-1-bus",
    "passportType": "INDIAN",
    "travellersCount": 2
  }
  ```
- **Response (200 OK)**:
  ```json
  {
    "calculation": {
      "routeId": "...",
      "passportType": "INDIAN",
      "travellersCount": 2,
      "basePricePerPerson": 350000,
      "baseAmount": 700000,
      "gstPercentage": 5,
      "gstAmount": 35000,
      "totalAmount": 735000,
      "currency": "INR",
      "depositAmount": 50000
    }
  }
  ```

### `GET /api/gallery`
Returns verified pilgrimage photographs categorized by `KAILASH`, `MANSAROVAR`, `PARIKRAMA`, `RITUALS`, and `TREK`.
- **Query Parameter**: `?category=PARIKRAMA` (optional)

### `GET /api/legal` & `GET /api/legal/:slug`
Dynamic CMS endpoints for legal documents:
- `terms-and-conditions`: Master Terms (35 clauses T1–T35)
- `cancellation-policy`: Cancellation, Refund & Force Majeure Policy (17 clauses C1–C17)
- `risk-acknowledgement`: High-Altitude Risk & Emergency Medical Authorisation (12 clauses R1–R12)
- `privacy-policy`: Privacy Notice (17 clauses P1–P17)

### `POST /api/enquiries`
Devotee pilgrimage enquiry submission with automated email acknowledgment.

---

## 4. Multi-Step Booking & Travellers Endpoints

### `POST /api/bookings`
Creates a verified pilgrimage reservation with multi-traveller rosters, capacity decrementing, and reference generation (`SKY-2027-XXXX`).
- **Request Body**:
  ```json
  {
    "routeId": "route-uuid",
    "departureId": "dep-uuid",
    "passportType": "INDIAN",
    "contactName": "Rajesh Kumar Sharma",
    "contactEmail": "rajesh@example.com",
    "contactPhone": "+91 9876543210",
    "notes": "Address: Flat 101, Noida Sector 104...",
    "policyAccepted": true,
    "travellers": [
      {
        "fullName": "Rajesh Kumar Sharma",
        "passportNumber": "Z1234567",
        "nationality": "Indian",
        "age": 48,
        "gender": "MALE",
        "dietaryPreference": "PURE_VEGETARIAN",
        "emergencyContactName": "Pooja Sharma",
        "emergencyContactPhone": "+91 9876543211"
      }
    ]
  }
  ```
- **Response (201 Created)**: Returns populated `booking` object with unique reference `SKY-2027-XXXX`.

### `GET /api/bookings/reference/:reference`
Public reference lookup for printing booking vouchers and verification cards.

### `POST /api/bookings/:id/consent`
Records affirmative contractual acceptance per Annex B standards.
- **Request Body**:
  ```json
  {
    "documentSlug": "contract-package-2027",
    "documentVersion": "DRAFT V1.0 — FOR LEGAL AND MANAGEMENT APPROVAL | 12 November 2026",
    "consentedToMasterTerms": true,
    "consentedToCancellationPolicy": true,
    "consentedToRiskNotice": true,
    "consentedToServiceSchedule": true,
    "consentedToPrivacyNotice": true,
    "consentMarketingOptional": false,
    "consentMediaOptional": false,
    "ipAddress": "127.0.0.1",
    "userAgent": "Mozilla/5.0..."
  }
  ```

### `POST /api/bookings/:id/documents`
Attaches uploaded devotee identity files (Passport scans, Photo, Medical Fitness Certificate, Travel Insurance).

### `POST /api/bookings/:id/cancel-request`
Processes a formal voluntary cancellation request, calculating the exact contractual refund slab under Clause C4:
`Package Refund = max(0, Package Base Price paid - cancellationChargeAmount)`.
Automatically restores seat capacity in the corresponding departure batch.

---

## 5. Payment Gateway Simulation & Verification

### `POST /api/payments/create-order`
Creates a structured payment transaction record linked to a booking.
- **Request Body**:
  ```json
  {
    "bookingId": "booking-uuid",
    "amount": 25000,
    "currency": "INR",
    "paymentType": "REGISTRATION_DEPOSIT"
  }
  ```

### `POST /api/payments/verify`
Simulated sandbox webhook/callback verification. Updates payment status to `SUCCESS`, marks booking as `PARTIALLY_PAID` or `CONFIRMED`, and assigns receipt reference `REC-2027-XXXX`.

---

## 6. Administrative Management APIs (Protected by JWT & RBAC)

All endpoints below require:
`Authorization: Bearer <ADMIN_OR_STAFF_TOKEN>`

| Endpoint | Method | Allowed Roles | Description |
|---|---|---|---|
| `/api/admin/dashboard-stats` | GET | `ADMIN`, `SUPER_ADMIN`, `FINANCE` | Live revenue, bookings, capacity metrics |
| `/api/admin/departures` | GET | ALL Admin | List all departure batches with passenger counts |
| `/api/admin/departures/:id` | PUT | `ADMIN`, `SUPER_ADMIN` | Update batch capacity, status, or notes |
| `/api/admin/bookings` | GET | ALL Admin | Query and filter all pilgrimage bookings |
| `/api/admin/bookings/:id/status` | PUT | `ADMIN`, `TRAVEL_OPS` | Update booking status (`PENDING`, `CONFIRMED`, `CANCELLED`) |
| `/api/admin/documents` | GET | `ADMIN`, `TRAVEL_OPS` | Review submitted pilgrim passports and medical certs |
| `/api/admin/documents/:id/verify` | PUT | `ADMIN`, `TRAVEL_OPS` | Approve or reject documents with reason |
| `/api/admin/refunds` | GET | `ADMIN`, `FINANCE`, `SUPER_ADMIN` | List all cancellation refund requests |
| `/api/admin/refunds/:id/status` | PUT | `FINANCE`, `SUPER_ADMIN` | Approve and mark refunds as disbursed |
| `/api/admin/enquiries` | GET | ALL Admin | CRM list of devotee leads and questions |
| `/api/admin/enquiries/:id/status` | PUT | `SUPPORT`, `ADMIN` | Update enquiry CRM status and notes |
| `/api/admin/pricing` | GET | `ADMIN`, `FINANCE` | View current pricing tiers |
| `/api/admin/pricing/:id` | PUT | `FINANCE`, `SUPER_ADMIN` | Modify commercial pricing and GST rates |
| `/api/admin/audit-logs` | GET | `SUPER_ADMIN`, `ADMIN` | Immutable security audit trail of all actions |
| `/api/admin/members/export/csv` | GET | `ADMIN`, `SUPER_ADMIN` | Export registered member directory to CSV |
