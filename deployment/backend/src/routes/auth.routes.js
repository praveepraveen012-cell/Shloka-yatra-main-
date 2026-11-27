import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import prisma from '../prisma.js';
import { authenticateToken } from '../middleware/auth.js';
import { JWT_SECRET, JWT_EXPIRES_IN } from '../config/jwt.js';

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

    let user;
    try {
      user = await prisma.user.findUnique({
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
    } catch (dbErr) {
      console.error('Database connection error during admin login:', dbErr);
      return res.status(503).json({
        error: 'Database temporarily unavailable. Please verify database connection and try again shortly.',
      });
    }

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password credentials.' });
    }

    // Strictly enforce Super Admin role
    if (user.role !== 'SUPER_ADMIN') {
      return res.status(403).json({ error: 'Access denied: Super Admin authorization required.' });
    }

    let isValid = false;
    try {
      isValid = await bcrypt.compare(password, user.passwordHash);
    } catch (bcryptErr) {
      console.error('Password comparison error:', bcryptErr);
      return res.status(500).json({ error: 'Authentication service error during password verification.' });
    }

    if (!isValid) {
      return res.status(401).json({ error: 'Invalid email or password credentials.' });
    }

    let token;
    try {
      token = jwt.sign(
        { userId: user.id, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
      );
    } catch (jwtErr) {
      console.error('JWT token signing error:', jwtErr);
      return res.status(500).json({ error: 'Authentication service failed to generate session token.' });
    }

    // Audit login (non-fatal if audit logging fails)
    try {
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
    } catch (auditErr) {
      console.warn('Non-fatal: Failed to write audit log for admin login:', auditErr.message);
    }

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
    if (error.name === 'ZodError') {
      return res.status(400).json({
        error: 'Validation failed',
        details: error.errors.map((e) => ({
          field: e.path.join('.'),
          message: e.message,
        })),
      });
    }
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
        JWT_SECRET,
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

router.get('/me', authenticateToken, async (req, res, next) => {
  try {
    const fullUser = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { id: true, email: true, name: true, phone: true, role: true, mustChangePassword: true },
    });
    res.json({ user: fullUser || req.user });
  } catch (error) {
    next(error);
  }
});

export default router;
