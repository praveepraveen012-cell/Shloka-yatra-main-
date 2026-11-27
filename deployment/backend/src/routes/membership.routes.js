import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import prisma from '../prisma.js';
import {
  generateOtpCode,
  hashOtp,
  verifyOtp,
  sendOtpMessage,
  sendNotificationMessage,
  maskMobile,
  getDevTestOtp,
} from '../services/sms.service.js';
import { JWT_SECRET, JWT_EXPIRES_IN } from '../config/jwt.js';

const router = Router();

// -------------------------------------------------------------
// Validation Schemas
// -------------------------------------------------------------
const registerSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Please enter a valid email address'),
  countryCode: z.string().default('+91'),
  mobile: z.string().min(7, 'Please enter a valid mobile number'),
  gender: z.string().optional().nullable(),
  dateOfBirth: z.string().optional().nullable(),
  nationality: z.string().min(2, 'Nationality is required').default('Indian'),
  country: z.string().min(2, 'Country of residence is required').default('India'),
  state: z.string().optional().nullable(),
  city: z.string().optional().nullable(),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
  confirmPassword: z.string().min(8, 'Confirm password must match'),
  acceptTerms: z.literal(true, {
    errorMap: () => ({ message: 'You must accept the Terms and Conditions' }),
  }),
  acceptPrivacy: z.literal(true, {
    errorMap: () => ({ message: 'You must accept the Privacy Policy' }),
  }),
  marketingConsent: z.boolean().default(false),
  membershipType: z.string().default('STANDARD'),
  yatraInterest: z.string().optional().nullable(),
  preferredBatch: z.string().optional().nullable(),
  preferredPackage: z.string().optional().nullable(),
  isMobileVerified: z.boolean().optional().default(false),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

const verifyOtpSchema = z.object({
  mobile: z.string().min(7, 'Mobile number is required'),
  otp: z.string().length(6, 'OTP must be 6 digits'),
  purpose: z.enum(['REGISTRATION', 'PASSWORD_RESET', 'PROFILE_UPDATE']).default('REGISTRATION'),
  memberId: z.string().optional(),
});

const loginSchema = z.object({
  identifier: z.string().min(3, 'Please enter your email or registered mobile number'),
  password: z.string().min(6, 'Please enter your password'),
  rememberMe: z.boolean().optional(),
});

// Helper: Clean phone number
function cleanPhone(phone, code = '+91') {
  if (!phone) return '';
  const digits = phone.replace(/[^\d+]/g, '');
  if (digits.startsWith('+')) return digits;
  const cleanCode = code.startsWith('+') ? code : `+${code}`;
  return `${cleanCode}${digits.replace(/^0+/, '')}`;
}

// Helper: Generate unique membership reference
async function generateUniqueMembershipRef() {
  for (let i = 0; i < 10; i++) {
    const num = Math.floor(1000 + Math.random() * 9000);
    const ref = `SHL-MEM-2027-${num}`;
    const exists = await prisma.member.findUnique({
      where: { membershipReference: ref },
    });
    if (!exists) return ref;
  }
  return `SHL-MEM-2027-${Date.now().toString().slice(-4)}`;
}

// -------------------------------------------------------------
// Middleware: Member JWT Authentication & Clerk Support
// -------------------------------------------------------------
export const authenticateMemberToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Please sign in to access your member account.' });
  }

  try {
    let memberId = null;

    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      memberId = decoded.memberId || decoded.id;
    } catch (jwtErr) {
      // In automated test environments only, support mock clerk tokens for test harnesses
      if (process.env.NODE_ENV === 'test' && typeof token === 'string' && token.startsWith('user_test_')) {
        const testMember = await prisma.member.findUnique({ where: { clerkId: token } });
        if (testMember) memberId = testMember.id;
      }
      if (!memberId) {
        return res.status(401).json({ error: 'Invalid or expired session token. Please sign in again.' });
      }
    }

    const memberSelect = {
      id: true,
      clerkId: true,
      membershipReference: true,
      firstName: true,
      lastName: true,
      email: true,
      mobile: true,
      countryCode: true,
      gender: true,
      dateOfBirth: true,
      nationality: true,
      country: true,
      state: true,
      city: true,
      avatarUrl: true,
      membershipType: true,
      yatraInterest: true,
      preferredBatch: true,
      preferredPackage: true,
      travellersCount: true,
      status: true,
      isVerified: true,
      verifiedAt: true,
      createdAt: true,
      lastLoginAt: true,
    };

    let member = null;
    if (memberId) {
      member = await prisma.member.findUnique({
        where: { id: memberId },
        select: memberSelect,
      });
    }

    if (!member) {
      return res.status(401).json({ error: 'Member session expired or account not found. Please sign in again.' });
    }

    if (member.status === 'SUSPENDED') {
      return res.status(403).json({ error: 'Your membership account is suspended. Please contact our administrative desk.' });
    }

    req.member = member;
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Invalid or expired session token.' });
  }
};

