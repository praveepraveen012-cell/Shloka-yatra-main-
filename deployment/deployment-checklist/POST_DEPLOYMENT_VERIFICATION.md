# Shloka Yatra 2027 — Post-Deployment Verification (Smoke Tests)

Execute the following verification suite immediately following production deployment to confirm system health and business transaction capabilities.

---

## 1. Automated Health & API Probes

Run these HTTP requests against the live production endpoints:

### 1.1 Backend Health Check
```bash
curl -i https://api.shllokayatra.com/api/health
```
- **Expected Status**: `200 OK`
- **Expected Body**: `{"status":"ok","timestamp":"...","environment":"production"}`

### 1.2 Public Departures API
```bash
curl -i https://api.shllokayatra.com/api/departures
```
- **Expected Status**: `200 OK`
- **Verification**: Exactly 8 departures returned for 2027 season (`May Batch` through `August II Batch`).

### 1.3 Travel Routes API
```bash
curl -i https://api.shllokayatra.com/api/routes
```
- **Expected Status**: `200 OK`
- **Verification**: 3 routes returned (`bus-both-ways`, `flight-to-lhasa`, `lhasa-ali-pulan`) with pricing tiers.

### 1.4 CORS Header Verification
```bash
curl -i -X OPTIONS https://api.shllokayatra.com/api/health \
  -H "Origin: https://shllokayatra.com" \
  -H "Access-Control-Request-Method: GET"
```
- **Expected Header**: `Access-Control-Allow-Origin: https://shllokayatra.com`

---

## 2. Frontend Web Application Probes

1. **Homepage Loading**:
   - Navigate to `https://shllokayatra.com`.
   - Verify HTTPS certificate is valid (green padlock, TLS 1.3).
   - Confirm all pilgrimage hero images, pricing cards, and itineraries render without 404 broken assets.
2. **SPA Client Routing**:
   - Directly navigate to `https://shllokayatra.com/book`.
   - Verify page loads correctly without 403 or 404 errors (verifying CloudFront SPA error rewriting).
   - Directly navigate to `https://shllokayatra.com/admin/login`.
   - Verify Admin login card renders cleanly.

---

## 3. End-to-End Workflow Verification

### Scenario A: Super Admin Authentication & Dashboard
1. Navigate to `https://shllokayatra.com/admin/login`.
2. Authenticate using Super Admin credentials (`admin@shloka.com`).
3. Verify successful redirect to `/admin/dashboard`.
4. Confirm Dashboard KPI counters reflect genuine database state:
   - Bookings counter: `0` (or genuine devotee counts)
   - Zero demo records present in Bookings, Members, or Inquiries.
5. Confirm role badge displays `SUPER_ADMIN`.
6. Confirm Staff Management section is **absent** from the navigation sidebar.

### Scenario B: Devotee Registration & Mobile OTP
1. Navigate to `https://shllokayatra.com/register`.
2. Submit test devotee registration form with real test phone number.
3. Confirm SMS OTP delivery or mock OTP prompt in development/staging.
4. Verify account creation and automatic login session initiation.

### Scenario C: Complete 8-Step Pilgrimage Booking
1. Proceed through booking steps 1 through 8:
   - Step 1: Package Selection (Route Option 1, 2, or 3)
   - Step 2: Departure Batch (select May Batch 2027)
   - Step 3: Contact & Primary Devotee Information
   - Step 4: Yatri Details & Passport
   - Step 5: Medical Fitness & Altitude Assessment
   - Step 6: Identity & Passport Proof Upload
   - Step 7: Statutory Consents (Master Terms, Risk & Indemnity)
   - Step 8: Payment Gateway Integration
2. Authorize payment (via production payment gateway or test sandbox).
3. Confirm instant generation of unique booking reference (`SHY-2027-XXXXXX`).
4. Log in to Super Admin Portal and confirm booking appears instantly under **Bookings & Yatris**.

---

## 4. Verification Sign-Off

| Verification Item | Status | Verified By | Timestamp |
| :--- | :--- | :--- | :--- |
| Health API Check | [ ] PASS / [ ] FAIL | | |
| CloudFront SSL & Assets | [ ] PASS / [ ] FAIL | | |
| Super Admin Login | [ ] PASS / [ ] FAIL | | |
| Zero Demo Data Verified | [ ] PASS / [ ] FAIL | | |
| Live Booking Creation | [ ] PASS / [ ] FAIL | | |
| Database Transaction Lock | [ ] PASS / [ ] FAIL | | |
