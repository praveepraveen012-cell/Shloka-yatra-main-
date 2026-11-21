import { test, describe, before } from 'node:test';
import assert from 'node:assert';
import request from 'supertest';
import app from '../src/index.js';
import prisma from '../src/prisma.js';
import { bootstrapAdmin, ADMIN_TEMPORARY_PASSWORD } from '../src/bootstrap.js';
import { getDevTestOtp } from '../src/services/sms.service.js';

describe('Advanced Member Registration, Authentication and Admin Integration Suite', async () => {
  let adminToken = '';
  let memberToken = '';
  let registeredMemberId = '';
  const randDigits = Math.floor(10000000 + Math.random() * 90000000).toString();
  let testMemberCleanMobile = `98${randDigits.slice(0, 8)}`;
  let testMemberFullMobile = `+91${testMemberCleanMobile}`;
  let testMemberEmail = `devotee_${Date.now()}@shlloka.test`;
  let testPassword = 'ShlokaDevotee@2027';
  let newPassword = 'NewShlokaDevotee#2027';

  before(async () => {
    process.env.NODE_ENV = 'test';
    await bootstrapAdmin();

    // Login as Admin to get adminToken
    const adminLoginRes = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'admin@shloka.com',
        password: ADMIN_TEMPORARY_PASSWORD,
      });
    assert.strictEqual(adminLoginRes.status, 200);
    assert.ok(adminLoginRes.body.token);
    adminToken = adminLoginRes.body.token;
  });

  // --------------------------------------------------------------------------
  // TEST A: Full Member Registration -> OTP Dispatch -> OTP Verification
  // --------------------------------------------------------------------------
  test('Test A1: Register a new member successfully with status PENDING', async () => {
    const res = await request(app)
      .post('/api/membership/register')
      .send({
        firstName: 'Ananya',
        lastName: 'Sharma',
        email: testMemberEmail,
        countryCode: '+91',
        mobile: testMemberCleanMobile,
        gender: 'FEMALE',
        dateOfBirth: '1988-06-15',
        nationality: 'Indian',
        country: 'India',
        state: 'Karnataka',
        city: 'Bengaluru',
        password: testPassword,
        confirmPassword: testPassword,
        acceptTerms: true,
        acceptPrivacy: true,
        marketingConsent: true,
      });

    assert.strictEqual(res.status, 201);
    assert.strictEqual(res.body.success, true);
    assert.ok(res.body.memberId);
    assert.ok(res.body.membershipReference);
    registeredMemberId = res.body.memberId;

    // Verify OTP was never exposed in client response
    assert.strictEqual(res.body.otp, undefined);
  });

  test('Test A2: Verify mobile OTP and activate member account', async () => {
    // Retrieve OTP from dev service store
    const code = getDevTestOtp(testMemberCleanMobile);
    assert.ok(code, 'OTP should have been recorded during registration dispatch');
    assert.strictEqual(code.length, 6);

    const verifyRes = await request(app)
      .post('/api/membership/verify-otp')
      .send({
        mobile: testMemberCleanMobile,
        otp: code,
        purpose: 'REGISTRATION',
      });

    assert.strictEqual(verifyRes.status, 200);
    assert.strictEqual(verifyRes.body.success, true);
    assert.strictEqual(verifyRes.body.member.isVerified, true);
    assert.strictEqual(verifyRes.body.member.status, 'ACTIVE');
    assert.ok(verifyRes.body.token, 'JWT token must be returned on activation');
    memberToken = verifyRes.body.token;

    // Verify record in database
    const dbMember = await prisma.member.findUnique({
      where: { id: registeredMemberId },
    });
    assert.strictEqual(dbMember.isVerified, true);
    assert.strictEqual(dbMember.status, 'ACTIVE');
  });

  test('Test A3: Newly registered member appears immediately in Admin Panel', async () => {
    const res = await request(app)
      .get('/api/admin/members')
      .set('Authorization', `Bearer ${adminToken}`);

    assert.strictEqual(res.status, 200);
    assert.ok(Array.isArray(res.body.members));
    const found = res.body.members.find((m) => m.id === registeredMemberId);
    assert.ok(found, 'Member must immediately be listed in Admin Panel');
    assert.strictEqual(found.email, testMemberEmail);
    assert.strictEqual(found.isVerified, true);
    assert.strictEqual(found.status, 'ACTIVE');
  });

  // --------------------------------------------------------------------------
  // TEST B: Duplicate Email and Duplicate Mobile Rejections
  // --------------------------------------------------------------------------
  test('Test B1: Reject registration with duplicate email', async () => {
    const res = await request(app)
      .post('/api/membership/register')
      .send({
        firstName: 'Another',
        lastName: 'Person',
        email: testMemberEmail, // duplicate
        countryCode: '+91',
        mobile: `96${Math.floor(100000 + Math.random() * 900000)}`,
        nationality: 'Indian',
        country: 'India',
        password: testPassword,
        confirmPassword: testPassword,
        acceptTerms: true,
        acceptPrivacy: true,
      });

    assert.strictEqual(res.status, 409);
    assert.match(res.body.error, /already exists/i);
  });

  test('Test B2: Reject registration with duplicate mobile number', async () => {
    const res = await request(app)
      .post('/api/membership/register')
      .send({
        firstName: 'Another',
        lastName: 'Person',
        email: `unique_${Date.now()}@shlloka.test`,
        countryCode: '+91',
        mobile: testMemberCleanMobile, // duplicate
        nationality: 'Indian',
        country: 'India',
        password: testPassword,
        confirmPassword: testPassword,
        acceptTerms: true,
        acceptPrivacy: true,
      });

    assert.strictEqual(res.status, 409);
    assert.match(res.body.error, /already exists/i);
  });

  // --------------------------------------------------------------------------
  // TEST C: Member Login Workflow
  // --------------------------------------------------------------------------
  test('Test C1: Member can log in using email address', async () => {
    const res = await request(app)
      .post('/api/membership/login')
      .send({
        identifier: testMemberEmail,
        password: testPassword,
      });

    assert.strictEqual(res.status, 200);
    assert.ok(res.body.token);
    assert.strictEqual(res.body.member.id, registeredMemberId);
    memberToken = res.body.token;
  });

  test('Test C2: Member can log in using registered mobile number', async () => {
    const res = await request(app)
      .post('/api/membership/login')
      .send({
        identifier: testMemberCleanMobile,
        password: testPassword,
      });

    assert.strictEqual(res.status, 200);
    assert.ok(res.body.token);
    assert.strictEqual(res.body.member.id, registeredMemberId);
  });

  test('Test C3: Unverified member is prevented from standard login and receives OTP trigger', async () => {
    const unverifiedSuffix = Math.floor(100000 + Math.random() * 900000);
    const unverifiedEmail = `unverified_${Date.now()}_${unverifiedSuffix}@shlloka.test`;
    const unverifiedMobile = `93${unverifiedSuffix}`;

    const regRes = await request(app)
      .post('/api/membership/register')
      .send({
        firstName: 'Pending',
        lastName: 'Devotee',
        email: unverifiedEmail,
        countryCode: '+91',
        mobile: unverifiedMobile,
        nationality: 'Indian',
        country: 'India',
        password: testPassword,
        confirmPassword: testPassword,
        acceptTerms: true,
        acceptPrivacy: true,
      });
    assert.strictEqual(regRes.status, 201);

    const loginRes = await request(app)
      .post('/api/membership/login')
      .send({
        identifier: unverifiedEmail,
        password: testPassword,
      });

    assert.strictEqual(loginRes.status, 403);
    assert.strictEqual(loginRes.body.unverified, true);
    assert.strictEqual(loginRes.body.token, undefined);
  });

  test('Test C4: Access member authenticated profile with valid JWT', async () => {
    const res = await request(app)
      .get('/api/membership/me')
      .set('Authorization', `Bearer ${memberToken}`);

    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.member.id, registeredMemberId);
    assert.strictEqual(res.body.member.email, testMemberEmail);
  });

  // --------------------------------------------------------------------------
  // TEST D: Forgot Password via Registered Mobile OTP
  // --------------------------------------------------------------------------
  test('Test D1: Request password reset OTP for registered mobile', async () => {
    const res = await request(app)
      .post('/api/membership/forgot-password/request-otp')
      .send({
        mobile: testMemberCleanMobile,
      });

    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);
    assert.strictEqual(res.body.otp, undefined, 'Raw OTP must not be exposed');
  });

  test('Test D2: Verify reset OTP and receive temporary reset token', async () => {
    const resetOtp = getDevTestOtp(testMemberCleanMobile);
    assert.ok(resetOtp, 'Reset OTP must be recorded in dev store');

    const res = await request(app)
      .post('/api/membership/forgot-password/verify-otp')
      .send({
        mobile: testMemberCleanMobile,
        otp: resetOtp,
      });

    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);
    assert.ok(res.body.resetToken, 'Must receive resetToken upon OTP validation');

    // Reset password with the issued resetToken
    const changeRes = await request(app)
      .post('/api/membership/forgot-password/reset-password')
      .send({
        resetToken: res.body.resetToken,
        newPassword: newPassword,
        confirmPassword: newPassword,
      });

    assert.strictEqual(changeRes.status, 200);
    assert.strictEqual(changeRes.body.success, true);
  });

  test('Test D4: Verify old password fails and new password succeeds', async () => {
    // Old password should fail
    const oldLoginRes = await request(app)
      .post('/api/membership/login')
      .send({
        identifier: testMemberEmail,
        password: testPassword,
      });
    assert.strictEqual(oldLoginRes.status, 401);

    // New password should succeed
    const newLoginRes = await request(app)
      .post('/api/membership/login')
      .send({
        identifier: testMemberEmail,
        password: newPassword,
      });
    assert.strictEqual(newLoginRes.status, 200);
    assert.ok(newLoginRes.body.token);
    memberToken = newLoginRes.body.token; // Update token with new session
  });

  // --------------------------------------------------------------------------
  // TEST E: Security Boundaries & Rate Limiting
  // --------------------------------------------------------------------------
  test('Test E1: Reject invalid OTP and track attempts', async () => {
    // Request a fresh OTP
    await request(app)
      .post('/api/membership/resend-otp')
      .send({ mobile: testMemberCleanMobile, purpose: 'PROFILE_UPDATE' });

    const badRes = await request(app)
      .post('/api/membership/verify-otp')
      .send({
        mobile: testMemberCleanMobile,
        otp: '000000',
        purpose: 'PROFILE_UPDATE',
      });

    assert.strictEqual(badRes.status, 400);
    assert.match(badRes.body.error, /invalid otp/i);
  });

  test('Test E2: Prevent member token from accessing Admin endpoints', async () => {
    const res = await request(app)
      .get('/api/admin/members')
      .set('Authorization', `Bearer ${memberToken}`);

    // Must be rejected with 401 or 403 Forbidden
    assert.ok(res.status === 401 || res.status === 403);
  });

  test('Test E3: Prevent unauthenticated access to member profile', async () => {
    const res = await request(app).get('/api/membership/me');
    assert.strictEqual(res.status, 401);
  });

  // --------------------------------------------------------------------------
  // TEST F: Admin Member Management & Operations
  // --------------------------------------------------------------------------
  test('Test F1: Admin can search and filter members', async () => {
    // Search by name
    const searchRes = await request(app)
      .get('/api/admin/members?search=Ananya')
      .set('Authorization', `Bearer ${adminToken}`);

    assert.strictEqual(searchRes.status, 200);
    assert.ok(searchRes.body.members.some((m) => m.id === registeredMemberId));

    // Filter by verification status
    const verifiedRes = await request(app)
      .get('/api/admin/members?verification=VERIFIED')
      .set('Authorization', `Bearer ${adminToken}`);

    assert.strictEqual(verifiedRes.status, 200);
    assert.ok(verifiedRes.body.members.every((m) => m.isVerified === true));
  });

  test('Test F2: Admin can view single member detail with audit trail and bookings', async () => {
    const res = await request(app)
      .get(`/api/admin/members/${registeredMemberId}`)
      .set('Authorization', `Bearer ${adminToken}`);

    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.member.id, registeredMemberId);
    assert.ok(Array.isArray(res.body.bookings));
    assert.ok(Array.isArray(res.body.auditLogs));
  });

  test('Test F3: Admin can add internal notes to a member profile', async () => {
    const res = await request(app)
      .post(`/api/admin/members/${registeredMemberId}/notes`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        note: 'Devotee confirmed interest in May 2027 Full Moon batch.',
      });

    assert.strictEqual(res.status, 200);
    assert.match(res.body.member.internalNotes, /May 2027 Full Moon batch/);
  });

  test('Test F4: Admin can suspend and reactivate a member account', async () => {
    // Suspend
    const suspendRes = await request(app)
      .put(`/api/admin/members/${registeredMemberId}/status`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ status: 'SUSPENDED' });

    assert.strictEqual(suspendRes.status, 200);
    assert.strictEqual(suspendRes.body.member.status, 'SUSPENDED');

    // Suspended member cannot log in
    const loginAttempt = await request(app)
      .post('/api/membership/login')
      .send({
        identifier: testMemberEmail,
        password: newPassword,
      });
    assert.strictEqual(loginAttempt.status, 403);
    assert.match(loginAttempt.body.error, /suspended/i);

    // Reactivate
    const activateRes = await request(app)
      .put(`/api/admin/members/${registeredMemberId}/status`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ status: 'ACTIVE' });

    assert.strictEqual(activateRes.status, 200);
    assert.strictEqual(activateRes.body.member.status, 'ACTIVE');
  });
});
