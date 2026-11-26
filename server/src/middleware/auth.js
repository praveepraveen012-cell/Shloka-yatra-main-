import jwt from 'jsonwebtoken';
import prisma from '../prisma.js';
import { JWT_SECRET } from '../config/jwt.js';

export const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required. Please sign in.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    if (!decoded || !decoded.userId) {
      return res.status(403).json({ error: 'Administrative privilege required. User session is not staff/admin.' });
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, email: true, name: true, role: true, phone: true },
    });

    if (!user) {
      return res.status(401).json({ error: 'Invalid or expired session. User not found.' });
    }

    req.user = user;
    req.isAdmin = true;
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Invalid or expired access token.' });
  }
};

export const authenticateUserOrMember = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Authentication required. Please sign in.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

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
    return res.status(403).json({ error: 'Invalid or expired authentication token.' });
  }
};

export const optionalUserOrMember = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    req.user = null;
    req.member = null;
    req.isAdmin = false;
    return next();
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
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
    if (decoded.memberId) {
      const member = await prisma.member.findUnique({
        where: { id: decoded.memberId },
        select: { id: true, email: true, firstName: true, lastName: true, status: true },
      });
      if (member && member.status !== 'SUSPENDED') {
        req.member = member;
        req.isAdmin = false;
        return next();
      }
    }
  } catch (err) {
    // Ignore invalid token in optional auth
  }

  req.user = null;
  req.member = null;
  req.isAdmin = false;
  next();
};

export const requireAdmin = (req, res, next) => {
  const allowed = ['SUPER_ADMIN'];
  if (!req.user || !allowed.includes(req.user.role)) {
    return res.status(403).json({ error: 'Super Admin privilege required. Access restricted.' });
  }
  next();
};

export const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required.' });
    }
    // SUPER_ADMIN has master privileges and is the sole administrative role
    if (req.user.role === 'SUPER_ADMIN') {
      return next();
    }
    return res.status(403).json({
      error: 'Insufficient permissions. Super Admin privilege required.',
    });
  };
};
