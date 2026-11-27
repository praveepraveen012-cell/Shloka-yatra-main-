-- ============================================================================
-- SHLOKA YATRA 2027 — PRODUCTION POSTGRESQL SCHEMA DDL
-- Database Version: PostgreSQL 15 / 16 (AWS RDS PostgreSQL Multi-AZ)
-- Generated for Production Deployment
-- ============================================================================

-- Enable UUID extension if needed
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Drop existing tables in reverse foreign key order if re-initializing
DROP TABLE IF EXISTS "DocumentReview" CASCADE;
DROP TABLE IF EXISTS "DocumentSubmission" CASCADE;
DROP TABLE IF EXISTS "DocumentTemplate" CASCADE;
DROP TABLE IF EXISTS "BookingNote" CASCADE;
DROP TABLE IF EXISTS "WhatsAppMessage" CASCADE;
DROP TABLE IF EXISTS "MemberOtp" CASCADE;
DROP TABLE IF EXISTS "ConsentRecord" CASCADE;
DROP TABLE IF EXISTS "UploadedDocument" CASCADE;
DROP TABLE IF EXISTS "Refund" CASCADE;
DROP TABLE IF EXISTS "Payment" CASCADE;
DROP TABLE IF EXISTS "Traveller" CASCADE;
DROP TABLE IF EXISTS "Booking" CASCADE;
DROP TABLE IF EXISTS "PricingTier" CASCADE;
DROP TABLE IF EXISTS "Route" CASCADE;
DROP TABLE IF EXISTS "Departure" CASCADE;
DROP TABLE IF EXISTS "AuditLog" CASCADE;
DROP TABLE IF EXISTS "GalleryItem" CASCADE;
DROP TABLE IF EXISTS "Faq" CASCADE;
DROP TABLE IF EXISTS "Enquiry" CASCADE;
DROP TABLE IF EXISTS "SupportTicket" CASCADE;
DROP TABLE IF EXISTS "LegalDocument" CASCADE;
DROP TABLE IF EXISTS "Member" CASCADE;
DROP TABLE IF EXISTS "User" CASCADE;

