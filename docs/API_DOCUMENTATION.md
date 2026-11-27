# Shloka Yatra 2027 — REST API Documentation

## 1. Overview & Base URL

The Shloka Yatra 2027 REST API is mounted under `/api`.
* **Local Development Base URL:** `http://localhost:5000/api`
* **Production AWS Base URL:** Configured via `VITE_API_BASE_URL` (e.g. `https://api.shloka.com/api`)
* **Standard Response Format:** `application/json`
* **Authentication Scheme:** `Authorization: Bearer <JWT_TOKEN>`

---

## 2. Public & Departure Endpoints

### `GET /api/health`
* **Auth:** None
* **Response (200):**
  ```json
  {
    "status": "ok",
    "service": "Shloka Yatra Backend API",
    "timestamp": "2026-11-27T05:00:00.000Z",
    "environment": "development"
  }
  ```

### `GET /api/features`
* **Auth:** None
* **Response (200):**
  ```json
  {
    "offlineTestPayment": true,
    "paymentGatewayMode": "sandbox",
    "emailServiceEnabled": false
  }
  ```

### `GET /api/departures`
* **Auth:** None
* **Response (200):** Array of all 8 configured 2027 departure batches with capacity, booked seats, and full moon status.

### `GET /api/departures/:idOrSlug`
* **Auth:** None
* **Response (200):** Single departure batch details.

### `GET /api/routes`
* **Auth:** None
* **Response (200):** All 3 pilgrimage travel routes with pricing tiers, itineraries, and inclusions.

### `GET /api/routes/:code`
* **Auth:** None
* **Response (200):** Details for specified route (`bus-both-ways`, `flight-to-lhasa`, `lhasa-ali-pulan`).

### `POST /api/pricing/calculate`
* **Auth:** None
* **Request Body:**
  ```json
  {
    "routeId": "dba8a4d2-ac37-43f9-be3c-bba51232ed58",
    "passportType": "INDIAN",
    "travellersCount": 1
  }
  ```
* **Response (200):** Itemized price breakdown with base package subtotal, 5% statutory GST, deposit requirement, and total amount payable.

---

## 3. Devotee Membership Endpoints (`/api/membership/*`)

### `POST /api/membership/register`
* **Auth:** None
* **Request Body:**
  ```json
  {
    "firstName": "Devotee",
    "lastName": "Sharma",
    "email": "devotee@example.com",
    "mobile": "+91 98765 43210",
    "countryCode": "+91",
    "password": "Password123!",
    "confirmPassword": "Password123!",
    "nationality": "Indian",
    "country": "India",
    "acceptTerms": true,
    "acceptPrivacy": true
  }
  ```
* **Response (201):** Created member object with `membershipReference` (`SHL-MEM-2027-XXXX`) and authentication JWT token.

### `POST /api/membership/login`
* **Auth:** None
* **Request Body:**
  ```json
  {
    "identifier": "devotee@example.com",
    "password": "Password123!"
  }
  ```
* **Response (200):** Member profile and JWT bearer token.

### `GET /api/membership/me`
* **Auth:** Bearer Token (Member)
* **Response (200):** Authenticated devotee profile data.

### `PUT /api/membership/profile`
* **Auth:** Bearer Token (Member)
* **Response (200):** Updated devotee profile.

### `GET /api/membership/bookings`
* **Auth:** Bearer Token (Member)
* **Response (200):** Array of all pilgrimage bookings associated with the authenticated member.

---

## 4. Booking Endpoints (`/api/bookings/*`)

### `POST /api/bookings`
* **Auth:** None / Optional Member Token
* **Request Body:**
  ```json
  {
    "departureId": "2453cfb3-cc9c-4355-8014-8357e9eb240a",
    "routeId": "dba8a4d2-ac37-43f9-be3c-bba51232ed58",
    "passportType": "INDIAN",
    "contactName": "praveen .A",
    "contactEmail": "grexotixpraveen@gmail.com",
    "contactPhone": "+916584563275",
    "paymentMethod": "OFFLINE_TEST",
    "notes": "Address: Mumbai",
    "travellers": [
      {
        "fullName": "praveen .A",
        "passportNumber": "123456789",
        "nationality": "Indian",
        "age": 45,
        "gender": "MALE",
        "dietaryPreference": "PURE_VEGETARIAN",
        "emergencyContactName": "Contact",
        "emergencyContactPhone": "+91 98765 43210"
      }
    ]
  }
  ```
* **Response (201):**
  * `booking`: Created booking object with unique reference `SHY-2027-XXXXXX`.
  * Status: `PENDING_CONFIRMATION`
  * Payment Status: `PENDING_VERIFICATION`

### `GET /api/bookings/reference/:reference`
* **Auth:** None / Authenticated
* **Response (200):** Booking record retrieved by unique reference code.

---

## 5. Payment Endpoints (`/api/payments/*`)

### `POST /api/payments/create-order`
* **Auth:** Rate-limited
* **Request Body:** `{ "bookingId": "<UUID>", "installmentType": "DEPOSIT" }`
* **Response (200):** Razorpay order ID and transaction details.

### `POST /api/payments/verify`
* **Auth:** Rate-limited
* **Request Body:** `{ "bookingId": "<UUID>", "razorpay_order_id": "...", "razorpay_payment_id": "...", "razorpay_signature": "..." }`
* **Response (200):** Payment confirmation and receipt generation.

---

## 6. Super Admin Endpoints (`/api/admin/*`)

*All admin endpoints require `Authorization: Bearer <TOKEN>` with role `SUPER_ADMIN`.*

| Endpoint | Method | Purpose |
|---|---|---|
| `/api/auth/login` | `POST` | Super Admin sign in, returns admin JWT token. |
| `/api/admin/dashboard-stats` | `GET` | Live calculated database totals (Bookings, Devotees, Members, Revenue). |
| `/api/admin/bookings` | `GET` | Search and filter all pilgrimage bookings. |
| `/api/admin/bookings/:id` | `GET` | Comprehensive booking detail view with financial summary. |
| `/api/admin/bookings/:id/verify-offline-payment` | `PUT` | Verify offline test payment and confirm booking. |
| `/api/admin/bookings/:id/reject-offline-payment` | `PUT` | Reject offline payment with required explanation. |
| `/api/admin/members` | `GET` | List, search, and inspect registered sangha members. |
| `/api/admin/customers` | `GET` | Customer directory aggregating booking holders and members. |
| `/api/admin/payments` | `GET` | Financial transaction ledger. |
| `/api/admin/enquiries` | `GET` | Public customer enquiries and CRM leads. |
| `/api/admin/audit-logs` | `GET` | Immutable audit trail of privileged administrative operations. |

---

## 7. Error Handling & HTTP Status Codes

* **`400 Bad Request`:** Zod schema validation failed (e.g. invalid email, traveller age < 12, missing fields).
* **`401 Unauthorized`:** Token missing, expired, or invalid credentials.
* **`403 Forbidden`:** Insufficient privileges (e.g. member calling admin endpoint, or offline test payments disabled in production).
* **`404 Not Found`:** Requested resource, batch, or endpoint does not exist.
* **`405 Method Not Allowed`:** Returned if HTTP method is not supported (or if static hosting serves relative `/api` paths).
* **`429 Too Many Requests`:** Rate limiter triggered on auth/payment endpoints.
* **`500 Internal Server Error`:** Unhandled server exception with sanitized error response.
