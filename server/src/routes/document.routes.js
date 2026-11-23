import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import prisma from '../prisma.js';

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const UPLOAD_DIR = path.join(__dirname, '../../uploads/documents');
const TEMPLATES_DIR = path.join(__dirname, '../../public/templates');

if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// -------------------------------------------------------------
// Unified Authentication Middleware (Admin OR Member)
// -------------------------------------------------------------
export const authenticateUserOrMember = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Authentication required to access documents.' });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'shlloka_yatra_secure_production_secret_key_2027_kailash'
    );

    // 1. Check if Admin user
    if (decoded.userId) {
      const admin = await prisma.user.findUnique({
        where: { id: decoded.userId },
        select: { id: true, email: true, name: true, role: true },
      });
      if (admin) {
        req.user = admin;
        req.isAdmin = true;
        return next();
      }
    }

    // 2. Check if Member user
    if (decoded.memberId) {
      const member = await prisma.member.findUnique({
        where: { id: decoded.memberId },
        select: { id: true, email: true, firstName: true, lastName: true, status: true },
      });
      if (member) {
        if (member.status === 'SUSPENDED') {
          return res.status(403).json({ error: 'Membership account is suspended.' });
        }
        req.member = member;
        req.isAdmin = false;
        return next();
      }
    }

    return res.status(401).json({ error: 'Invalid or expired session. Please sign in.' });
  } catch (err) {
    return res.status(403).json({ error: 'Invalid authentication token.' });
  }
};

export const requireAdminOnly = (req, res, next) => {
  if (!req.isAdmin || !req.user) {
    return res.status(403).json({ error: 'Administrative privileges required.' });
  }
  next();
};

// -------------------------------------------------------------
// Helper: Save Base64 File to Secure Private Storage
// -------------------------------------------------------------
const saveBase64File = (base64String, originalFilename = 'document.pdf') => {
  let fileData = base64String;
  let mimeType = 'application/pdf';

  if (base64String.startsWith('data:')) {
    const matches = base64String.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (matches && matches.length === 3) {
      mimeType = matches[1];
      fileData = matches[2];
    }
  }

  const allowedMimeTypes = [
    'application/pdf',
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/jpg',
  ];

  if (!allowedMimeTypes.includes(mimeType.toLowerCase())) {
    throw new Error('Unsupported file format. Only PDF, JPEG, and PNG documents are allowed.');
  }

  const buffer = Buffer.from(fileData, 'base64');
  if (buffer.length > 15 * 1024 * 1024) {
    throw new Error('File exceeds maximum size limit of 15MB.');
  }

  const ext = mimeType === 'application/pdf' ? '.pdf' : mimeType.includes('png') ? '.png' : '.jpg';
  const safeBaseName = path.basename(originalFilename).replace(/[^a-zA-Z0-9._-]/g, '_');
  const filename = `${crypto.randomUUID()}_${safeBaseName.endsWith(ext) ? safeBaseName : safeBaseName + ext}`;
  const diskPath = path.join(UPLOAD_DIR, filename);

  fs.writeFileSync(diskPath, buffer);

  return {
    filePath: diskPath,
    originalFilename: safeBaseName,
    fileSizeBytes: buffer.length,
    mimeType,
  };
};

// -------------------------------------------------------------
// 1. GET /api/documents/templates
// Return available document templates and their version/draft lifecycle
// -------------------------------------------------------------
router.get('/templates', async (req, res, next) => {
  try {
    const templates = await prisma.documentTemplate.findMany({
      orderBy: { documentRef: 'asc' },
    });
    res.json({ templates });
  } catch (error) {
    next(error);
  }
});

// -------------------------------------------------------------
// 2. GET /api/documents/templates/:documentRef/download
// Download the official PDF form (SYPL-MED-2027 or SYPL-RISK-2027)
// -------------------------------------------------------------
router.get('/templates/:documentRef/download', async (req, res, next) => {
  try {
    const { documentRef } = req.params;
    let filename = '';

    if (documentRef.toUpperCase() === 'SYPL-MED-2027' || documentRef.toUpperCase() === 'MEDICAL') {
      filename = 'Shlloka_Yatra_2027_Medical_Fitness_Certificate.pdf';
    } else if (documentRef.toUpperCase() === 'SYPL-RISK-2027' || documentRef.toUpperCase() === 'RISK') {
      filename = 'Shlloka_Yatra_2027_Risk_Declaration_and_Indemnity.pdf';
    } else {
      return res.status(404).json({ error: 'Official template not found for reference ' + documentRef });
    }

    const filePath = path.join(TEMPLATES_DIR, filename);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'Template file is currently being prepared.' });
    }

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    fs.createReadStream(filePath).pipe(res);
  } catch (error) {
    next(error);
  }
});