// -------------------------------------------------------------
// 0. POST /api/membership/clerk-sync
// Synchronize Clerk user identity (Email/Password or Google Sign-In)
// -------------------------------------------------------------
router.post('/clerk-sync', async (req, res, next) => {
  try {
    const { clerkId, email, firstName, lastName, avatarUrl, mobile } = req.body;
    if (!clerkId || !email) {
      return res.status(400).json({ error: 'clerkId and email are required for synchronization' });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // 1. Look up by clerkId first
    let member = await prisma.member.findUnique({
      where: { clerkId },
      include: { bookings: true },
    });

    // 2. If not found by clerkId, search by email to link existing account
    if (!member) {
      const existingByEmail = await prisma.member.findUnique({
        where: { email: normalizedEmail },
        include: { bookings: true },
      });

      if (existingByEmail) {
        // SECURITY CHECK: If this account already has a different clerkId assigned, prevent account hijacking
        // Allow seamless transition if it was a simulated dev Google identity
        const isDevId = existingByEmail.clerkId?.includes('_dev_') || clerkId.includes('_dev_') || existingByEmail.clerkId?.startsWith('google_sub_');
        if (existingByEmail.clerkId && existingByEmail.clerkId !== clerkId && !isDevId) {
          return res.status(409).json({
            error: 'This email is already associated with another identity. Account link rejected for security.',
          });
        }
        // Link Clerk ID to existing member without creating duplicate account
        member = await prisma.member.update({
          where: { id: existingByEmail.id },
          data: {
            clerkId,
            avatarUrl: avatarUrl || existingByEmail.avatarUrl,
            lastLoginAt: new Date(),
            isVerified: true,
          },
          include: { bookings: true },
        });
      }
    }

    // 3. If still not found, create a new member record
    if (!member) {
      const membershipReference = await generateUniqueMembershipRef();
      member = await prisma.member.create({
        data: {
          clerkId,
          membershipReference,
          firstName: firstName || 'Devotee',
          lastName: lastName || 'Yatri',
          email: normalizedEmail,
          mobile: mobile || null,
          avatarUrl: avatarUrl || null,
          nationality: 'Indian',
          country: 'India',
          state: 'Delhi',
          city: 'New Delhi',
          passwordHash: 'CLERK_MANAGED',
          status: 'ACTIVE',
          isVerified: true,
          verifiedAt: new Date(),
          lastLoginAt: new Date(),
        },
        include: { bookings: true },
      });

      // Link any prior guest bookings made with this email address
      await prisma.booking.updateMany({
        where: {
          contactEmail: normalizedEmail,
          memberId: null,
        },
        data: {
          memberId: member.id,
        },
      });
    } else {
      await prisma.member.update({
        where: { id: member.id },
        data: { lastLoginAt: new Date() },
      });
    }

    // Generate member JWT token for session persistence across application APIs
    const token = jwt.sign(
      {
        memberId: member.id,
        clerkId: member.clerkId,
        reference: member.membershipReference,
        email: member.email,
        name: `${member.firstName} ${member.lastName}`,
        type: 'MEMBER',
      },
      JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.json({
      message: 'Member synced successfully with Clerk',
      member,
      token,
    });
  } catch (error) {
    next(error);
  }
});

// -------------------------------------------------------------
// 0.1. POST /api/membership/google-auth
// Direct Google Identity Services (GIS) & Google OAuth handler
// -------------------------------------------------------------
router.post('/google-auth', async (req, res, next) => {
  try {
    const { email, firstName, lastName, googleId, avatarUrl, mobile } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Email is required for Google Sign-In' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const resolvedGoogleId = googleId || `google_sub_${Buffer.from(normalizedEmail).toString('base64').replace(/=/g, '')}`;

    let member = await prisma.member.findFirst({
      where: {
        OR: [
          { clerkId: resolvedGoogleId },
          { email: normalizedEmail },
        ],
      },
      include: { bookings: true },
    });

    if (member) {
      member = await prisma.member.update({
        where: { id: member.id },
        data: {
          clerkId: member.clerkId || resolvedGoogleId,
          avatarUrl: avatarUrl || member.avatarUrl,
          lastLoginAt: new Date(),
          isVerified: true,
        },
        include: { bookings: true },
      });
    } else {
      const membershipReference = await generateUniqueMembershipRef();
      member = await prisma.member.create({
        data: {
          clerkId: resolvedGoogleId,
          membershipReference,
          firstName: firstName || 'Devotee',
          lastName: lastName || 'Yatri',
          email: normalizedEmail,
          mobile: mobile || null,
          avatarUrl: avatarUrl || null,
          nationality: 'Indian',
          country: 'India',
          state: 'Delhi',
          city: 'New Delhi',
          passwordHash: 'GOOGLE_OAUTH',
          status: 'ACTIVE',
          isVerified: true,
          verifiedAt: new Date(),
          lastLoginAt: new Date(),
        },
        include: { bookings: true },
      });

      // Link prior guest bookings
      await prisma.booking.updateMany({
        where: { contactEmail: normalizedEmail, memberId: null },
        data: { memberId: member.id },
      });
    }

    const token = jwt.sign(
      {
        memberId: member.id,
        clerkId: member.clerkId,
        reference: member.membershipReference,
        email: member.email,
        name: `${member.firstName} ${member.lastName}`,
        type: 'MEMBER',
      },
      JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.json({
      success: true,
      message: 'Google authentication successful',
      member,
      token,
    });
  } catch (error) {
    next(error);
  }
});

// -------------------------------------------------------------
// 1. POST /api/membership/register
// -------------------------------------------------------------
router.post('/register', async (req, res, next) => {
  try {
    const data = registerSchema.parse(req.body);
    const normalizedEmail = data.email.toLowerCase().trim();
    const fullMobile = cleanPhone(data.mobile, data.countryCode || '+91');

    // 1. Duplicate checks
    const existingEmail = await prisma.member.findUnique({
      where: { email: normalizedEmail },
    });
    if (existingEmail) {
      if (existingEmail.isVerified) {
        return res.status(409).json({
          error: 'An account with this email address already exists. Please log in instead.',
        });
      }
    }

    const existingMobile = await prisma.member.findFirst({
      where: { mobile: fullMobile },
    });
    if (existingMobile) {
      if (existingMobile.isVerified) {
        return res.status(409).json({
          error: 'An account with this mobile number already exists. Please log in instead.',
        });
      }
    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(data.password, saltRounds);

    let member;
    // If pending unverified account exists with same email, update it
    if (existingEmail && !existingEmail.isVerified) {
      member = await prisma.member.update({
        where: { id: existingEmail.id },
        data: {
          firstName: data.firstName.trim(),
          lastName: data.lastName.trim(),
          mobile: fullMobile,
          countryCode: data.countryCode || '+91',
          gender: data.gender || null,
          dateOfBirth: data.dateOfBirth || null,
          nationality: data.nationality.trim(),
          country: data.country.trim(),
          state: data.state ? data.state.trim() : '',
          city: data.city ? data.city.trim() : '',
          passwordHash,
          membershipType: data.membershipType || 'STANDARD',
          yatraInterest: data.yatraInterest || null,
          preferredBatch: data.preferredBatch || null,
          preferredPackage: data.preferredPackage || null,
          marketingConsent: Boolean(data.marketingConsent),
          status: 'ACTIVE',
          isVerified: Boolean(data.isMobileVerified || true),
        },
      });
    } else {
      const membershipReference = await generateUniqueMembershipRef();
      member = await prisma.member.create({
        data: {
          membershipReference,
          firstName: data.firstName.trim(),
          lastName: data.lastName.trim(),
          email: normalizedEmail,
          mobile: fullMobile,
          countryCode: data.countryCode || '+91',
          gender: data.gender || null,
          whatsapp: fullMobile,
          dateOfBirth: data.dateOfBirth || null,
          nationality: data.nationality.trim(),
          country: data.country.trim(),
          state: data.state ? data.state.trim() : '',
          city: data.city ? data.city.trim() : '',
          passwordHash,
          membershipType: data.membershipType || 'STANDARD',
          yatraInterest: data.yatraInterest || null,
          preferredBatch: data.preferredBatch || null,
          preferredPackage: data.preferredPackage || null,
          marketingConsent: Boolean(data.marketingConsent),
          status: 'ACTIVE',
          isVerified: Boolean(data.isMobileVerified || true),
        },
      });
    }

    // 2. Generate and store OTP
    const rawOtp = generateOtpCode();
    const otpHash = hashOtp(rawOtp);
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes validity

    // Invalidate prior registration OTPs for this mobile
    await prisma.memberOtp.updateMany({
      where: {
        mobile: fullMobile,
        purpose: 'REGISTRATION',
        isUsed: false,
      },
      data: { isUsed: true },
    });

    await prisma.memberOtp.create({
      data: {
        memberId: member.id,
        mobile: fullMobile,
        email: normalizedEmail,
        otpHash,
        purpose: 'REGISTRATION',
        expiresAt,
        reqIp: req.ip,
      },
    });

    // 3. Dispatch OTP via SMS service
    const smsResult = await sendOtpMessage({
      mobile: fullMobile,
      otp: rawOtp,
      purpose: 'REGISTRATION',
      memberName: `${member.firstName} ${member.lastName}`,
    });

    // Audit log
    await prisma.auditLog.create({
      data: {
        userEmail: member.email,
        action: 'MEMBER_REGISTRATION_INITIATED',
        entity: 'MEMBER',
        entityId: member.id,
        details: JSON.stringify({
          reference: member.membershipReference,
          mobile: maskMobile(fullMobile),
          provider: smsResult.provider,
        }),
      },
    });

    // Generate member JWT token for immediate access
    const token = jwt.sign(
      {
        memberId: member.id,
        reference: member.membershipReference,
        email: member.email,
        role: 'MEMBER',
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      success: true,
      message: 'Registration successful! Welcome to Shloka Yatra 2027.',
      token,
      member: {
        id: member.id,
        membershipReference: member.membershipReference,
        firstName: member.firstName,
        lastName: member.lastName,
        email: member.email,
        mobile: member.mobile,
        status: member.status,
        isVerified: member.isVerified,
      },
      memberId: member.id,
      membershipReference: member.membershipReference,
      mobile: fullMobile,
      maskedMobile: maskMobile(fullMobile),
      expiresAt,
      resendCooldown: 60,
      smsDeliveryNotice: smsResult.notice || null,
    });
  } catch (error) {
    next(error);
  }
});

// -------------------------------------------------------------
// 2. POST /api/membership/verify-otp
// -------------------------------------------------------------
router.post('/verify-otp', async (req, res, next) => {
  try {
    const { mobile, otp, purpose, memberId } = verifyOtpSchema.parse(req.body);
    const fullMobile = mobile.trim();
    const cleanDigits = mobile.replace(/\D/g, '').slice(-10);

    // Find the latest active OTP
    const otpRecord = await prisma.memberOtp.findFirst({
      where: {
        OR: [
          { mobile: fullMobile },
          { mobile: cleanPhone(fullMobile, '+91') },
          { mobile: { endsWith: cleanDigits } },
        ],
        purpose,
        isUsed: false,
      },
      orderBy: { createdAt: 'desc' },
      include: { member: true },
    });

    if (!otpRecord) {
      return res.status(400).json({
        error: 'No active OTP request found for this mobile number. Please request a new OTP.',
      });
    }

    // Check expiry
    if (new Date() > otpRecord.expiresAt) {
      await prisma.memberOtp.update({
        where: { id: otpRecord.id },
        data: { isUsed: true },
      });
      return res.status(400).json({
        error: 'The OTP has expired. Please request a new verification code.',
      });
    }

    // Check attempt limits
    if (otpRecord.attempts >= otpRecord.maxAttempts) {
      await prisma.memberOtp.update({
        where: { id: otpRecord.id },
        data: { isUsed: true },
      });
      return res.status(429).json({
        error: 'Too many incorrect attempts. For security, this OTP is invalidated. Please request a new code.',
      });
    }

    // Verify OTP hash
    const isValid = verifyOtp(otp, otpRecord.otpHash);
    if (!isValid) {
      await prisma.memberOtp.update({
        where: { id: otpRecord.id },
        data: { attempts: { increment: 1 } },
      });
      const remaining = otpRecord.maxAttempts - (otpRecord.attempts + 1);
      return res.status(400).json({
        error: `Invalid OTP code. Please check and try again. (${remaining} attempts remaining)`,
      });
    }

    // Mark OTP as used
    await prisma.memberOtp.update({
      where: { id: otpRecord.id },
      data: { isUsed: true, usedAt: new Date() },
    });

    // If Purpose is REGISTRATION -> Activate Member
    if (purpose === 'REGISTRATION') {
      const targetMemberId = memberId || otpRecord.memberId;
      const member = await prisma.member.update({
        where: { id: targetMemberId },
        data: {
          isVerified: true,
          verifiedAt: new Date(),
          status: 'ACTIVE',
        },
      });

      // Issue Auth Token
      const token = jwt.sign(
        {
          memberId: member.id,
          reference: member.membershipReference,
          email: member.email,
          role: 'MEMBER',
        },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      // Audit Log
      await prisma.auditLog.create({
        data: {
          userEmail: member.email,
          action: 'MEMBER_REGISTERED_AND_VERIFIED',
          entity: 'MEMBER',
          entityId: member.id,
          details: JSON.stringify({ reference: member.membershipReference, mobile: maskMobile(fullMobile) }),
        },
      });

      // Send Welcome Confirmation
      sendNotificationMessage({
        mobile: member.mobile,
        message: `Welcome to Shloka Yatra 2027! Your membership ${member.membershipReference} is now active. Explore sacred packages at shloka.com.`,
        type: 'WELCOME_CONFIRMATION',
      }).catch(() => {});

      return res.json({
        success: true,
        message: 'Mobile number verified successfully. Welcome to Shloka Yatra 2027!',
        token,
        member: {
          id: member.id,
          membershipReference: member.membershipReference,
          firstName: member.firstName,
          lastName: member.lastName,
          email: member.email,
          mobile: member.mobile,
          countryCode: member.countryCode,
          nationality: member.nationality,
          city: member.city,
          country: member.country,
          membershipType: member.membershipType,
          status: member.status,
          isVerified: member.isVerified,
          createdAt: member.createdAt,
        },
      });
    }

    // Default response for other purposes
    return res.json({
      success: true,
      message: 'OTP verified successfully.',
    });
  } catch (error) {
    next(error);
  }
});

// -------------------------------------------------------------
// 2b. Inline Mobile OTP Endpoints (at place of mobile input)
// -------------------------------------------------------------
router.post('/request-mobile-otp', async (req, res, next) => {
  try {
    const { mobile, countryCode } = z.object({
      mobile: z.string().min(7, 'Please enter a valid mobile number'),
      countryCode: z.string().default('+91'),
    }).parse(req.body);
    const fullMobile = cleanPhone(mobile, countryCode);

    // Cooldown check (30 seconds)
    const recentOtp = await prisma.memberOtp.findFirst({
      where: {
        mobile: fullMobile,
        purpose: 'REGISTRATION',
        createdAt: { gte: new Date(Date.now() - 30 * 1000) },
      },
    });

    if (recentOtp) {
      const waitSeconds = Math.ceil((recentOtp.createdAt.getTime() + 30 * 1000 - Date.now()) / 1000);
      return res.status(429).json({
        error: `Please wait ${waitSeconds}s before requesting another verification code.`,
      });
    }

    const rawOtp = generateOtpCode();
    const otpHash = hashOtp(rawOtp);
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    await prisma.memberOtp.updateMany({
      where: { mobile: fullMobile, purpose: 'REGISTRATION', isUsed: false },
      data: { isUsed: true },
    });

    await prisma.memberOtp.create({
      data: {
        mobile: fullMobile,
        otpHash,
        purpose: 'REGISTRATION',
        expiresAt,
        reqIp: req.ip,
      },
    });

    const smsResult = await sendOtpMessage({
      mobile: fullMobile,
      otp: rawOtp,
      purpose: 'REGISTRATION',
      memberName: 'Devotee',
    });

    res.json({
      success: true,
      message: `Verification code sent to ${maskMobile(fullMobile)}`,
      maskedMobile: maskMobile(fullMobile),
      resendCooldown: 60,
      smsDeliveryNotice: smsResult.notice || null,
    });
  } catch (err) {
    next(err);
  }
});

router.post('/verify-inline-otp', async (req, res, next) => {
  try {
    const { mobile, otp, countryCode } = z.object({
      mobile: z.string().min(7),
      otp: z.string().length(6),
      countryCode: z.string().default('+91'),
    }).parse(req.body);
    const fullMobile = cleanPhone(mobile, countryCode);
    const cleanDigits = mobile.replace(/\D/g, '').slice(-10);

    const otpRecord = await prisma.memberOtp.findFirst({
      where: {
        OR: [
          { mobile: fullMobile },
          { mobile: cleanPhone(mobile, '+91') },
          { mobile: { endsWith: cleanDigits } },
        ],
        purpose: 'REGISTRATION',
        isUsed: false,
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!otpRecord) {
      return res.status(400).json({ error: 'No active OTP request found for this mobile number.' });
    }

    if (new Date() > otpRecord.expiresAt) {
      return res.status(400).json({ error: 'This verification code has expired. Please request a new one.' });
    }

    const isValid = verifyOtp(otp, otpRecord.otpHash);
    if (!isValid) {
      return res.status(400).json({ error: 'Invalid verification code. Please check and re-enter.' });
    }

    await prisma.memberOtp.update({
      where: { id: otpRecord.id },
      data: { isUsed: true, usedAt: new Date() },
    });

    res.json({
      success: true,
      verified: true,
      message: 'Mobile number verified successfully!',
    });
  } catch (err) {
    next(err);
  }
});

// -------------------------------------------------------------
// 3. POST /api/membership/resend-otp
// -------------------------------------------------------------
router.post('/resend-otp', async (req, res, next) => {
  try {
    const { mobile, purpose } = z.object({
      mobile: z.string().min(7),
      purpose: z.enum(['REGISTRATION', 'PASSWORD_RESET', 'PROFILE_UPDATE']).default('REGISTRATION'),
    }).parse(req.body);

    const fullMobile = mobile.trim();

    // Check cooldown (60 seconds)
    const recentOtp = await prisma.memberOtp.findFirst({
      where: {
        mobile: fullMobile,
        purpose,
        createdAt: { gte: new Date(Date.now() - 60 * 1000) },
      },
    });

    if (recentOtp) {
      const waitSeconds = Math.ceil((recentOtp.createdAt.getTime() + 60 * 1000 - Date.now()) / 1000);
      return res.status(429).json({
        error: `Please wait ${waitSeconds} seconds before requesting a new OTP.`,
      });
    }

    const rawOtp = generateOtpCode();
    const otpHash = hashOtp(rawOtp);
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    // Invalidate old OTPs
    await prisma.memberOtp.updateMany({
      where: { mobile: fullMobile, purpose, isUsed: false },
      data: { isUsed: true },
    });

    const member = await prisma.member.findFirst({ where: { mobile: fullMobile } });

    await prisma.memberOtp.create({
      data: {
        memberId: member ? member.id : null,
        mobile: fullMobile,
        otpHash,
        purpose,
        expiresAt,
        reqIp: req.ip,
      },
    });

    const smsResult = await sendOtpMessage({
      mobile: fullMobile,
      otp: rawOtp,
      purpose,
      memberName: member ? member.firstName : 'Devotee',
    });

    res.json({
      success: true,
      message: `A new verification code has been dispatched to ${maskMobile(fullMobile)}.`,
      maskedMobile: maskMobile(fullMobile),
      expiresAt,
      resendCooldown: 60,
      smsDeliveryNotice: smsResult.notice || null,
    });
  } catch (error) {
    next(error);
  }
});

// -------------------------------------------------------------
// 4. POST /api/membership/login
// -------------------------------------------------------------
router.post('/login', async (req, res, next) => {
  try {
    const { identifier, password, rememberMe } = loginSchema.parse(req.body);
    const cleanId = identifier.trim();

    // Check by email, mobile or membershipReference
    const member = await prisma.member.findFirst({
      where: {
        OR: [
          { email: cleanId.toLowerCase() },
          { mobile: cleanId },
          { mobile: cleanId.replace(/\s+/g, '') },
          { mobile: cleanPhone(cleanId, '+91') },
          { membershipReference: cleanId.toUpperCase() },
        ],
      },
    });

    if (!member) {
      return res.status(401).json({
        error: 'Invalid credentials. No member account found matching this email or mobile.',
      });
    }

    if (member.status === 'SUSPENDED') {
      return res.status(403).json({
        error: 'Your membership account is currently suspended. Please contact volunteers@shlloka.com.',
      });
    }

    const isValid = await bcrypt.compare(password, member.passwordHash);
    if (!isValid) {
      return res.status(401).json({
        error: 'Incorrect password. Please verify and try again.',
      });
    }

    // Mobile verification is non-mandatory while SMS API is pending
    if (!member.isVerified) {
      await prisma.member.update({
        where: { id: member.id },
        data: { isVerified: true, verifiedAt: new Date(), status: 'ACTIVE' },
      });
      member.isVerified = true;
      member.status = 'ACTIVE';
    }

    // Update lastLoginAt
    await prisma.member.update({
      where: { id: member.id },
      data: { lastLoginAt: new Date() },
    });

    const expiresIn = rememberMe ? '30d' : '7d';
    const token = jwt.sign(
      {
        memberId: member.id,
        reference: member.membershipReference,
        email: member.email,
        role: 'MEMBER',
      },
      JWT_SECRET,
      { expiresIn }
    );

    // Audit log
    await prisma.auditLog.create({
      data: {
        userEmail: member.email,
        action: 'MEMBER_LOGIN',
        entity: 'MEMBER',
        entityId: member.id,
        details: JSON.stringify({ ip: req.ip, userAgent: req.headers['user-agent'] }),
      },
    });

    res.json({
      success: true,
      message: 'Login successful',
      token,
      member: {
        id: member.id,
        membershipReference: member.membershipReference,
        firstName: member.firstName,
        lastName: member.lastName,
        email: member.email,
        mobile: member.mobile,
        countryCode: member.countryCode,
        gender: member.gender,
        dateOfBirth: member.dateOfBirth,
        nationality: member.nationality,
        country: member.country,
        state: member.state,
        city: member.city,
        membershipType: member.membershipType,
        yatraInterest: member.yatraInterest,
        preferredBatch: member.preferredBatch,
        preferredPackage: member.preferredPackage,
        status: member.status,
        isVerified: member.isVerified,
        createdAt: member.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
});

// -------------------------------------------------------------
// 5. FORGOT PASSWORD WORKFLOW (Registered Mobile OTP)
// -------------------------------------------------------------

// Step 2 & 3: Request Password Reset OTP
router.post('/forgot-password/request-otp', async (req, res, next) => {
  try {
    const { mobile } = z.object({
      mobile: z.string().min(7, 'Please enter your registered mobile number'),
    }).parse(req.body);

    const cleanInput = mobile.trim();
    // Search member by formatted or plain mobile
    const member = await prisma.member.findFirst({
      where: {
        OR: [
          { mobile: cleanInput },
          { mobile: cleanInput.replace(/\s+/g, '') },
          { mobile: cleanPhone(cleanInput, '+91') },
          { mobile: { endsWith: cleanInput.replace(/\D/g, '').slice(-10) } },
        ],
      },
    });

    // Rate-limit check (60 seconds)
    const recentOtp = await prisma.memberOtp.findFirst({
      where: {
        mobile: member ? member.mobile : cleanInput,
        purpose: 'PASSWORD_RESET',
        createdAt: { gte: new Date(Date.now() - 60 * 1000) },
      },
    });

    if (recentOtp) {
      const waitSeconds = Math.ceil((recentOtp.createdAt.getTime() + 60 * 1000 - Date.now()) / 1000);
      return res.status(429).json({
        error: `Please wait ${waitSeconds} seconds before requesting another reset OTP.`,
      });
    }

    if (!member) {
      // Prevent user enumeration by returning standard message with masked number
      return res.json({
        success: true,
        message: `If an account is associated with this number, a verification OTP has been dispatched to ${maskMobile(cleanInput)}.`,
        maskedMobile: maskMobile(cleanInput),
        resendCooldown: 60,
      });
    }

    const rawOtp = generateOtpCode();
    const otpHash = hashOtp(rawOtp);
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    // Invalidate previous reset OTPs
    await prisma.memberOtp.updateMany({
      where: {
        mobile: member.mobile,
        purpose: 'PASSWORD_RESET',
        isUsed: false,
      },
      data: { isUsed: true },
    });

    await prisma.memberOtp.create({
      data: {
        memberId: member.id,
        mobile: member.mobile,
        email: member.email,
        otpHash,
        purpose: 'PASSWORD_RESET',
        expiresAt,
        reqIp: req.ip,
      },
    });

    const smsResult = await sendOtpMessage({
      mobile: member.mobile,
      otp: rawOtp,
      purpose: 'PASSWORD_RESET',
      memberName: member.firstName,
    });

    await prisma.auditLog.create({
      data: {
        userEmail: member.email,
        action: 'MEMBER_PASSWORD_RESET_OTP_SENT',
        entity: 'MEMBER',
        entityId: member.id,
        details: JSON.stringify({ mobile: maskMobile(member.mobile), provider: smsResult.provider }),
      },
    });

    res.json({
      success: true,
      message: `OTP sent to ${maskMobile(member.mobile)}`,
      mobile: member.mobile,
      maskedMobile: maskMobile(member.mobile),
      expiresAt,
      resendCooldown: 60,
      smsDeliveryNotice: smsResult.notice || null,
    });
  } catch (error) {
    next(error);
  }
});

// Step 4: Verify Password Reset OTP and get single-use reset token
router.post('/forgot-password/verify-otp', async (req, res, next) => {
  try {
    const { mobile, otp } = z.object({
      mobile: z.string().min(7),
      otp: z.string().length(6, 'OTP must be 6 digits'),
    }).parse(req.body);

    const cleanInput = mobile.trim();
    const member = await prisma.member.findFirst({
      where: {
        OR: [
          { mobile: cleanInput },
          { mobile: cleanInput.replace(/\s+/g, '') },
          { mobile: cleanPhone(cleanInput, '+91') },
          { mobile: { endsWith: cleanInput.replace(/\D/g, '').slice(-10) } },
        ],
      },
    });

    if (!member) {
      return res.status(400).json({ error: 'Invalid verification request.' });
    }

    const otpRecord = await prisma.memberOtp.findFirst({
      where: {
        mobile: member.mobile,
        purpose: 'PASSWORD_RESET',
        isUsed: false,
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!otpRecord) {
      return res.status(400).json({ error: 'No active password reset OTP found. Please request a new code.' });
    }

    if (new Date() > otpRecord.expiresAt) {
      await prisma.memberOtp.update({ where: { id: otpRecord.id }, data: { isUsed: true } });
      return res.status(400).json({ error: 'The reset OTP has expired. Please request a new code.' });
    }

    if (otpRecord.attempts >= otpRecord.maxAttempts) {
      await prisma.memberOtp.update({ where: { id: otpRecord.id }, data: { isUsed: true } });
      return res.status(429).json({ error: 'Too many incorrect attempts. Please request a new code.' });
    }

    const isValid = verifyOtp(otp, otpRecord.otpHash);
    if (!isValid) {
      await prisma.memberOtp.update({
        where: { id: otpRecord.id },
        data: { attempts: { increment: 1 } },
      });
      const remaining = otpRecord.maxAttempts - (otpRecord.attempts + 1);
      return res.status(400).json({ error: `Invalid OTP code. (${remaining} attempts remaining)` });
    }

    // Invalidate OTP
    await prisma.memberOtp.update({
      where: { id: otpRecord.id },
      data: { isUsed: true, usedAt: new Date() },
    });

    // Create single-use password reset token (10 minute validity)
    const resetToken = jwt.sign(
      {
        memberId: member.id,
        mobile: member.mobile,
        purpose: 'PASSWORD_RESET_AUTHORIZED',
      },
      JWT_SECRET,
      { expiresIn: '10m' }
    );

    res.json({
      success: true,
      message: 'Mobile OTP verified successfully. Please enter your new password.',
      resetToken,
    });
  } catch (error) {
    next(error);
  }
});

// Step 5 & 6: Set New Password
router.post('/forgot-password/reset-password', async (req, res, next) => {
  try {
    const { resetToken, newPassword, confirmPassword } = z.object({
      resetToken: z.string().min(1, 'Reset token is required'),
      newPassword: z.string().min(8, 'Password must be at least 8 characters long'),
      confirmPassword: z.string().min(8, 'Please confirm your password'),
    }).refine((d) => d.newPassword === d.confirmPassword, {
      message: 'Passwords do not match',
      path: ['confirmPassword'],
    }).parse(req.body);

    let decoded;
    try {
      decoded = jwt.verify(resetToken, JWT_SECRET);
      if (decoded.purpose !== 'PASSWORD_RESET_AUTHORIZED' || !decoded.memberId) {
        throw new Error('Invalid token');
      }
    } catch {
      return res.status(401).json({ error: 'Password reset session has expired. Please verify your mobile number again.' });
    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(newPassword, saltRounds);

    const member = await prisma.member.update({
      where: { id: decoded.memberId },
      data: { passwordHash },
    });

    // Send security notification SMS
    sendNotificationMessage({
      mobile: member.mobile,
      message: 'Shloka Yatra Security: Your account password was successfully reset. If this was not you, please contact +91 6366852888.',
      type: 'PASSWORD_RESET_COMPLETED',
    }).catch(() => {});

    await prisma.auditLog.create({
      data: {
        userEmail: member.email,
        action: 'MEMBER_PASSWORD_RESET_COMPLETED',
        entity: 'MEMBER',
        entityId: member.id,
        details: JSON.stringify({ ip: req.ip }),
      },
    });

    res.json({
      success: true,
      message: 'Your password has been changed successfully. You can now log in using your new password.',
    });
  } catch (error) {
    next(error);
  }
});

// -------------------------------------------------------------
// 6. MEMBER PROFILE, BOOKINGS, PAYMENTS & DASHBOARD ENDPOINTS
// -------------------------------------------------------------

// GET /api/membership/me
router.get('/me', authenticateMemberToken, async (req, res) => {
  res.json({ member: req.member });
});

// PUT /api/membership/profile
router.put('/profile', authenticateMemberToken, async (req, res, next) => {
  try {
    const schema = z.object({
      firstName: z.string().min(2).optional(),
      lastName: z.string().min(1).optional(),
      gender: z.string().optional().nullable(),
      dateOfBirth: z.string().optional().nullable(),
      nationality: z.string().min(2).optional(),
      country: z.string().min(2).optional(),
      state: z.string().optional().nullable(),
      city: z.string().optional().nullable(),
      whatsapp: z.string().optional().nullable(),
      yatraInterest: z.string().optional().nullable(),
      preferredBatch: z.string().optional().nullable(),
      preferredPackage: z.string().optional().nullable(),
    });

    const data = schema.parse(req.body);

    const updated = await prisma.member.update({
      where: { id: req.member.id },
      data,
      select: {
        id: true,
        membershipReference: true,
        firstName: true,
        lastName: true,
        email: true,
        mobile: true,
        countryCode: true,
        gender: true,
        dateOfBirth: true,
        nationality: true,
        country: true,
        state: true,
        city: true,
        whatsapp: true,
        membershipType: true,
        yatraInterest: true,
        preferredBatch: true,
        preferredPackage: true,
        status: true,
        isVerified: true,
        createdAt: true,
      },
    });

    res.json({
      success: true,
      message: 'Profile updated successfully',
      member: updated,
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/membership/bookings
router.get('/bookings', authenticateMemberToken, async (req, res, next) => {
  try {
    const member = req.member;

    // Find bookings by memberId OR matching contactEmail / contactPhone
    const bookings = await prisma.booking.findMany({
      where: {
        OR: [
          { memberId: member.id },
          { contactEmail: member.email.toLowerCase() },
          { contactPhone: member.mobile },
          { contactPhone: { endsWith: member.mobile.slice(-10) } },
        ],
      },
      include: {
        departure: true,
        route: true,
        travellers: true,
        payments: {
          where: { status: 'SUCCESS' },
          select: { id: true, amount: true, createdAt: true, paymentMethod: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Calculate real paid amounts and balances
    const formatted = bookings.map((b) => {
      const paid = b.payments.reduce((sum, p) => sum + p.amount, 0);
      return {
        ...b,
        depositPaid: paid,
        balanceDue: Math.max(0, b.totalAmount - paid),
      };
    });

    res.json({ bookings: formatted, count: formatted.length });
  } catch (error) {
    next(error);
  }
});

// GET /api/membership/payments
router.get('/payments', authenticateMemberToken, async (req, res, next) => {
  try {
    const member = req.member;

    // Find all payments linked to member's bookings
    const payments = await prisma.payment.findMany({
      where: {
        booking: {
          OR: [
            { memberId: member.id },
            { contactEmail: member.email.toLowerCase() },
            { contactPhone: member.mobile },
            { contactPhone: { endsWith: member.mobile.slice(-10) } },
          ],
        },
      },
      include: {
        booking: {
          select: {
            id: true,
            bookingReference: true,
            route: { select: { name: true } },
            departure: { select: { name: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ payments, count: payments.length });
  } catch (error) {
    next(error);
  }
});

// GET /api/membership/documents
router.get('/documents', authenticateMemberToken, async (req, res, next) => {
  try {
    const member = req.member;

    const documents = await prisma.uploadedDocument.findMany({
      where: {
        booking: {
          OR: [
            { memberId: member.id },
            { contactEmail: member.email.toLowerCase() },
            { contactPhone: member.mobile },
          ],
        },
      },
      include: {
        booking: {
          select: { id: true, bookingReference: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ documents, count: documents.length });
  } catch (error) {
    next(error);
  }
});

// POST /api/membership/change-password
router.post('/change-password', authenticateMemberToken, async (req, res, next) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = z.object({
      currentPassword: z.string().min(1, 'Current password is required'),
      newPassword: z.string().min(8, 'New password must be at least 8 characters long'),
      confirmPassword: z.string().min(8, 'Please confirm your new password'),
    }).refine((d) => d.newPassword === d.confirmPassword, {
      message: 'New passwords do not match',
      path: ['confirmPassword'],
    }).parse(req.body);

    const fullMember = await prisma.member.findUnique({
      where: { id: req.member.id },
    });

    const isMatch = await bcrypt.compare(currentPassword, fullMember.passwordHash);
    if (!isMatch) {
      return res.status(400).json({ error: 'Current password is incorrect.' });
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);
    await prisma.member.update({
      where: { id: req.member.id },
      data: { passwordHash },
    });

    await prisma.auditLog.create({
      data: {
        userEmail: req.member.email,
        action: 'MEMBER_PASSWORD_CHANGED',
        entity: 'MEMBER',
        entityId: req.member.id,
      },
    });

    res.json({ success: true, message: 'Password updated successfully.' });
  } catch (error) {
    next(error);
  }
});

// -------------------------------------------------------------
// Test helper for integration test suites ONLY (not in production)
// -------------------------------------------------------------
if (process.env.NODE_ENV === 'test' || process.env.NODE_ENV === 'development') {
  router.get('/test-helper/get-latest-otp', async (req, res) => {
    const { mobile } = req.query;
    if (!mobile) return res.status(400).json({ error: 'mobile required' });
    const cleanMobile = String(mobile).replace(/[^\d+]/g, '');
    const code = getDevTestOtp(cleanMobile);
    const otpRec = await prisma.memberOtp.findFirst({
      where: { mobile: cleanMobile, isUsed: false },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ otp: code, otpRecord: otpRec });
  });
}

export default router;
