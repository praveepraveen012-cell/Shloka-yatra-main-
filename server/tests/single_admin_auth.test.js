import { test, describe } from 'node:test';
import assert from 'node:assert';
import request from 'supertest';
import app from '../src/index.js';
import { bootstrapAdmin, ADMIN_TEMPORARY_PASSWORD } from '../src/bootstrap.js';

describe('Single Admin Account & Security Suite', async () => {
  await bootstrapAdmin();

  let adminToken = '';

  test('1. Admin can log in using email and temporary password', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'admin@shloka.com',
        password: ADMIN_TEMPORARY_PASSWORD,
      });

    assert.strictEqual(res.status, 200);
    assert.ok(res.body.token);
    assert.strictEqual(res.body.user.role, 'SUPER_ADMIN');
    assert.strictEqual(res.body.user.mustChangePassword, true);
    adminToken = res.body.token;
  });

  test('2. Admin can also log in using bare username "admin"', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'admin',
        password: ADMIN_TEMPORARY_PASSWORD,
      });

    assert.strictEqual(res.status, 200);
    assert.ok(res.body.token);
    assert.strictEqual(res.body.user.email, 'admin@shloka.com');
  });

  test('3. Admin can update administrative profile via PUT /api/admin/profile', async () => {
    const res = await request(app)
      .put('/api/admin/profile')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'Master Pilgrimage Admin',
        phone: '+91 6366852888',
      });

    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.user.name, 'Master Pilgrimage Admin');
  });

  test('4. Admin can change password via POST /api/admin/change-password', async () => {
    const newPass = 'Shloka#2027$PermanentPass!';
    const res = await request(app)
      .post('/api/admin/change-password')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        currentPassword: ADMIN_TEMPORARY_PASSWORD,
        newPassword: newPass,
      });

    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.user.mustChangePassword, false);

    // Verify login with new password
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'admin@shloka.com',
        password: newPass,
      });
    assert.strictEqual(loginRes.status, 200);

    // Restore temporary password so initial credentials remain tested and valid
    await request(app)
      .post('/api/admin/change-password')
      .set('Authorization', `Bearer ${loginRes.body.token}`)
      .send({
        currentPassword: newPass,
        newPassword: ADMIN_TEMPORARY_PASSWORD,
      });

    // Re-bootstrap to set mustChangePassword to true for first login
    await bootstrapAdmin();
  });
});