// -------------------------------------------------------------
// 3. GET /api/documents/booking/:bookingId/requirements
// Returns the document compliance checklist for all participants in a booking
// -------------------------------------------------------------
router.get('/booking/:bookingId/requirements', authenticateUserOrMember, async (req, res, next) => {
  try {
    const { bookingId } = req.params;

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        travellers: true,
        departure: true,
        route: true,
        documentSubmissions: {
          where: { isCurrentVersion: true },
          include: { reviews: { orderBy: { reviewedAt: 'desc' }, take: 1 } },
        },
      },
    });

    if (!booking) {
      return res.status(404).json({ error: 'Booking record not found' });
    }

    // Access check: Member can only view their own booking
    if (!req.isAdmin) {
      const isOwner =
        booking.memberId === req.member?.id ||
        booking.contactEmail.toLowerCase() === req.member?.email?.toLowerCase();
      if (!isOwner) {
        return res.status(403).json({ error: 'Access denied to this booking compliance record.' });
      }
    }

    // Map requirements for each traveller
    const participantRequirements = booking.travellers.map((t) => {
      const riskDoc = booking.documentSubmissions.find(
        (s) => s.travellerId === t.id && s.documentRef === 'SYPL-RISK-2027'
      );
      const medDoc = booking.documentSubmissions.find(
        (s) => s.travellerId === t.id && s.documentRef === 'SYPL-MED-2027'
      );
      const insDoc = booking.documentSubmissions.find(
        (s) => s.travellerId === t.id && s.documentRef === 'SYPL-INS-2027'
      );

      return {
        travellerId: t.id,
        travellerName: t.fullName,
        passportNumber: t.passportNumber,
        isPrimary: t.isPrimary,
        requirements: {
          riskDeclaration: {
            documentRef: 'SYPL-RISK-2027',
            title: 'Participant Declaration & Limited Indemnity',
            version: riskDoc?.version || 'Draft 1.0 – 23 November 2026',
            status: riskDoc?.status || 'PENDING_SUBMISSION',
            submissionId: riskDoc?.id || null,
            submittedAt: riskDoc?.submittedAt || null,
            lastReview: riskDoc?.reviews?.[0] || null,
          },
          medicalCertificate: {
            documentRef: 'SYPL-MED-2027',
            title: 'Medical Fitness & Clinical Clearance',
            version: medDoc?.version || 'Draft 1.0 – 23 November 2026',
            status: medDoc?.status || 'PENDING_SUBMISSION',
            submissionId: medDoc?.id || null,
            submittedAt: medDoc?.submittedAt || null,
            isCertified: t.medicalFitnessCertified,
            lastReview: medDoc?.reviews?.[0] || null,
          },
          insuranceProof: {
            documentRef: 'SYPL-INS-2027',
            title: 'High-Altitude Travel Insurance Proof',
            version: insDoc?.version || 'Draft 1.0 – 23 November 2026',
            status: insDoc?.status || 'PENDING_SUBMISSION',
            submissionId: insDoc?.id || null,
            submittedAt: insDoc?.submittedAt || null,
            provider: t.insuranceProvider,
            policyNumber: t.insurancePolicyNumber,
            lastReview: insDoc?.reviews?.[0] || null,
          },
        },
      };
    });

    res.json({
      bookingId: booking.id,
      bookingReference: booking.bookingReference,
      bookingStatus: booking.status,
      participantRequirements,
    });
  } catch (error) {
    next(error);
  }
});

