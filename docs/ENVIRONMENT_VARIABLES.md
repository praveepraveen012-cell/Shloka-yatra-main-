# Shloka Yatra 2027 — Environment Variables Reference

This document catalogs every environment variable required by the Shloka Yatra 2027 application.

> [!IMPORTANT]
> This reference contains variable **names, descriptions, and scopes only**. Real production passwords, API tokens, encryption keys, and connection strings must **never** be committed to version control. Store production secrets securely in AWS Systems Manager Parameter Store or AWS Secrets Manager.

---

## 1. Frontend Environment Variables (`client/.env`)

These variables are prefixed with `VITE_` and are baked into the compiled client bundle at build time. They are public to any browser client.

| Variable Name | Scope | Required | Description | Example / Format |
|---|---|---|---|---|
| `VITE_API_BASE_URL` | Public Client | **Yes (Prod)** | Full HTTPS URL pointing to the backend REST API. If empty in dev, defaults to `/api`. | `https://api.shloka.com/api` |
| `BASE_PATH` | Public Client | Optional | Subpath prefix for hosting in non-root directories (e.g. GitHub Pages). Default: `/`. | `/Shloka-yatra-main-/` or `/` |
| `VITE_SITE_URL` | Public Client | Optional | Canonical public site origin used for metadata and redirects. | `https://shloka.com` |
| `VITE_CLERK_PUBLISHABLE_KEY` | Public Client | Optional | Public publishable key for Clerk Devotee Social Login. | `pk_test_...` or `pk_live_...` |
| `VITE_ENABLE_OFFLINE_TEST_PAYMENT` | Public Client | Optional | Feature flag controlling visibility of test payment option in UI. Set `false` in production. | `false` |

---

## 2. Backend Server Variables (`server/.env`)

These variables are strictly private and reside only on the backend host or container runtime.

### A. Core Server & Security
| Variable Name | Scope | Required | Description |
|---|---|---|---|
| `PORT` | Secret Server | Yes | TCP port on which the Express application listens (Default: `5000`). |
| `NODE_ENV` | Secret Server | Yes | Environment mode (`development`, `test`, or `production`). |
| `CORS_ORIGIN` | Secret Server | Yes | Comma-separated list of whitelisted frontend origins permitted to make credentialed requests. |
| `DATABASE_URL` | Secret Server | Yes | Primary Prisma database connection string (SQLite file path or PostgreSQL URL). |
| `DATABASE_URL_TEST` | Secret Server | Optional | Isolated test database connection string used during automated test runs. |
| `JWT_SECRET` | Secret Server | Yes | High-entropy 64-character secret key used to sign and verify JWT authentication tokens. |
| `JWT_EXPIRES_IN` | Secret Server | Yes | Lifetime duration of devotee and admin JWT session tokens (e.g. `7d`, `24h`). |
| `ADMIN_DEFAULT_EMAIL` | Secret Server | Yes | Master email address for initial bootstrap Super Admin account. |
| `ADMIN_DEFAULT_PASSWORD` | Secret Server | Yes | Temporary bootstrap password for initial Super Admin setup. |
| `ENABLE_OFFLINE_TEST_PAYMENT` | Secret Server | Yes | Server-side feature flag controlling whether `/api/bookings` accepts `OFFLINE_TEST` payments. |

### B. Payment Gateway (Razorpay)
| Variable Name | Scope | Required | Description |
|---|---|---|---|
| `PAYMENT_GATEWAY_MODE` | Secret Server | Yes | Operation mode: `sandbox` (test simulation) or `live` (real banking transactions). |
| `RAZORPAY_KEY_ID` | Secret Server | Prod | Authoritative merchant key identifier provided by Razorpay Dashboard. |
| `RAZORPAY_KEY_SECRET` | Secret Server | Prod | Private API secret key used to sign order creations and verify signatures. |
| `RAZORPAY_WEBHOOK_SECRET` | Secret Server | Prod | Secret token used to validate authentic incoming webhook events from Razorpay. |

### C. Email & Notifications (Transactional SMTP)
| Variable Name | Scope | Required | Description |
|---|---|---|---|
| `EMAIL_SERVICE_ENABLED` | Secret Server | Optional | Flag enabling transactional SMTP dispatch (`true` / `false`). |
| `SMTP_HOST` | Secret Server | Optional | Hostname of mail relay provider (e.g. `email-smtp.us-east-1.amazonaws.com`). |
| `SMTP_PORT` | Secret Server | Optional | TLS port for SMTP relay (`587` or `465`). |
| `SMTP_USER` | Secret Server | Optional | Username / IAM access credential for SMTP relay. |
| `SMTP_PASS` | Secret Server | Optional | Password / secret key for SMTP relay. |
| `EMAIL_FROM` | Secret Server | Optional | Standard sender address header (e.g. `"Shloka Yatra <pilgrimage@shloka.com>"`). |

### D. Social Auth & Document Storage
| Variable Name | Scope | Required | Description |
|---|---|---|---|
| `CLERK_SECRET_KEY` | Secret Server | Optional | Backend secret key used to verify Clerk OAuth session tokens. |
| `AWS_REGION` | Secret Server | Prod | AWS region hosting S3 private document buckets (e.g. `us-east-1`). |
| `S3_DOCUMENTS_BUCKET` | Secret Server | Prod | Name of private Amazon S3 bucket used to store encrypted yatri compliance files. |
