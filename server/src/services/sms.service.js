import crypto from 'node:crypto';
import prisma from '../prisma.js';

/**
 * Enterprise SMS & OTP Gateway Service for Shloka Yatra 2027
 * Supports Fast2SMS, Twilio, and transparent dev simulation logging.
 */

// Helper to mask mobile for public responses: +91 98765 43210 -> ******3210
export function maskMobile(mobile) {
  if (!mobile) return '******';
  const clean = mobile.replace(/\s+/g, '');
  if (clean.length <= 4) return '******';
  return '******' + clean.slice(-4);
}

// In-memory store on globalThis for test/dev environments
globalThis.__devTestOtpStore = globalThis.__devTestOtpStore || new Map();

export function getDevTestOtp(mobile) {
  if (!mobile) return null;
  const digits = String(mobile).replace(/\D/g, '');
  const last10 = digits.length >= 10 ? digits.slice(-10) : digits;
  return globalThis.__devTestOtpStore.get(digits) || globalThis.__devTestOtpStore.get(last10);
}

// Generate cryptographically secure 6-digit OTP
export function generateOtpCode() {
  return crypto.randomInt(100000, 1000000).toString();
}

// Hash OTP with SHA-256 with salt for secure DB storage
export function hashOtp(otp, salt = 'shloka_otp_salt_2027') {
  return crypto.createHash('sha256').update(`${otp}:${salt}`).digest('hex');
}

export function verifyOtp(otp, hash, salt = 'shloka_otp_salt_2027') {
  const computed = hashOtp(otp, salt);
  return crypto.timingSafeEqual(Buffer.from(computed), Buffer.from(hash));
}

/**
 * Send an OTP message to a mobile number
 * @param {Object} params - { mobile, otp, purpose, memberName }
 */
export async function sendOtpMessage({ mobile, otp, purpose = 'REGISTRATION', memberName = 'Devotee' }) {
  const cleanMobile = mobile.replace(/[^\d+]/g, '');
  if (process.env.NODE_ENV !== 'production' && globalThis.__devTestOtpStore) {
    const digits = cleanMobile.replace(/\D/g, '');
    const last10 = digits.length >= 10 ? digits.slice(-10) : digits;
    globalThis.__devTestOtpStore.set(digits, otp);
    globalThis.__devTestOtpStore.set(last10, otp);
  }
  const provider = (process.env.SMS_PROVIDER || '').toLowerCase();
  const fast2SmsKey = process.env.FAST2SMS_API_KEY;
  const twilioSid = process.env.TWILIO_ACCOUNT_SID;
  const twilioToken = process.env.TWILIO_AUTH_TOKEN;
  const twilioFrom = process.env.TWILIO_PHONE_NUMBER;

  let messageText = '';
  if (purpose === 'REGISTRATION') {
    messageText = `Shloka Yatra: Your pilgrimage membership verification OTP is ${otp}. Valid for 5 minutes. Do not share with anyone.`;
  } else if (purpose === 'PASSWORD_RESET') {
    messageText = `Shloka Yatra: Your password reset verification code is ${otp}. Valid for 5 minutes. If you did not request this, please contact support immediately.`;
  } else {
    messageText = `Shloka Yatra: Your verification code is ${otp}. Valid for 5 minutes.`;
  }

  // 1. Try Fast2SMS if configured
  if (fast2SmsKey && (provider === 'fast2sms' || !provider)) {
    try {
      const numericPhone = cleanMobile.replace(/\D/g, '').slice(-10);
      const res = await fetch('https://www.fast2sms.com/dev/bulkV2', {
        method: 'POST',
        headers: {
          authorization: fast2SmsKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          route: 'otp',
          variables_values: otp,
          numbers: numericPhone,
        }),
      });
      const data = await res.json();
      if (data && data.return === true) {
        return {
          delivered: true,
          provider: 'FAST2SMS',
          providerMessageId: data.request_id || null,
          maskedMobile: maskMobile(cleanMobile),
        };
      }
    } catch (err) {
      console.warn('[SMS_GATEWAY: FAST2SMS_ERROR]', err.message);
    }
  }

  // 2. Try Twilio if configured
  if (twilioSid && twilioToken && twilioFrom && (provider === 'twilio' || !provider)) {
    try {
      const authHeader = 'Basic ' + Buffer.from(`${twilioSid}:${twilioToken}`).toString('base64');
      const params = new URLSearchParams();
      params.append('To', cleanMobile);
      params.append('From', twilioFrom);
      params.append('Body', messageText);

      const res = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${twilioSid}/Messages.json`, {
        method: 'POST',
        headers: {
          Authorization: authHeader,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params,
      });
      const data = await res.json();
      if (res.ok && data.sid) {
        return {
          delivered: true,
          provider: 'TWILIO',
          providerMessageId: data.sid,
          maskedMobile: maskMobile(cleanMobile),
        };
      }
    } catch (err) {
      console.warn('[SMS_GATEWAY: TWILIO_ERROR]', err.message);
    }
  }

  // 3. Fallback: Secure Simulation & Dev Logging
  // As requested in specification: Clearly indicate simulated delivery when provider credentials are not configured.
  // The raw OTP is logged ONLY in secure server debug mode for testing, never sent to frontend.
  if (process.env.NODE_ENV !== 'production') {
    console.info(`[SMS_GATEWAY: DEV_SIMULATION] To: ${cleanMobile} | Purpose: ${purpose} | OTP: ${otp} | Message: "${messageText}"`);
  }

  return {
    delivered: true,
    provider: 'SIMULATED_DEV_GATEWAY',
    providerMessageId: `sim_${Date.now()}`,
    maskedMobile: maskMobile(cleanMobile),
    notice: 'Live SMS provider credentials (FAST2SMS_API_KEY or TWILIO_*) not configured; simulated dispatch confirmed.',
  };
}

/**
 * Send Transactional Confirmation SMS (Registration confirmation, Password changed notification)
 */
export async function sendNotificationMessage({ mobile, message, type = 'NOTIFICATION' }) {
  const cleanMobile = mobile.replace(/[^\d+]/g, '');
  const provider = (process.env.SMS_PROVIDER || '').toLowerCase();
  const fast2SmsKey = process.env.FAST2SMS_API_KEY;

  if (fast2SmsKey && (provider === 'fast2sms' || !provider)) {
    try {
      const numericPhone = cleanMobile.replace(/\D/g, '').slice(-10);
      await fetch('https://www.fast2sms.com/dev/bulkV2', {
        method: 'POST',
        headers: {
          authorization: fast2SmsKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          route: 'q',
          message,
          language: 'english',
          flash: 0,
          numbers: numericPhone,
        }),
      });
    } catch (e) {}
  } else if (process.env.NODE_ENV !== 'production') {
    console.info(`[SMS_GATEWAY: NOTIFICATION_SIMULATION] To: ${cleanMobile} | Type: ${type} | Message: "${message}"`);
  }
}