// -------------------------------------------------------------
// 4. GET /api/documents/my-documents
// Returns document cards for all bookings associated with the logged-in member
// -------------------------------------------------------------
router.get('/my-documents', authenticateUserOrMember, async (req, res, next) => {
  try {
    if (req.isAdmin && !req.member) {
      // If admin accesses, return empty member set or specify member query
      return res.json({ bookings: [] });
    }

    const memberId = req.member.id;
    const memberEmail = req.member.email.toLowerCase();

    const bookings = await prisma.booking.findMany({
      where: {
        OR: [{ memberId }, { contactEmail: memberEmail }],
      },
      include: {
        departure: true,
        route: true,
        travellers: true,
        documentSubmissions: {
          where: { isCurrentVersion: true },
          include: {
            reviews: { orderBy: { reviewedAt: 'desc' } },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const formattedBookings = bookings.map((b) => ({
      id: b.id,
      bookingReference: b.bookingReference,
      status: b.status,
      routeName: b.route?.name || 'Kailash Mansarovar Yatra 2027',
      batchName: b.departure?.batchName || 'May Batch',
      departureDate: b.departure?.startDate,
      travellersCount: b.totalTravellers,
      travellers: b.travellers.map((t) => {
        const riskDoc = b.documentSubmissions.find(
          (s) => s.travellerId === t.id && s.documentRef === 'SYPL-RISK-2027'
        );
        const medDoc = b.documentSubmissions.find(
          (s) => s.travellerId === t.id && s.documentRef === 'SYPL-MED-2027'
        );
        const insDoc = b.documentSubmissions.find(
          (s) => s.travellerId === t.id && s.documentRef === 'SYPL-INS-2027'
        );

        return {
          travellerId: t.id,
          fullName: t.fullName,
          passportNumber: t.passportNumber,
          isPrimary: t.isPrimary,
          cards: [
            {
              id: riskDoc?.id || `risk-${t.id}`,
              type: 'RISK_DECLARATION',
              documentRef: 'SYPL-RISK-2027',
              title: 'Risk Declaration & Limited Indemnity',
              version: riskDoc?.version || 'Draft 1.0 – 23 November 2026',
              status: riskDoc?.status || 'PENDING_SUBMISSION',
              submissionId: riskDoc?.id || null,
              submittedAt: riskDoc?.submittedAt || null,
              hasFile: Boolean(riskDoc?.filePath),
              reviewNote: riskDoc?.reviews?.[0]?.reviewNote || null,
              canResubmit: ['CLARIFICATION_REQUIRED', 'RESUBMISSION_REQUIRED', 'NOT_ACCEPTED'].includes(
                riskDoc?.status
              ),
            },
            {
              id: medDoc?.id || `med-${t.id}`,
              type: 'MEDICAL_CERTIFICATE',
              documentRef: 'SYPL-MED-2027',
              title: 'Medical Fitness & Clinical Clearance',
              version: medDoc?.version || 'Draft 1.0 – 23 November 2026',
              status: medDoc?.status || 'PENDING_SUBMISSION',
              submissionId: medDoc?.id || null,
              submittedAt: medDoc?.submittedAt || null,
              hasFile: Boolean(medDoc?.filePath),
              isCertified: t.medicalFitnessCertified,
              reviewNote: medDoc?.reviews?.[0]?.reviewNote || null,
              canResubmit: ['CLARIFICATION_REQUIRED', 'RESUBMISSION_REQUIRED', 'NOT_ACCEPTED'].includes(
                medDoc?.status
              ),
            },
            {
              id: insDoc?.id || `ins-${t.id}`,
              type: 'INSURANCE_PROOF',
              documentRef: 'SYPL-INS-2027',
              title: 'High-Altitude Travel Insurance Proof',
              version: insDoc?.version || 'Draft 1.0 – 23 November 2026',
              status: insDoc?.status || 'PENDING_SUBMISSION',
              submissionId: insDoc?.id || null,
              submittedAt: insDoc?.submittedAt || null,
              hasFile: Boolean(insDoc?.filePath),
              provider: t.insuranceProvider,
              policyNumber: t.insurancePolicyNumber,
              reviewNote: insDoc?.reviews?.[0]?.reviewNote || null,
              canResubmit: ['CLARIFICATION_REQUIRED', 'RESUBMISSION_REQUIRED', 'NOT_ACCEPTED'].includes(
                insDoc?.status
              ),
            },
          ],
        };
      }),
    }));

    res.json({ bookings: formattedBookings });
  } catch (error) {
    next(error);
  }
});

// -------------------------------------------------------------
// 5. POST /api/documents/risk-declaration/submit
// Submits signed 5-page Risk Declaration with 5 page initials and 8 acknowledgements
// -------------------------------------------------------------
const riskSubmitSchema = z.object({
  bookingId: z.string().min(1, 'Booking reference is required'),
  travellerId: z.string().min(1, 'Participant identification is required'),
  documentRef: z.string().default('SYPL-RISK-2027'),
  version: z.string().default('Draft 1.0 – 23 November 2026'),
  pageInitials: z
    .array(z.string().min(1, 'Each page initial must be provided'))
    .length(5, 'All 5 page initials are strictly required'),
  acknowledgements: z.object({
    ack1_extreme_altitude: z.literal(true, {
      errorMap: () => ({ message: 'You must acknowledge extreme altitude conditions up to 5,630m' }),
    }),
    ack2_medical_conditions: z.literal(true, {
      errorMap: () => ({ message: 'You must acknowledge truthful medical condition disclosure' }),
    }),
    ack3_insurance_mandatory: z.literal(true, {
      errorMap: () => ({ message: 'You must acknowledge mandatory high-altitude travel insurance' }),
    }),
    ack4_leader_authority: z.literal(true, {
      errorMap: () => ({ message: 'You must acknowledge leader authority regarding safety and descent' }),
    }),
    ack5_evacuation_costs: z.literal(true, {
      errorMap: () => ({ message: 'You must acknowledge financial responsibility for rescue/evacuation' }),
    }),
    ack6_uncertainties: z.literal(true, {
      errorMap: () => ({ message: 'You must acknowledge travel uncertainties and border delays' }),
    }),
    ack7_limited_indemnity: z.literal(true, {
      errorMap: () => ({ message: 'You must acknowledge limited indemnity and preserved rights' }),
    }),
    ack8_read_all_pages: z.literal(true, {
      errorMap: () => ({ message: 'You must confirm reading all 5 pages and 24 clauses' }),
    }),
  }),
  signerName: z.string().min(2, 'Signer legal full name is required'),
  signerRelationship: z.string().default('SELF'),
  signaturePlace: z.string().min(2, 'City and country of signature is required'),
  signatureDate: z.string().optional(),
  witnessName: z.string().optional().nullable(),
  witnessPhone: z.string().optional().nullable(),
  witnessSignature: z.string().optional().nullable(),
  emergencyContact: z
    .object({
      name: z.string().optional(),
      relationship: z.string().optional(),
      phone: z.string().optional(),
    })
    .optional(),
  insurance: z
    .object({
      provider: z.string().optional(),
      policyNumber: z.string().optional(),
      assistancePhone: z.string().optional(),
    })
    .optional(),
  fileData: z.string().optional().nullable(), // Optional physical signed copy upload
  originalFilename: z.string().optional().nullable(),
});

router.post('/risk-declaration/submit', authenticateUserOrMember, async (req, res, next) => {
  try {
    const data = riskSubmitSchema.parse(req.body);

    const booking = await prisma.booking.findUnique({
      where: { id: data.bookingId },
      include: { travellers: true },
    });

    if (!booking) {
      return res.status(404).json({ error: 'Associated booking not found' });
    }

    const traveller = booking.travellers.find((t) => t.id === data.travellerId);
    if (!traveller) {
      return res.status(404).json({ error: 'Participant not found in this booking' });
    }

    // Access check: Member can only submit for their own booking
    if (!req.isAdmin) {
      const isOwner =
        booking.memberId === req.member?.id ||
        booking.contactEmail.toLowerCase() === req.member?.email?.toLowerCase();
      if (!isOwner) {
        return res.status(403).json({ error: 'Unauthorized to submit documents for this booking.' });
      }
    }

    // Check if an existing submission exists to handle version superseding
    const existingSubmission = await prisma.documentSubmission.findFirst({
      where: {
        bookingId: data.bookingId,
        travellerId: data.travellerId,
        documentRef: 'SYPL-RISK-2027',
        isCurrentVersion: true,
      },
      orderBy: { versionNumber: 'desc' },
    });

    let versionNumber = 1;
    let replacedSubmissionId = null;

    if (existingSubmission) {
      versionNumber = existingSubmission.versionNumber + 1;
      replacedSubmissionId = existingSubmission.id;
      // Mark previous submission as superseded
      await prisma.documentSubmission.update({
        where: { id: existingSubmission.id },
        data: { isCurrentVersion: false },
      });
    }

    let fileDetails = {};
    if (data.fileData) {
      fileDetails = saveBase64File(data.fileData, data.originalFilename || 'Signed_Risk_Declaration.pdf');
    }

    // Save new DocumentSubmission
    const submission = await prisma.documentSubmission.create({
      data: {
        bookingId: data.bookingId,
        travellerId: data.travellerId,
        memberId: booking.memberId || req.member?.id,
        documentRef: 'SYPL-RISK-2027',
        documentTitle: 'Participant Declaration, Assumption of Risk & Limited Indemnity',
        version: data.version || 'Draft 1.0 – 23 November 2026',
        submissionType: data.fileData ? 'HYBRID' : 'DIGITAL_FORM',
        status: 'SUBMITTED',
        pageInitials: JSON.stringify(data.pageInitials),
        acknowledgements: JSON.stringify(data.acknowledgements),
        formData: JSON.stringify({
          signerName: data.signerName,
          signerRelationship: data.signerRelationship,
          signaturePlace: data.signaturePlace,
          signatureDate: data.signatureDate || new Date().toISOString(),
          witnessName: data.witnessName,
          witnessPhone: data.witnessPhone,
          witnessSignature: data.witnessSignature,
          emergencyContact: data.emergencyContact,
          insurance: data.insurance,
        }),
        signerName: data.signerName,
        signerRelationship: data.signerRelationship,
        signaturePlace: data.signaturePlace,
        signatureDate: data.signatureDate || new Date().toISOString(),
        witnessName: data.witnessName,
        witnessPhone: data.witnessPhone,
        witnessSignature: data.witnessSignature,
        filePath: fileDetails.filePath || null,
        originalFilename: fileDetails.originalFilename || null,
        fileSizeBytes: fileDetails.fileSizeBytes || null,
        mimeType: fileDetails.mimeType || null,
        ipAddress: req.ip || req.headers['x-forwarded-for'] || null,
        userAgent: req.headers['user-agent'] || null,
        submittedAt: new Date(),
        isCurrentVersion: true,
        replacedSubmissionId,
        versionNumber,
      },
    });

    // Update traveller emergency contact and insurance details if provided
    const travellerUpdates = {};
    if (data.emergencyContact?.name) travellerUpdates.emergencyContactName = data.emergencyContact.name;
    if (data.emergencyContact?.relationship)
      travellerUpdates.emergencyContactRelationship = data.emergencyContact.relationship;
    if (data.emergencyContact?.phone) travellerUpdates.emergencyContactPhone = data.emergencyContact.phone;
    if (data.insurance?.provider) travellerUpdates.insuranceProvider = data.insurance.provider;
    if (data.insurance?.policyNumber) travellerUpdates.insurancePolicyNumber = data.insurance.policyNumber;

    if (Object.keys(travellerUpdates).length > 0) {
      await prisma.traveller.update({
        where: { id: data.travellerId },
        data: travellerUpdates,
      });
    }

    // Create Audit Log
    await prisma.auditLog.create({
      data: {
        userId: req.user?.id || null,
        userEmail: req.user?.email || req.member?.email || booking.contactEmail,
        action: 'SUBMIT_RISK_DECLARATION',
        entity: 'DOCUMENT_SUBMISSION',
        entityId: submission.id,
        details: JSON.stringify({
          bookingReference: booking.bookingReference,
          travellerId: data.travellerId,
          version: submission.version,
          versionNumber,
          replacedSubmissionId,
        }),
        ipAddress: req.ip || null,
      },
    });

    res.status(201).json({
      message: 'Risk Declaration and Indemnity submitted successfully.',
      submission,
    });
  } catch (error) {
    next(error);
  }
});

// -------------------------------------------------------------
// 6. POST /api/documents/medical-certificate/upload
// Uploads Doctor-certified & Stamped Medical Fitness Certificate (SYPL-MED-2027)
// -------------------------------------------------------------
const medicalUploadSchema = z.object({
  bookingId: z.string().min(1, 'Booking reference is required'),
  travellerId: z.string().min(1, 'Participant ID is required'),
  documentRef: z.string().default('SYPL-MED-2027'),
  version: z.string().default('Draft 1.0 – 23 November 2026'),
  fileData: z.string().min(10, 'A scanned or digital PDF copy of the doctor-certified certificate is required'),
  originalFilename: z.string().default('Medical_Fitness_Certificate.pdf'),
  formData: z.union([z.string(), z.record(z.any())]).optional(),
});

router.post('/medical-certificate/upload', authenticateUserOrMember, async (req, res, next) => {
  try {
    const data = medicalUploadSchema.parse(req.body);

    const booking = await prisma.booking.findUnique({
      where: { id: data.bookingId },
      include: { travellers: true },
    });

    if (!booking) {
      return res.status(404).json({ error: 'Booking record not found' });
    }

    const traveller = booking.travellers.find((t) => t.id === data.travellerId);
    if (!traveller) {
      return res.status(404).json({ error: 'Participant not found in this booking' });
    }

    if (!req.isAdmin) {
      const isOwner =
        booking.memberId === req.member?.id ||
        booking.contactEmail.toLowerCase() === req.member?.email?.toLowerCase();
      if (!isOwner) {
        return res.status(403).json({ error: 'Unauthorized to upload documents for this booking.' });
      }
    }

    // Save File Securely outside public web directory
    const fileDetails = saveBase64File(data.fileData, data.originalFilename);

    // Version preservation
    const existingSubmission = await prisma.documentSubmission.findFirst({
      where: {
        bookingId: data.bookingId,
        travellerId: data.travellerId,
        documentRef: 'SYPL-MED-2027',
        isCurrentVersion: true,
      },
      orderBy: { versionNumber: 'desc' },
    });

    let versionNumber = 1;
    let replacedSubmissionId = null;

    if (existingSubmission) {
      versionNumber = existingSubmission.versionNumber + 1;
      replacedSubmissionId = existingSubmission.id;
      await prisma.documentSubmission.update({
        where: { id: existingSubmission.id },
        data: { isCurrentVersion: false },
      });
    }

    const parsedFormData = typeof data.formData === 'string' ? data.formData : JSON.stringify(data.formData || {});

    const submission = await prisma.documentSubmission.create({
      data: {
        bookingId: data.bookingId,
        travellerId: data.travellerId,
        memberId: booking.memberId || req.member?.id,
        documentRef: 'SYPL-MED-2027',
        documentTitle: 'Medical Fitness & Clinical Clearance Certificate',
        version: data.version || 'Draft 1.0 – 23 November 2026',
        submissionType: 'FILE_UPLOAD',
        status: 'SUBMITTED', // Undergoes strict admin verification before acceptance
        filePath: fileDetails.filePath,
        originalFilename: fileDetails.originalFilename,
        fileSizeBytes: fileDetails.fileSizeBytes,
        mimeType: fileDetails.mimeType,
        formData: parsedFormData,
        ipAddress: req.ip || null,
        userAgent: req.headers['user-agent'] || null,
        submittedAt: new Date(),
        isCurrentVersion: true,
        replacedSubmissionId,
        versionNumber,
      },
    });

    // Reset docVerificationStatus on traveller to PENDING while review occurs
    await prisma.traveller.update({
      where: { id: data.travellerId },
      data: {
        docVerificationStatus: 'PENDING',
        medicalFitnessCertified: false, // Strict: Never auto-certified upon upload! Requires qualified Admin verification.
      },
    });

    // Mirror in UploadedDocument for legacy compatibility
    await prisma.uploadedDocument.create({
      data: {
        bookingId: data.bookingId,
        travellerId: data.travellerId,
        documentType: 'MEDICAL_CERTIFICATE',
        originalFilename: fileDetails.originalFilename,
        filePath: fileDetails.filePath,
        fileSizeBytes: fileDetails.fileSizeBytes,
        mimeType: fileDetails.mimeType,
        status: 'PENDING',
      },
    });

    // Audit Log
    await prisma.auditLog.create({
      data: {
        userId: req.user?.id || null,
        userEmail: req.user?.email || req.member?.email || booking.contactEmail,
        action: 'UPLOAD_MEDICAL_CERTIFICATE',
        entity: 'DOCUMENT_SUBMISSION',
        entityId: submission.id,
        details: JSON.stringify({
          bookingReference: booking.bookingReference,
          travellerId: data.travellerId,
          version: submission.version,
          versionNumber,
          fileSizeBytes: fileDetails.fileSizeBytes,
        }),
        ipAddress: req.ip || null,
      },
    });

    res.status(201).json({
      message: 'Medical Fitness Certificate uploaded successfully and queued for clinical verification.',
      submission,
    });
  } catch (error) {
    next(error);
  }
});

// -------------------------------------------------------------
// 7. POST /api/documents/insurance-proof/upload
// Uploads High-Altitude Travel Insurance Proof (SYPL-INS-2027)
// -------------------------------------------------------------
const insuranceUploadSchema = z.object({
  bookingId: z.string().min(1, 'Booking reference is required'),
  travellerId: z.string().min(1, 'Participant ID is required'),
  insuranceProvider: z.string().min(2, 'Insurance provider is required'),
  policyNumber: z.string().min(3, 'Policy number is required'),
  emergencyAssistancePhone: z.string().optional().nullable(),
  fileData: z.string().min(10, 'A scanned policy schedule or certificate document is required'),
  originalFilename: z.string().default('Travel_Insurance_Proof.pdf'),
});

router.post('/insurance-proof/upload', authenticateUserOrMember, async (req, res, next) => {
  try {
    const data = insuranceUploadSchema.parse(req.body);

    const booking = await prisma.booking.findUnique({
      where: { id: data.bookingId },
      include: { travellers: true },
    });

    if (!booking) {
      return res.status(404).json({ error: 'Booking record not found' });
    }

    const traveller = booking.travellers.find((t) => t.id === data.travellerId);
    if (!traveller) {
      return res.status(404).json({ error: 'Participant not found in this booking' });
    }

    if (!req.isAdmin) {
      const isOwner =
        booking.memberId === req.member?.id ||
        booking.contactEmail.toLowerCase() === req.member?.email?.toLowerCase();
      if (!isOwner) {
        return res.status(403).json({ error: 'Unauthorized to upload documents for this booking.' });
      }
    }

    const fileDetails = saveBase64File(data.fileData, data.originalFilename);

    const existingSubmission = await prisma.documentSubmission.findFirst({
      where: {
        bookingId: data.bookingId,
        travellerId: data.travellerId,
        documentRef: 'SYPL-INS-2027',
        isCurrentVersion: true,
      },
      orderBy: { versionNumber: 'desc' },
    });

    let versionNumber = 1;
    let replacedSubmissionId = null;

    if (existingSubmission) {
      versionNumber = existingSubmission.versionNumber + 1;
      replacedSubmissionId = existingSubmission.id;
      await prisma.documentSubmission.update({
        where: { id: existingSubmission.id },
        data: { isCurrentVersion: false },
      });
    }

    const submission = await prisma.documentSubmission.create({
      data: {
        bookingId: data.bookingId,
        travellerId: data.travellerId,
        memberId: booking.memberId || req.member?.id,
        documentRef: 'SYPL-INS-2027',
        documentTitle: 'High-Altitude Travel Insurance Proof',
        version: 'Draft 1.0 – 23 November 2026',
        submissionType: 'FILE_UPLOAD',
        status: 'SUBMITTED',
        filePath: fileDetails.filePath,
        originalFilename: fileDetails.originalFilename,
        fileSizeBytes: fileDetails.fileSizeBytes,
        mimeType: fileDetails.mimeType,
        formData: JSON.stringify({
          insuranceProvider: data.insuranceProvider,
          policyNumber: data.policyNumber,
          emergencyAssistancePhone: data.emergencyAssistancePhone,
        }),
        ipAddress: req.ip || null,
        userAgent: req.headers['user-agent'] || null,
        submittedAt: new Date(),
        isCurrentVersion: true,
        replacedSubmissionId,
        versionNumber,
      },
    });

    await prisma.traveller.update({
      where: { id: data.travellerId },
      data: {
        insuranceProvider: data.insuranceProvider,
        insurancePolicyNumber: data.policyNumber,
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: req.user?.id || null,
        userEmail: req.user?.email || req.member?.email || booking.contactEmail,
        action: 'UPLOAD_INSURANCE_PROOF',
        entity: 'DOCUMENT_SUBMISSION',
        entityId: submission.id,
        details: JSON.stringify({
          bookingReference: booking.bookingReference,
          travellerId: data.travellerId,
          insuranceProvider: data.insuranceProvider,
          policyNumber: data.policyNumber,
        }),
        ipAddress: req.ip || null,
      },
    });

    res.status(201).json({
      message: 'High-Altitude Travel Insurance proof uploaded successfully.',
      submission,
    });
  } catch (error) {
    next(error);
  }
});

// -------------------------------------------------------------
// 8. GET /api/documents/:id/download
// Authenticated and Access-Controlled File Download / Preview
// -------------------------------------------------------------
router.get('/:id/download', authenticateUserOrMember, async (req, res, next) => {
  try {
    const { id } = req.params;

    const submission = await prisma.documentSubmission.findUnique({
      where: { id },
      include: {
        booking: {
          select: { id: true, bookingReference: true, memberId: true, contactEmail: true },
        },
      },
    });

    if (!submission) {
      return res.status(404).json({ error: 'Document submission record not found' });
    }

    // Access Control Check
    if (!req.isAdmin) {
      const isOwner =
        submission.memberId === req.member?.id ||
        submission.booking?.memberId === req.member?.id ||
        submission.booking?.contactEmail.toLowerCase() === req.member?.email?.toLowerCase();

      if (!isOwner) {
        return res.status(403).json({ error: 'Access denied: You cannot access medical or compliance records of other pilgrims.' });
      }
    }

    if (!submission.filePath || !fs.existsSync(submission.filePath)) {
      return res.status(404).json({ error: 'Uploaded physical file not found on secure storage.' });
    }

    // Audit Sensitive Medical / Legal File Access
    await prisma.auditLog.create({
      data: {
        userId: req.user?.id || null,
        userEmail: req.user?.email || req.member?.email || 'authenticated-user',
        action: 'DOWNLOAD_DOCUMENT_FILE',
        entity: 'DOCUMENT_SUBMISSION',
        entityId: submission.id,
        details: JSON.stringify({
          documentRef: submission.documentRef,
          bookingReference: submission.booking?.bookingReference,
          originalFilename: submission.originalFilename,
        }),
        ipAddress: req.ip || null,
      },
    });

    const ext = path.extname(submission.filePath).toLowerCase();
    const mime =
      submission.mimeType ||
      (ext === '.pdf' ? 'application/pdf' : ext === '.png' ? 'image/png' : 'image/jpeg');

    res.setHeader('Content-Type', mime);
    res.setHeader(
      'Content-Disposition',
      `inline; filename="${submission.originalFilename || 'document' + ext}"`
    );

    fs.createReadStream(submission.filePath).pipe(res);
  } catch (error) {
    next(error);
  }
});

// -------------------------------------------------------------
// 9. GET /api/documents/admin/list
// Admin Document Management Dashboard: Metrics & Searchable Register
// -------------------------------------------------------------
router.get('/admin/list', authenticateUserOrMember, requireAdminOnly, async (req, res, next) => {
  try {
    const { status, documentRef, search, page = 1, limit = 20 } = req.query;

    const where = {};
    if (status) where.status = String(status);
    if (documentRef) where.documentRef = String(documentRef);

    if (search) {
      const q = String(search).trim();
      where.OR = [
        { booking: { bookingReference: { contains: q } } },
        { traveller: { fullName: { contains: q } } },
        { traveller: { passportNumber: { contains: q } } },
        { documentTitle: { contains: q } },
        { signerName: { contains: q } },
      ];
    }

    // Real DB-derived Metrics
    const [
      totalSubmitted,
      pendingReview,
      underReview,
      clarificationRequested,
      accepted,
      notAccepted,
      submissions,
      totalCount,
    ] = await Promise.all([
      prisma.documentSubmission.count(),
      prisma.documentSubmission.count({ where: { status: 'SUBMITTED' } }),
      prisma.documentSubmission.count({ where: { status: 'UNDER_REVIEW' } }),
      prisma.documentSubmission.count({
        where: { status: { in: ['CLARIFICATION_REQUIRED', 'RESUBMISSION_REQUIRED'] } },
      }),
      prisma.documentSubmission.count({ where: { status: 'ACCEPTED' } }),
      prisma.documentSubmission.count({ where: { status: 'NOT_ACCEPTED' } }),
      prisma.documentSubmission.findMany({
        where,
        include: {
          booking: {
            select: {
              id: true,
              bookingReference: true,
              contactName: true,
              contactEmail: true,
              departure: { select: { batchName: true, startDate: true } },
              route: { select: { name: true, code: true } },
            },
          },
          traveller: {
            select: {
              id: true,
              fullName: true,
              passportNumber: true,
              medicalFitnessCertified: true,
              docVerificationStatus: true,
            },
          },
          member: {
            select: { id: true, firstName: true, lastName: true, email: true, membershipReference: true },
          },
          reviews: { orderBy: { reviewedAt: 'desc' } },
        },
        orderBy: { createdAt: 'desc' },
        skip: (Number(page) - 1) * Number(limit),
        take: Number(limit),
      }),
      prisma.documentSubmission.count({ where }),
    ]);

    res.json({
      metrics: {
        totalSubmitted,
        pendingReview,
        underReview,
        clarificationRequested,
        accepted,
        notAccepted,
      },
      submissions,
      pagination: {
        total: totalCount,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(totalCount / Number(limit)) || 1,
      },
    });
  } catch (error) {
    next(error);
  }
});

// -------------------------------------------------------------
// 10. GET /api/documents/admin/:id
// Admin Document Review Inspector: Full Submission Details & History
// -------------------------------------------------------------
router.get('/admin/:id', authenticateUserOrMember, requireAdminOnly, async (req, res, next) => {
  try {
    const { id } = req.params;

    const submission = await prisma.documentSubmission.findUnique({
      where: { id },
      include: {
        booking: {
          include: {
            departure: true,
            route: true,
            travellers: true,
          },
        },
        traveller: true,
        member: true,
        reviews: { orderBy: { reviewedAt: 'desc' } },
      },
    });

    if (!submission) {
      return res.status(404).json({ error: 'Document submission not found' });
    }

    // Retrieve previous superseded versions for full historical audit
    let previousVersions = [];
    if (submission.replacedSubmissionId) {
      let currentId = submission.replacedSubmissionId;
      while (currentId) {
        const prev = await prisma.documentSubmission.findUnique({
          where: { id: currentId },
          include: { reviews: true },
        });
        if (prev) {
          previousVersions.push(prev);
          currentId = prev.replacedSubmissionId;
        } else {
          break;
        }
      }
    }

    res.json({ submission, previousVersions });
  } catch (error) {
    next(error);
  }
});

// -------------------------------------------------------------
// 11. PUT /api/documents/admin/:id/review
// Records Admin Review Decision (Received, Under Review, Accept, Clarification, Reject)
// -------------------------------------------------------------
const reviewSchema = z.object({
  action: z.enum([
    'RECEIVED',
    'UNDER_REVIEW',
    'ACCEPT',
    'REQUEST_CLARIFICATION',
    'REJECT',
  ]),
  reviewNote: z.string().optional(),
  internalNotes: z.string().optional(),
  clinicalObservation: z.string().optional(),
});

router.put('/admin/:id/review', authenticateUserOrMember, requireAdminOnly, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { action, reviewNote, internalNotes, clinicalObservation } = reviewSchema.parse(req.body);

    if (['REQUEST_CLARIFICATION', 'REJECT'].includes(action) && (!reviewNote || !reviewNote.trim())) {
      return res.status(400).json({
        error: 'A detailed review note explaining the required clarification or rejection reason is strictly required.',
      });
    }

    const submission = await prisma.documentSubmission.findUnique({
      where: { id },
      include: { traveller: true, booking: true },
    });

    if (!submission) {
      return res.status(404).json({ error: 'Document submission not found' });
    }

    let newStatus = submission.status;
    if (action === 'RECEIVED') newStatus = 'SUBMITTED';
    if (action === 'UNDER_REVIEW') newStatus = 'UNDER_REVIEW';
    if (action === 'ACCEPT') newStatus = 'ACCEPTED';
    if (action === 'REQUEST_CLARIFICATION') newStatus = 'CLARIFICATION_REQUIRED';
    if (action === 'REJECT') newStatus = 'NOT_ACCEPTED';

    // 1. Create DocumentReview Record
    const reviewRecord = await prisma.documentReview.create({
      data: {
        submissionId: id,
        reviewerEmail: req.user.email,
        reviewerName: req.user.name || 'Shloka Administrator',
        previousStatus: submission.status,
        newStatus,
        reviewNote: reviewNote || null,
        internalNotes: internalNotes || null,
        clinicalObservation: clinicalObservation || null,
      },
    });

    // 2. Update Submission Status
    const updatedSubmission = await prisma.documentSubmission.update({
      where: { id },
      data: { status: newStatus },
      include: { reviews: { orderBy: { reviewedAt: 'desc' } } },
    });

    // 3. Update Participant Clearance strictly when Admin accepts clinical certificate
    if (submission.documentRef === 'SYPL-MED-2027' && submission.travellerId) {
      if (newStatus === 'ACCEPTED') {
        await prisma.traveller.update({
          where: { id: submission.travellerId },
          data: {
            medicalFitnessCertified: true,
            docVerificationStatus: 'VERIFIED',
          },
        });
      } else if (['CLARIFICATION_REQUIRED', 'NOT_ACCEPTED'].includes(newStatus)) {
        await prisma.traveller.update({
          where: { id: submission.travellerId },
          data: {
            medicalFitnessCertified: false,
            docVerificationStatus: newStatus === 'NOT_ACCEPTED' ? 'REJECTED' : 'PENDING',
            rejectionReason: reviewNote || null,
          },
        });
      }
    }

    // 4. Audit Log
    await prisma.auditLog.create({
      data: {
        userId: req.user.id,
        userEmail: req.user.email,
        action: 'ADMIN_REVIEW_DOCUMENT',
        entity: 'DOCUMENT_SUBMISSION',
        entityId: id,
        details: JSON.stringify({
          action,
          previousStatus: submission.status,
          newStatus,
          documentRef: submission.documentRef,
          bookingReference: submission.booking?.bookingReference,
          reviewNote: reviewNote || null,
        }),
        ipAddress: req.ip || null,
      },
    });

    res.json({
      message: `Document review recorded as ${newStatus}`,
      submission: updatedSubmission,
      review: reviewRecord,
    });
  } catch (error) {
    next(error);
  }
});

// -------------------------------------------------------------
// 12. PUT /api/documents/admin/templates/:id
// Manage Document Versioning & Publishing Lifecycle
// -------------------------------------------------------------
const templateUpdateSchema = z.object({
  lifecycleStatus: z.enum([
    'DRAFT',
    'PENDING_APPROVAL',
    'APPROVED',
    'PUBLISHED',
    'SUPERSEDED',
    'ARCHIVED',
  ]),
  isApproved: z.boolean(),
  description: z.string().optional(),
});

router.put('/admin/templates/:id', authenticateUserOrMember, requireAdminOnly, async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = templateUpdateSchema.parse(req.body);

    const template = await prisma.documentTemplate.findUnique({ where: { id } });
    if (!template) {
      return res.status(404).json({ error: 'Document template not found' });
    }

    const updated = await prisma.documentTemplate.update({
      where: { id },
      data: {
        lifecycleStatus: data.lifecycleStatus,
        isApproved: data.isApproved,
        description: data.description ?? template.description,
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: req.user.id,
        userEmail: req.user.email,
        action: 'UPDATE_DOCUMENT_TEMPLATE_STATUS',
        entity: 'DOCUMENT_TEMPLATE',
        entityId: id,
        details: JSON.stringify({
          documentRef: template.documentRef,
          lifecycleStatus: data.lifecycleStatus,
          isApproved: data.isApproved,
        }),
        ipAddress: req.ip || null,
      },
    });

    res.json({
      message: `Template ${template.documentRef} updated successfully`,
      template: updated,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
