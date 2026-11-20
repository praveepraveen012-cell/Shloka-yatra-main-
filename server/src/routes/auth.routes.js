import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import prisma from '../prisma.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

const loginSchema = z.object({
  email: z.string().min(1, 'Username or email is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = loginSchema.parse(req.body);

    const input = email.trim().toLowerCase();
    const resolvedEmail = input.includes('@') ? input : `${input}@shloka.com`;

    let user = await prisma.user.findUnique({
      where: { email: resolvedEmail },
    });

    if (!user) {
      const altEmail = resolvedEmail.includes('@shlloka.com')
        ? resolvedEmail.replace('@shlloka.com', '@shloka.com')
        : resolvedEmail.replace('@shloka.com', '@shlloka.com');
      user = await prisma.user.findUnique({
        where: { email: altEmail },
      });
    }

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password credentials.' });
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid email or password credentials.' });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'shlloka_yatra_jwt_secret_dev_key_2027_secure_key',
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    // Audit login
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        userEmail: user.email,
        action: 'ADMIN_LOGIN',
        entity: 'USER',
        entityId: user.id,
        details: JSON.stringify({ ip: req.ip, userAgent: req.headers['user-agent'] }),
      },
    });

    res.json({
      message: 'Authentication successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        mustChangePassword: !!user.mustChangePassword,
      },
    });
  } catch (error) {
    next(error);
  }
});

router.post('/forgot-password', async (req, res, next) => {
  try {
    const { email } = z.object({ email: z.string().min(1) }).parse(req.body);
    const input = email.trim().toLowerCase();
    const resolvedEmail = input.includes('@') ? input : `${input}@shloka.com`;

    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: resolvedEmail },
          { email: resolvedEmail.replace('@shlloka.com', '@shloka.com') },
          { email: resolvedEmail.replace('@shloka.com', '@shlloka.com') },
        ],
      },
    });

    if (user) {
      const resetToken = jwt.sign(
        { userId: user.id, purpose: 'PASSWORD_RESET' },
        process.env.JWT_SECRET || 'shlloka_yatra_jwt_secret_dev_key_2027_secure_key',
        { expiresIn: '1h' }
      );

      await prisma.user.update({
        where: { id: user.id },
        data: {
          resetPasswordToken: resetToken,
          resetPasswordExpires: new Date(Date.now() + 3600000),
        },
      });

      await prisma.auditLog.create({
        data: {
          userId: user.id,
          userEmail: user.email,
          action: 'PASSWORD_RESET_REQUESTED',
          entity: 'USER',
          entityId: user.id,
          details: JSON.stringify({ ip: req.ip }),
        },
      });
    }

    res.json({
      message: 'If the administrative email exists, instructions have been logged to the secure audit trail.',
    });
  } catch (error) {
    next(error);
  }
});

router.get('/me', authenticateToken, async (req, res) => {
  const fullUser = await prisma.user.findUnique({
    where: { id: req.user.id },
    select: { id: true, email: true, name: true, phone: true, role: true, mustChangePassword: true },
  });
  res.json({ user: fullUser || req.user });
});

export default router;