-- 1. User (Administrative Staff - Single Role: SUPER_ADMIN)
CREATE TABLE "User" (
    "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "email" TEXT NOT NULL UNIQUE,
    "passwordHash" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT,
    "role" TEXT NOT NULL DEFAULT 'SUPER_ADMIN',
    "clerkId" TEXT UNIQUE,
    "mustChangePassword" BOOLEAN NOT NULL DEFAULT false,
    "resetPasswordToken" TEXT,
    "resetPasswordExpires" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX "idx_user_email" ON "User"("email");
CREATE INDEX "idx_user_role" ON "User"("role");

-- 2. Member (Devotee / Pilgrim Sangha Accounts)
CREATE TABLE "Member" (
    "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "clerkId" TEXT UNIQUE,
    "membershipReference" TEXT NOT NULL UNIQUE,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL UNIQUE,
    "mobile" TEXT,
    "countryCode" TEXT NOT NULL DEFAULT '+91',
    "gender" TEXT,
    "whatsapp" TEXT,
    "avatarUrl" TEXT,
    "dateOfBirth" TEXT,
    "nationality" TEXT NOT NULL DEFAULT 'Indian',
    "country" TEXT NOT NULL DEFAULT 'India',
    "state" TEXT NOT NULL DEFAULT 'Delhi',
    "city" TEXT NOT NULL DEFAULT 'New Delhi',
    "passwordHash" TEXT DEFAULT 'CLERK_MANAGED',
    "membershipType" TEXT NOT NULL DEFAULT 'STANDARD',
    "yatraInterest" TEXT,
    "preferredBatch" TEXT,
    "preferredPackage" TEXT,
    "travellersCount" INTEGER DEFAULT 1,
    "sourceDiscovery" TEXT,
    "marketingConsent" BOOLEAN NOT NULL DEFAULT false,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "verifiedAt" TIMESTAMP(3),
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "internalNotes" TEXT,
    "lastLoginAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX "idx_member_email" ON "Member"("email");
CREATE INDEX "idx_member_mobile" ON "Member"("mobile");
CREATE INDEX "idx_member_ref" ON "Member"("membershipReference");

-- 3. MemberOtp (Mobile OTP Verification)
CREATE TABLE "MemberOtp" (
    "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "memberId" TEXT REFERENCES "Member"("id") ON DELETE CASCADE,
    "mobile" TEXT NOT NULL,
    "email" TEXT,
    "otpHash" TEXT NOT NULL,
    "purpose" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "maxAttempts" INTEGER NOT NULL DEFAULT 5,
    "isUsed" BOOLEAN NOT NULL DEFAULT false,
    "usedAt" TIMESTAMP(3),
    "reqIp" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX "idx_memberotp_mobile" ON "MemberOtp"("mobile");
CREATE INDEX "idx_memberotp_expires" ON "MemberOtp"("expiresAt");

-- 4. Departure (2027 Pilgrimage Batches)
CREATE TABLE "Departure" (
    "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "batchNumber" INTEGER NOT NULL UNIQUE,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL UNIQUE,
    "arrivalDate" TIMESTAMP(3) NOT NULL,
    "departureDate" TIMESTAMP(3) NOT NULL,
    "totalDays" INTEGER NOT NULL,
    "isFullMoon" BOOLEAN NOT NULL DEFAULT false,
    "totalCapacity" INTEGER NOT NULL DEFAULT 25,
    "bookedSeats" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'AVAILABLE',
    "description" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX "idx_departure_slug" ON "Departure"("slug");
CREATE INDEX "idx_departure_dates" ON "Departure"("arrivalDate", "departureDate");

-- 5. Route (Travel Routes: Bus Both Ways, Flight Lhasa, Flight Lhasa & Ali)
CREATE TABLE "Route" (
    "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "routeNumber" INTEGER NOT NULL UNIQUE,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL UNIQUE,
    "approachType" TEXT NOT NULL,
    "titleTag" TEXT NOT NULL,
    "durationDays" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "highlights" TEXT NOT NULL,
    "itinerary" TEXT NOT NULL,
    "startingFromInr" INTEGER NOT NULL,
    "image" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX "idx_route_code" ON "Route"("code");

-- 6. PricingTier (Nationality Pricing Matrix)
CREATE TABLE "PricingTier" (
    "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "routeId" TEXT NOT NULL REFERENCES "Route"("id") ON DELETE CASCADE,
    "passportType" TEXT NOT NULL,
    "basePrice" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'INR',
    "gstPercentage" DOUBLE PRECISION NOT NULL DEFAULT 5.0,
    "foreignAirfareSupplement" INTEGER NOT NULL DEFAULT 0,
    "depositRequired" INTEGER NOT NULL DEFAULT 25000,
    "termsNotes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX "idx_pricing_route_passport" ON "PricingTier"("routeId", "passportType");

-- 7. Booking (Pilgrimage Reservations)
CREATE TABLE "Booking" (
    "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "bookingReference" TEXT NOT NULL UNIQUE,
    "departureId" TEXT NOT NULL REFERENCES "Departure"("id") ON DELETE RESTRICT,
    "routeId" TEXT NOT NULL REFERENCES "Route"("id") ON DELETE RESTRICT,
    "passportType" TEXT NOT NULL,
    "contactName" TEXT NOT NULL,
    "contactEmail" TEXT NOT NULL,
    "contactPhone" TEXT NOT NULL,
    "totalTravellers" INTEGER NOT NULL DEFAULT 1,
    "baseAmount" INTEGER NOT NULL,
    "gstAmount" INTEGER NOT NULL,
    "supplementAmount" INTEGER NOT NULL DEFAULT 0,
    "totalAmount" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'INR',
    "status" TEXT NOT NULL DEFAULT 'PENDING_CONFIRMATION',
    "paymentStatus" TEXT NOT NULL DEFAULT 'UNPAID',
    "paymentMethod" TEXT DEFAULT 'ONLINE',
    "offlinePaymentVerifiedAt" TIMESTAMP(3),
    "offlinePaymentVerifiedBy" TEXT,
    "offlinePaymentRejectionReason" TEXT,
    "paymentDeadlineDate" TIMESTAMP(3),
    "cancellationReason" TEXT,
    "cancelledAt" TIMESTAMP(3),
    "refundAmount" INTEGER,
    "termsAcceptedVersion" TEXT,
    "notes" TEXT,
    "internalNotes" TEXT,
    "memberId" TEXT REFERENCES "Member"("id") ON DELETE SET NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX "idx_booking_ref" ON "Booking"("bookingReference");
CREATE INDEX "idx_booking_member" ON "Booking"("memberId");
CREATE INDEX "idx_booking_status" ON "Booking"("status");
CREATE INDEX "idx_booking_payment_status" ON "Booking"("paymentStatus");

-- 8. Traveller (Individual Yatris per Booking)
CREATE TABLE "Traveller" (
    "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "bookingId" TEXT NOT NULL REFERENCES "Booking"("id") ON DELETE CASCADE,
    "fullName" TEXT NOT NULL,
    "dateOfBirth" TEXT,
    "passportNumber" TEXT NOT NULL,
    "passportExpiryDate" TEXT,
    "nationality" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "gender" TEXT NOT NULL,
    "address" TEXT,
    "medicalConditions" TEXT,
    "allergies" TEXT,
    "medications" TEXT,
    "medicalFitnessCertified" BOOLEAN NOT NULL DEFAULT false,
    "insuranceProvider" TEXT,
    "insurancePolicyNumber" TEXT,
    "dietaryPreference" TEXT NOT NULL DEFAULT 'PURE_VEGETARIAN',
    "emergencyContactName" TEXT NOT NULL,
    "emergencyContactRelationship" TEXT,
    "emergencyContactPhone" TEXT NOT NULL,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "docVerificationStatus" TEXT NOT NULL DEFAULT 'PENDING',
    "rejectionReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX "idx_traveller_booking" ON "Traveller"("bookingId");

-- 9. Payment (Financial Ledgers)
CREATE TABLE "Payment" (
    "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "bookingId" TEXT NOT NULL REFERENCES "Booking"("id") ON DELETE CASCADE,
    "transactionId" TEXT NOT NULL UNIQUE,
    "paymentMethod" TEXT NOT NULL DEFAULT 'MOCK_GATEWAY',
    "paymentMode" TEXT,
    "installmentType" TEXT NOT NULL DEFAULT 'REGISTRATION',
    "receiptNumber" TEXT UNIQUE,
    "referenceNumber" TEXT,
    "recordedBy" TEXT,
    "adminNotes" TEXT,
    "amount" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'INR',
    "status" TEXT NOT NULL DEFAULT 'SUCCESS',
    "gatewayResponse" TEXT,
    "webhookVerified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX "idx_payment_booking" ON "Payment"("bookingId");
CREATE INDEX "idx_payment_txn" ON "Payment"("transactionId");

-- 10. Refund (Cancellation Auditing)
CREATE TABLE "Refund" (
    "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "bookingId" TEXT NOT NULL REFERENCES "Booking"("id") ON DELETE CASCADE,
    "refundReference" TEXT NOT NULL UNIQUE,
    "cancellationReason" TEXT NOT NULL,
    "noticeDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "daysBeforeDeparture" INTEGER NOT NULL,
    "packageBasePrice" INTEGER NOT NULL,
    "totalPaid" INTEGER NOT NULL,
    "cancellationChargeRate" DOUBLE PRECISION NOT NULL,
    "cancellationChargeAmount" INTEGER NOT NULL,
    "taxRefundAmount" INTEGER NOT NULL DEFAULT 0,
    "netRefundAmount" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "approvedBy" TEXT,
    "approvedAt" TIMESTAMP(3),
    "processedAt" TIMESTAMP(3),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX "idx_refund_booking" ON "Refund"("bookingId");

-- 11. UploadedDocument (Identity, Passport & Health Proofs)
CREATE TABLE "UploadedDocument" (
    "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "bookingId" TEXT NOT NULL REFERENCES "Booking"("id") ON DELETE CASCADE,
    "travellerId" TEXT REFERENCES "Traveller"("id") ON DELETE SET NULL,
    "documentType" TEXT NOT NULL,
    "originalFilename" TEXT NOT NULL,
    "filePath" TEXT NOT NULL,
    "fileSizeBytes" INTEGER NOT NULL,
    "mimeType" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "rejectionReason" TEXT,
    "verifiedBy" TEXT,
    "verifiedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX "idx_uploadeddoc_booking" ON "UploadedDocument"("bookingId");

-- 12. ConsentRecord (Statutory Legal Consents)
CREATE TABLE "ConsentRecord" (
    "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "bookingId" TEXT NOT NULL REFERENCES "Booking"("id") ON DELETE CASCADE,
    "userId" TEXT,
    "termsAccepted" BOOLEAN NOT NULL DEFAULT false,
    "termsVersion" TEXT NOT NULL DEFAULT 'DRAFT-V1.0-NOV-2026',
    "cancellationAccepted" BOOLEAN NOT NULL DEFAULT false,
    "cancellationVersion" TEXT NOT NULL DEFAULT 'DRAFT-V1.0-NOV-2026',
    "scheduleAccepted" BOOLEAN NOT NULL DEFAULT false,
    "scheduleVersion" TEXT NOT NULL DEFAULT '2027-V1.0',
    "riskAcknowledged" BOOLEAN NOT NULL DEFAULT false,
    "riskVersion" TEXT NOT NULL DEFAULT 'DRAFT-V1.0-NOV-2026',
    "privacyConsent" BOOLEAN NOT NULL DEFAULT false,
    "marketingConsent" BOOLEAN NOT NULL DEFAULT false,
    "publicityConsent" BOOLEAN NOT NULL DEFAULT false,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "acceptedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX "idx_consent_booking" ON "ConsentRecord"("bookingId");

-- 13. LegalDocument (Published Legal Contracts)
CREATE TABLE "LegalDocument" (
    "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "slug" TEXT NOT NULL UNIQUE,
    "title" TEXT NOT NULL,
    "version" TEXT NOT NULL DEFAULT 'DRAFT-V1.0',
    "effectiveDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL DEFAULT 'PUBLISHED',
    "isApproved" BOOLEAN NOT NULL DEFAULT true,
    "contentMarkdown" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX "idx_legaldoc_slug" ON "LegalDocument"("slug");

-- 14. SupportTicket (Customer Inquiries)
CREATE TABLE "SupportTicket" (
    "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "userId" TEXT,
    "bookingId" TEXT,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'OPEN',
    "priority" TEXT NOT NULL DEFAULT 'NORMAL',
    "adminNotes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 15. Enquiry (Public Lead Inquiries)
CREATE TABLE "Enquiry" (
    "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "preferredBatch" TEXT,
    "preferredRoute" TEXT,
    "travellersCount" INTEGER DEFAULT 1,
    "message" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'NEW',
    "assignedTo" TEXT,
    "internalNotes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 16. Faq (Frequently Asked Questions)
CREATE TABLE "Faq" (
    "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "category" TEXT NOT NULL DEFAULT 'GENERAL',
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 17. GalleryItem (Pilgrimage High-Res Photos)
CREATE TABLE "GalleryItem" (
    "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "title" TEXT NOT NULL,
    "category" TEXT NOT NULL DEFAULT 'KAILASH',
    "imageUrl" TEXT NOT NULL,
    "thumbnailUrl" TEXT,
    "caption" TEXT,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 18. AuditLog (Immutable Administrative Audit Trail)
CREATE TABLE "AuditLog" (
    "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "userId" TEXT REFERENCES "User"("id") ON DELETE SET NULL,
    "userEmail" TEXT,
    "action" TEXT NOT NULL,
    "entity" TEXT NOT NULL,
    "entityId" TEXT,
    "details" TEXT,
    "ipAddress" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX "idx_auditlog_user" ON "AuditLog"("userId");
CREATE INDEX "idx_auditlog_action" ON "AuditLog"("action");

-- 19. WhatsAppMessage (Devotee Notifications)
CREATE TABLE "WhatsAppMessage" (
    "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "bookingId" TEXT REFERENCES "Booking"("id") ON DELETE SET NULL,
    "recipientPhone" TEXT NOT NULL,
    "recipientName" TEXT NOT NULL,
    "templateKey" TEXT,
    "messageContent" TEXT NOT NULL,
    "sentBy" TEXT,
    "providerMsgId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'SENT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 20. BookingNote (Admin Internal Notes)
CREATE TABLE "BookingNote" (
    "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "bookingId" TEXT NOT NULL REFERENCES "Booking"("id") ON DELETE CASCADE,
    "authorEmail" TEXT NOT NULL,
    "authorName" TEXT,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 21. DocumentTemplate (Statutory Compliance Templates)
CREATE TABLE "DocumentTemplate" (
    "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "documentRef" TEXT NOT NULL UNIQUE,
    "title" TEXT NOT NULL,
    "category" TEXT NOT NULL DEFAULT 'COMPLIANCE',
    "version" TEXT NOT NULL DEFAULT 'Draft 1.0 – 23 November 2026',
    "lifecycleStatus" TEXT NOT NULL DEFAULT 'DRAFT',
    "effectiveDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isApproved" BOOLEAN NOT NULL DEFAULT false,
    "templateFilePath" TEXT,
    "description" TEXT,
    "clausesCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 22. DocumentSubmission (Digital Signature Submissions)
CREATE TABLE "DocumentSubmission" (
    "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "bookingId" TEXT NOT NULL REFERENCES "Booking"("id") ON DELETE CASCADE,
    "travellerId" TEXT REFERENCES "Traveller"("id") ON DELETE SET NULL,
    "memberId" TEXT REFERENCES "Member"("id") ON DELETE SET NULL,
    "documentTemplateId" TEXT REFERENCES "DocumentTemplate"("id") ON DELETE SET NULL,
    "documentRef" TEXT NOT NULL,
    "documentTitle" TEXT NOT NULL DEFAULT 'Compliance Document',
    "version" TEXT NOT NULL DEFAULT 'Draft 1.0 – 23 November 2026',
    "submissionType" TEXT NOT NULL DEFAULT 'DIGITAL_FORM',
    "status" TEXT NOT NULL DEFAULT 'PENDING_SUBMISSION',
    "originalFilename" TEXT,
    "filePath" TEXT,
    "fileSizeBytes" INTEGER,
    "mimeType" TEXT,
    "formData" TEXT,
    "pageInitials" TEXT,
    "acknowledgements" TEXT,
    "signerName" TEXT,
    "signerRelationship" TEXT,
    "signatureDate" TEXT,
    "signaturePlace" TEXT,
    "signatureType" TEXT,
    "signatureData" TEXT,
    "witnessName" TEXT,
    "witnessPhone" TEXT,
    "witnessSignature" TEXT,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "submittedAt" TIMESTAMP(3),
    "isCurrentVersion" BOOLEAN NOT NULL DEFAULT true,
    "replacedSubmissionId" TEXT,
    "versionNumber" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX "idx_docsubmission_booking" ON "DocumentSubmission"("bookingId");

-- 23. DocumentReview (Admin Medical & Compliance Review)
CREATE TABLE "DocumentReview" (
    "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "submissionId" TEXT NOT NULL REFERENCES "DocumentSubmission"("id") ON DELETE CASCADE,
    "reviewerEmail" TEXT NOT NULL,
    "reviewerName" TEXT,
    "previousStatus" TEXT NOT NULL,
    "newStatus" TEXT NOT NULL,
    "reviewNote" TEXT,
    "internalNotes" TEXT,
    "clinicalObservation" TEXT,
    "reviewedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX "idx_docreview_submission" ON "DocumentReview"("submissionId");

-- ============================================================================
-- END OF SCHEMA DDL
-- ============================================================================
