import { test, describe } from 'node:test';
import assert from 'node:assert';
import request from 'supertest';
import app from '../src/index.js';
import prisma from '../src/prisma.js';
import { bootstrapAdmin, ADMIN_TEMPORARY_PASSWORD } from '../src/bootstrap.js';

describe('Official Document Management System Master Suite (SYPL-RISK-2027 & SYPL-MED-2027)', async () => {
  await bootstrapAdmin();

  let adminToken = '';
  let member1Token = '';
  let member1Id = '';
  let member2Token = '';
  let member2Id = '';
  let booking1 = null;
  let booking2 = null;
  let traveller1 = null;
  let traveller2 = null;
  let riskSubmissionId = '';
  let medSubmissionId = '';
  let insSubmissionId = '';

  const testPdfBase64 =
    'data:application/pdf;base64,JVBERi0xLjQKJeLjz9MKMSAwIG9iajw8L1R5cGUvQ2F0YWxvZy9QYWdlcyAyIDAgUj4+ZW5kb2JqCjIgMCBvYmo8PC9UeXBlL1BhZ2VzL0tpZHNbMyAwIFJdL0NvdW50IDE+PmVuZG9iagozIDAgb2JqPDwvVHlwZS9QYWdlL1BhcmVudCAyIDAgUi9NZWRpYUJveFswIDAgNjEyIDc5Ml0+PmVuZG9iagp4cmVmCjAgNAowMDAwMDAwMDAwIDY1NTM1IGYgCjAwMDAwMDAwMTUgMDAwMDAgbiAKMDAwMDAwMDA2MCAwMDAwMCBuIAowMDAwMDAwMTE1IDAwMDAwIG4gCnRyYWlsZXIKPDwvU2l6ZSA0L1Jvb3QgMSAwIFI+PgpzdGFydHhyZWYKMTc1CiUlRU9GCg==';

  test('0. Setup: Authenticate Admin & Register Two Separate Devotee Members', async () => {
    // 1. Admin login
    const adminRes = await request(app).post('/api/auth/login').send({
      email: 'admin@shloka.com',
      password: ADMIN_TEMPORARY_PASSWORD,
    });
    assert.strictEqual(adminRes.status, 200);
    adminToken = adminRes.body.token;

    // 2. Member 1 registration
    const mem1Email = `devotee.doc1.${Date.now()}@example.com`;
    const mem1Res = await request(app).post('/api/membership/register').send({
      firstName: 'Ramesh',
      lastName: 'Sharma',
      email: mem1Email,
      mobile: `9876${Math.floor(100000 + Math.random() * 900000)}`,
      password: 'DevoteePassword@2027',
      confirmPassword: 'DevoteePassword@2027',
      nationality: 'Indian',
      country: 'India',
      acceptTerms: true,
      acceptPrivacy: true,
    });
    assert.strictEqual(mem1Res.status, 201);
    member1Token = mem1Res.body.token;
    member1Id = mem1Res.body.member.id;

    // 3. Member 2 registration
    const mem2Email = `devotee.doc2.${Date.now()}@example.com`;
    const mem2Res = await request(app).post('/api/membership/register').send({
      firstName: 'Priya',
      lastName: 'Patel',
      email: mem2Email,
      mobile: `9875${Math.floor(100000 + Math.random() * 900000)}`,
      password: 'DevoteePassword@2027',
      confirmPassword: 'DevoteePassword@2027',
      nationality: 'Indian',
      country: 'India',
      acceptTerms: true,
      acceptPrivacy: true,
    });
    assert.strictEqual(mem2Res.status, 201);
    member2Token = mem2Res.body.token;
    member2Id = mem2Res.body.member.id;

    // 4. Fetch route & departure for real booking creation
    const departuresRes = await request(app).get('/api/departures');
    const departure = departuresRes.body.departures[0];
    const routesRes = await request(app).get('/api/routes');
    const route = routesRes.body.routes[0];

    // 5. Create Booking 1 for Member 1
    const b1Res = await request(app).post('/api/bookings').send({
      routeId: route.id,
      departureId: departure.id,
      passportType: 'INDIAN',
      contactName: 'Ramesh Sharma',
      contactEmail: mem1Email,
      contactPhone: '+91 9876543210',
      notes: 'Devotee pilgrimage 2027',
      travellers: [
        {
          fullName: 'Ramesh Sharma',
          passportNumber: 'Z9876543',
          nationality: 'Indian',
          age: 48,
          gender: 'MALE',
          dietaryPreference: 'PURE_VEGETARIAN',
          emergencyContactName: 'Sunita Sharma',
          emergencyContactPhone: '+91 9876543211',
          emergencyContactRelationship: 'SPOUSE',
        },
      ],
    });
    assert.strictEqual(b1Res.status, 201);
    booking1 = b1Res.body.booking;
    traveller1 = booking1.travellers[0];

    // 6. Create Booking 2 for Member 2
    const b2Res = await request(app).post('/api/bookings').send({
      routeId: route.id,
      departureId: departure.id,
      passportType: 'INDIAN',
      contactName: 'Priya Patel',
      contactEmail: mem2Email,
      contactPhone: '+91 9875543210',
      notes: 'Devotee pilgrimage 2027',
      travellers: [
        {
          fullName: 'Priya Patel',
          passportNumber: 'K1234567',
          nationality: 'Indian',
          age: 38,
          gender: 'FEMALE',
          dietaryPreference: 'PURE_VEGETARIAN',
          emergencyContactName: 'Anil Patel',
          emergencyContactPhone: '+91 9875543211',
          emergencyContactRelationship: 'BROTHER',
        },
      ],
    });
    assert.strictEqual(b2Res.status, 201);
    booking2 = b2Res.body.booking;
    traveller2 = booking2.travellers[0];
  });

  // -------------------------------------------------------------
  // Test Suite 1: Document Versioning & Template Downloads
  // -------------------------------------------------------------
  test('1. Document Templates API returns Draft 1.0 specifications', async () => {
    const res = await request(app).get('/api/documents/templates');
    assert.strictEqual(res.status, 200);
    assert.ok(Array.isArray(res.body.templates));

    const medTemplate = res.body.templates.find((t) => t.documentRef === 'SYPL-MED-2027');
    const riskTemplate = res.body.templates.find((t) => t.documentRef === 'SYPL-RISK-2027');

    assert.ok(medTemplate, 'SYPL-MED-2027 template must exist');
    assert.strictEqual(medTemplate.version, 'Draft 1.0 – 23 November 2026');
    assert.strictEqual(medTemplate.lifecycleStatus, 'DRAFT');
    assert.strictEqual(medTemplate.isApproved, false);

    assert.ok(riskTemplate, 'SYPL-RISK-2027 template must exist');
    assert.strictEqual(riskTemplate.version, 'Draft 1.0 – 23 November 2026');
    assert.strictEqual(riskTemplate.lifecycleStatus, 'DRAFT');
    assert.strictEqual(riskTemplate.isApproved, false);
  });

  test('2. Member can download official PDF templates for SYPL-MED-2027 and SYPL-RISK-2027', async () => {
    const medPdfRes = await request(app).get('/api/documents/templates/SYPL-MED-2027/download');
    assert.strictEqual(medPdfRes.status, 200);
    assert.strictEqual(medPdfRes.headers['content-type'], 'application/pdf');

    const riskPdfRes = await request(app).get('/api/documents/templates/SYPL-RISK-2027/download');
    assert.strictEqual(riskPdfRes.status, 200);
    assert.strictEqual(riskPdfRes.headers['content-type'], 'application/pdf');
  });

  // -------------------------------------------------------------
  // Test Suite 2: Test A – Risk Declaration Workflow
  // -------------------------------------------------------------
  test('3. Booking compliance checklist shows PENDING_SUBMISSION for new booking', async () => {
    const res = await request(app)
      .get(`/api/documents/booking/${booking1.id}/requirements`)
      .set('Authorization', `Bearer ${member1Token}`);

    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.bookingId, booking1.id);
    const reqs = res.body.participantRequirements[0].requirements;
    assert.strictEqual(reqs.riskDeclaration.status, 'PENDING_SUBMISSION');
    assert.strictEqual(reqs.medicalCertificate.status, 'PENDING_SUBMISSION');
    assert.strictEqual(reqs.insuranceProof.status, 'PENDING_SUBMISSION');
  });

  test('4. Risk declaration submission rejects incomplete page initials or missing acknowledgements', async () => {
    // Missing page initials (only 4 instead of 5)
    const badRes1 = await request(app)
      .post('/api/documents/risk-declaration/submit')
      .set('Authorization', `Bearer ${member1Token}`)
      .send({
        bookingId: booking1.id,
        travellerId: traveller1.id,
        pageInitials: ['RS', 'RS', 'RS', 'RS'], // Length 4, requires 5
        acknowledgements: {
          ack1_extreme_altitude: true,
          ack2_medical_conditions: true,
          ack3_insurance_mandatory: true,
          ack4_leader_authority: true,
          ack5_evacuation_costs: true,
          ack6_uncertainties: true,
          ack7_limited_indemnity: true,
          ack8_read_all_pages: true,
        },
        signerName: 'Ramesh Sharma',
        signaturePlace: 'New Delhi, India',
      });
    assert.strictEqual(badRes1.status, 400);

    // Missing required acknowledgement #7
    const badRes2 = await request(app)
      .post('/api/documents/risk-declaration/submit')
      .set('Authorization', `Bearer ${member1Token}`)
      .send({
        bookingId: booking1.id,
        travellerId: traveller1.id,
        pageInitials: ['RS', 'RS', 'RS', 'RS', 'RS'],
        acknowledgements: {
          ack1_extreme_altitude: true,
          ack2_medical_conditions: true,
          ack3_insurance_mandatory: true,
          ack4_leader_authority: true,
          ack5_evacuation_costs: true,
          ack6_uncertainties: true,
          ack7_limited_indemnity: false, // Falsified / Unchecked
          ack8_read_all_pages: true,
        },
        signerName: 'Ramesh Sharma',
        signaturePlace: 'New Delhi, India',
      });
    assert.strictEqual(badRes2.status, 400);
  });

  test('5. Test A: Member successfully submits 5-page Risk Declaration (SYPL-RISK-2027)', async () => {
    const res = await request(app)
      .post('/api/documents/risk-declaration/submit')
      .set('Authorization', `Bearer ${member1Token}`)
      .send({
        bookingId: booking1.id,
        travellerId: traveller1.id,
        pageInitials: ['RS', 'RS', 'RS', 'RS', 'RS'],
        acknowledgements: {
          ack1_extreme_altitude: true,
          ack2_medical_conditions: true,
          ack3_insurance_mandatory: true,
          ack4_leader_authority: true,
          ack5_evacuation_costs: true,
          ack6_uncertainties: true,
          ack7_limited_indemnity: true,
          ack8_read_all_pages: true,
        },
        signerName: 'Ramesh Chandra Sharma',
        signerRelationship: 'SELF',
        signaturePlace: 'New Delhi, India',
        signatureDate: '2026-11-23',
        witnessName: 'Sunita Sharma',
        witnessPhone: '+91 9876543211',
        emergencyContact: {
          name: 'Sunita Sharma',
          relationship: 'SPOUSE',
          phone: '+91 9876543211',
        },
      });

    assert.strictEqual(res.status, 201);
    assert.strictEqual(res.body.submission.documentRef, 'SYPL-RISK-2027');
    assert.strictEqual(res.body.submission.status, 'SUBMITTED');
    assert.strictEqual(res.body.submission.versionNumber, 1);
    riskSubmissionId = res.body.submission.id;
  });

  // -------------------------------------------------------------
  // Test Suite 3: Test B – Medical Certificate Workflow
  // -------------------------------------------------------------
  test('6. Test B: Member uploads doctor-certified Medical Certificate (SYPL-MED-2027)', async () => {
    const res = await request(app)
      .post('/api/documents/medical-certificate/upload')
      .set('Authorization', `Bearer ${member1Token}`)
      .send({
        bookingId: booking1.id,
        travellerId: traveller1.id,
        documentRef: 'SYPL-MED-2027',
        version: 'Draft 1.0 – 23 November 2026',
        fileData: testPdfBase64,
        originalFilename: 'Dr_Amit_Sharma_Stamped_Certificate.pdf',
        formData: {
          doctorName: 'Dr. Amit K. Verma, MD',
          doctorRegistrationNumber: 'MCI / DMC 45892',
          doctorClinic: 'Apollo Hospital',
          doctorCity: 'New Delhi',
          medicalClearanceDecision: 'FIT',
        },
      });

    assert.strictEqual(res.status, 201);
    assert.strictEqual(res.body.submission.documentRef, 'SYPL-MED-2027');
    assert.strictEqual(res.body.submission.status, 'SUBMITTED');
    medSubmissionId = res.body.submission.id;

    // Strict clinical check: Traveller.medicalFitnessCertified must still be false until Admin verifies!
    const travellerDb = await prisma.traveller.findUnique({ where: { id: traveller1.id } });
    assert.strictEqual(
      travellerDb.medicalFitnessCertified,
      false,
      'Uploading a medical form must never auto-certify medical fitness without admin clinical verification!'
    );
  });

  test('7. Admin reviews and ACCEPTS the Medical Certificate, clinically certifying the participant', async () => {
    const res = await request(app)
      .put(`/api/documents/admin/${medSubmissionId}/review`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        action: 'ACCEPT',
        reviewNote: 'Physician registration MCI 45892 verified. Doctor stamp authenticated across photo edge.',
        clinicalObservation: 'SpO2 98%, BP 120/80, normal resting cardio-pulmonary exam.',
      });

    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.submission.status, 'ACCEPTED');

    // Verification check in database
    const updatedTraveller = await prisma.traveller.findUnique({ where: { id: traveller1.id } });
    assert.strictEqual(updatedTraveller.medicalFitnessCertified, true);
    assert.strictEqual(updatedTraveller.docVerificationStatus, 'VERIFIED');
  });

  // -------------------------------------------------------------
  // Test Suite 4: Test C – Clarification and Resubmission
  // -------------------------------------------------------------
  test('8. Test C: Member uploads Insurance Proof (SYPL-INS-2027)', async () => {
    const res = await request(app)
      .post('/api/documents/insurance-proof/upload')
      .set('Authorization', `Bearer ${member1Token}`)
      .send({
        bookingId: booking1.id,
        travellerId: traveller1.id,
        insuranceProvider: 'TATA AIG Travel Guard',
        policyNumber: 'TAG-8492048291',
        emergencyAssistancePhone: '+91 22 6693 8000',
        fileData: testPdfBase64,
        originalFilename: 'Travel_Insurance_Schedule.pdf',
      });

    assert.strictEqual(res.status, 201);
    assert.strictEqual(res.body.submission.status, 'SUBMITTED');
    insSubmissionId = res.body.submission.id;
  });

  test('9. Admin requests clarification on insurance proof (requires mandatory note)', async () => {
    // Attempt without note -> rejected with 400
    const failRes = await request(app)
      .put(`/api/documents/admin/${insSubmissionId}/review`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        action: 'REQUEST_CLARIFICATION',
        reviewNote: '', // Missing note
      });
    assert.strictEqual(failRes.status, 400);

    // With mandatory note
    const successRes = await request(app)
      .put(`/api/documents/admin/${insSubmissionId}/review`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        action: 'REQUEST_CLARIFICATION',
        reviewNote: 'Policy schedule does not state coverage for high altitude above 5,000m. Please upload altitude endorsement rider.',
      });
    assert.strictEqual(successRes.status, 200);
    assert.strictEqual(successRes.body.submission.status, 'CLARIFICATION_REQUIRED');
  });

  test('10. Member resubmits insurance proof, creating version 2 while preserving history', async () => {
    const res = await request(app)
      .post('/api/documents/insurance-proof/upload')
      .set('Authorization', `Bearer ${member1Token}`)
      .send({
        bookingId: booking1.id,
        travellerId: traveller1.id,
        insuranceProvider: 'TATA AIG High Altitude Rider',
        policyNumber: 'TAG-8492048291-HA',
        emergencyAssistancePhone: '+91 22 6693 8000',
        fileData: testPdfBase64,
        originalFilename: 'Travel_Insurance_Altitude_Endorsement.pdf',
      });

    assert.strictEqual(res.status, 201);
    assert.strictEqual(res.body.submission.versionNumber, 2);
    assert.strictEqual(res.body.submission.isCurrentVersion, true);
    assert.strictEqual(res.body.submission.replacedSubmissionId, insSubmissionId);

    // Check old submission is preserved but marked isCurrentVersion: false
    const oldSub = await prisma.documentSubmission.findUnique({ where: { id: insSubmissionId } });
    assert.strictEqual(oldSub.isCurrentVersion, false);
    assert.strictEqual(oldSub.versionNumber, 1);

    // Admin accepts replacement version
    const acceptRes = await request(app)
      .put(`/api/documents/admin/${res.body.submission.id}/review`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        action: 'ACCEPT',
        reviewNote: 'Altitude endorsement up to 6,000m verified.',
      });
    assert.strictEqual(acceptRes.status, 200);
    assert.strictEqual(acceptRes.body.submission.status, 'ACCEPTED');
  });

  // -------------------------------------------------------------
  // Test Suite 5: Test D – Security & Privacy Access Control
  // -------------------------------------------------------------
  test('11. Test D: Unauthenticated request to download file returns 401', async () => {
    const res = await request(app).get(`/api/documents/${medSubmissionId}/download`);
    assert.strictEqual(res.status, 401);
  });

  test('12. Test D: Member 2 cannot access Member 1 sensitive medical document (403 Forbidden)', async () => {
    const res = await request(app)
      .get(`/api/documents/${medSubmissionId}/download`)
      .set('Authorization', `Bearer ${member2Token}`);
    assert.strictEqual(res.status, 403);
  });

  test('13. Test D: Member 1 can access own document and download streams file', async () => {
    const res = await request(app)
      .get(`/api/documents/${medSubmissionId}/download`)
      .set('Authorization', `Bearer ${member1Token}`);
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.headers['content-type'], 'application/pdf');
  });

  test('14. Test D: Admin can access any document and action is recorded in AuditLog', async () => {
    const res = await request(app)
      .get(`/api/documents/${medSubmissionId}/download`)
      .set('Authorization', `Bearer ${adminToken}`);
    assert.strictEqual(res.status, 200);

    const audit = await prisma.auditLog.findFirst({
      where: { action: 'DOWNLOAD_DOCUMENT_FILE', entityId: medSubmissionId },
      orderBy: { createdAt: 'desc' },
    });
    assert.ok(audit);
    assert.strictEqual(audit.userEmail, 'admin@shloka.com');
  });

  // -------------------------------------------------------------
  // Test Suite 6: Member Dashboard & Admin Booking Integration
  // -------------------------------------------------------------
  test('15. Member Dashboard My Documents endpoint returns cards with accurate review state', async () => {
    const res = await request(app)
      .get('/api/documents/my-documents')
      .set('Authorization', `Bearer ${member1Token}`);

    assert.strictEqual(res.status, 200);
    assert.ok(Array.isArray(res.body.bookings));
    const b = res.body.bookings.find((item) => item.id === booking1.id);
    assert.ok(b);

    const cards = b.travellers[0].cards;
    const medCard = cards.find((c) => c.type === 'MEDICAL_CERTIFICATE');
    assert.strictEqual(medCard.status, 'ACCEPTED');
    assert.strictEqual(medCard.isCertified, true);
  });

  test('16. Admin Booking Detail includes documentSubmissions compliance checklist', async () => {
    const res = await request(app)
      .get(`/api/admin/bookings/${booking1.id}`)
      .set('Authorization', `Bearer ${adminToken}`);

    assert.strictEqual(res.status, 200);
    assert.ok(Array.isArray(res.body.booking.documentSubmissions));
    assert.ok(res.body.booking.documentSubmissions.length >= 2);
  });
});
