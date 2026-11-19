# Shlloka Yatra 2027 — Database Architecture & Schema Documentation

This document describes the relational database architecture, entity relationships, constraints, and migration strategies for the **Shlloka Yatra Private Limited – Kailash Mansarovar Parikrama Yatra 2027** platform.

---

## 1. Architecture Overview

- **ORM**: Prisma ORM (`v5.22.0`)
- **Development & Test Engine**: SQLite (`prisma/dev.db`) for immediate, zero-configuration local execution and 100% reliable automated unit testing.
- **Production Engine**: PostgreSQL 15+ (`prisma/schema.postgresql.prisma`) for high-concurrency cloud deployments (e.g. AWS RDS, Google Cloud SQL, Railway, Supabase).
- **Client Output**: Generated into `server/node_modules/.prisma/client`.

```mermaid
erDiagram
    User ||--o{ AuditLog : creates
    User ||--o{ Booking : manages
    Departure ||--o{ Booking : reserves
    Route ||--o{ Departure : schedules
    Route ||--o{ PricingTier : defines
    Booking ||--o{ Traveller : contains
    Booking ||--o{ Payment : records
    Booking ||--o{ Refund : processes
    Booking ||--o{ UploadedDocument : stores
    Booking ||--o{ ConsentRecord : logs
    Traveller ||--o{ UploadedDocument : attaches
    Booking ||--o{ SupportTicket : links
```

---

## 2. Core Entities & Schema Reference

### `User` (Administrative RBAC & Staff)
- `id`: UUID (Primary Key)
- `email`: String (Unique)
- `name`: String
- `password`: String (Bcrypt salted hash)
- `role`: Enum (`SUPER_ADMIN`, `ADMIN`, `TRAVEL_OPS`, `FINANCE`, `SUPPORT`, `PARTICIPANT`)
- `isActive`: Boolean
- `createdAt`, `updatedAt`: Timestamps

### `Departure` (2027 Batches)
- `id`: UUID (Primary Key)
- `batchNumber`: Integer (1 through 8)
- `name`: String (e.g., "May Batch", "June II Batch — Full Moon")
- `slug`: String (Unique)
- `arrivalDate`: DateTime (Kathmandu arrival)
- `departureDate`: DateTime (Final departure)
- `totalDays`: Integer (14 to 16 days)
- `isFullMoon`: Boolean (Flags Sagar Dawa / Full Moon batches)
- `totalCapacity`: Integer (Configured seat limit, default: 25)
- `bookedSeats`: Integer (Live counter decremented/incremented during reservations)
- `status`: Enum (`AVAILABLE`, `FAST_FILLING`, `SOLD_OUT`)
- `description`, `notes`: Text

### `Route` (The 3 Pilgrimage Travel Options)
- `id`: UUID (Primary Key)
- `routeNumber`: Integer (1, 2, or 3)
- `name`: String (e.g., "Option 1 — Bus Both Ways")
- `code`: String (Unique: `bus-both-ways`, `flight-to-lhasa`, `lhasa-ali-pulan`)
- `durationDays`: Integer (13 to 15 days)
- `travelMode`: String ("Overland Tourist Coach", "Flight + Overland Coach", "Domestic Flight + SUV")
- `highlights`: JSON (Array of key pilgrimage stops)
- `itinerary`: JSON (Complete day-by-day itinerary with altitudes)
- `inclusions`, `exclusions`: JSON

### `PricingTier`
- `id`: UUID (Primary Key)
- `routeId`: Foreign Key -> `Route`
- `passportType`: Enum (`INDIAN`, `FOREIGN`)
- `basePrice`: Float (₹3,50,000 / ₹4,37,000 / ₹4,94,000 for Indian; ₹4,25,000 for Foreign)
- `gstPercentage`: Float (5.0 for Indian passport, 0 for Foreign)
- `currency`: String ("INR")
- `foreignAirfareSupplementUsd`: Float ($0, $600, or $1,200)

### `Booking` (Central Reservation Transaction)
- `id`: UUID (Primary Key)
- `bookingReference`: String (Unique, e.g., `SKY-2027-1001`)
- `departureId`: Foreign Key -> `Departure`
- `routeId`: Foreign Key -> `Route`
- `passportType`: Enum (`INDIAN`, `FOREIGN`)
- `contactName`, `contactEmail`, `contactPhone`: Strings
- `totalTravellers`: Integer
- `baseAmount`: Float
- `gstAmount`: Float
- `totalAmount`: Float
- `status`: Enum (`PENDING`, `CONFIRMED`, `CANCELLED`, `COMPLETED`)
- `paymentStatus`: Enum (`UNPAID`, `PARTIALLY_PAID`, `PAID`, `REFUNDED`)
- `notes`: Text (Includes devotee permanent street address)
- `createdAt`, `updatedAt`: Timestamps

### `Traveller` (Pilgrim Roster Member)
- `id`: UUID (Primary Key)
- `bookingId`: Foreign Key -> `Booking`
- `fullName`: String (Exact passport name)
- `passportNumber`: String
- `nationality`: String
- `age`: Integer
- `gender`: Enum (`MALE`, `FEMALE`, `OTHER`)
- `dietaryPreference`: String (Default: `PURE_VEGETARIAN`)
- `medicalConditions`: Text
- `emergencyContactName`, `emergencyContactPhone`: Strings

### `ConsentRecord` (Annex B Contractual Acceptance Audit Log)
- `id`: UUID (Primary Key)
- `bookingId`: Foreign Key -> `Booking`
- `documentSlug`: String ("contract-package-2027")
- `documentVersion`: String ("DRAFT V1.0 — FOR LEGAL AND MANAGEMENT APPROVAL | 12 November 2026")
- `consentedToMasterTerms`: Boolean
- `consentedToCancellationPolicy`: Boolean
- `consentedToRiskNotice`: Boolean
- `consentedToServiceSchedule`: Boolean
- `consentedToPrivacyNotice`: Boolean
- `consentMarketingOptional`: Boolean (Optional)
- `consentMediaOptional`: Boolean (Optional)
- `ipAddress`: String
- `userAgent`: Text
- `timestamp`: DateTime

### `UploadedDocument` (Devotee Document Vault)
- `id`: UUID (Primary Key)
- `bookingId`: Foreign Key -> `Booking`
- `travellerId`: Foreign Key -> `Traveller` (Nullable)
- `documentType`: Enum (`PASSPORT`, `PHOTO`, `MEDICAL_FITNESS`, `INSURANCE`, `OTHER`)
- `originalFilename`: String
- `fileUrl`: String (Protected path)
- `fileSize`: Integer
- `verificationStatus`: Enum (`PENDING`, `VERIFIED`, `REJECTED`)
- `rejectionReason`: Text (Optional)

### `Payment` & `Refund`
- `Payment`: Gateway order id, payment id, amount, currency, status (`INITIATED`, `SUCCESS`, `FAILED`), receipt number (`REC-2027-XXXX`), and method.
- `Refund`: Linked to booking, requested amount, cancellation charge, reason, status (`PENDING`, `APPROVED`, `PROCESSED`, `REJECTED`), and processing notes.

### `AuditLog`
- Immutable audit trail capturing user ID, user email, IP address, timestamp, action, entity, entity ID, and previous/updated state JSON.

---

## 3. Database Migration & Seeding Instructions

### Local SQLite (Zero configuration):
```bash
# Push schema changes to SQLite
npx prisma db push --schema=prisma/schema.prisma

# Generate Prisma Client
npx prisma generate --schema=prisma/schema.prisma

# Seed initial database
node server/src/seed.js
```

### Production PostgreSQL Deployment:
```bash
# Set DATABASE_URL in server/.env
DATABASE_URL="postgresql://user:password@localhost:5432/shlloka_yatra_2027?schema=public"

# Generate PostgreSQL client
npx prisma generate --schema=prisma/schema.postgresql.prisma

# Execute migrations
npx prisma migrate deploy --schema=prisma/schema.postgresql.prisma

# Seed production database
node server/src/seed.js
```
