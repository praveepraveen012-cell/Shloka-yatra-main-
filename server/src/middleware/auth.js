import jwt from 'jsonwebtoken';
import prisma from '../prisma.js';

export const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required. Please sign in.' });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'shlloka_yatra_secure_production_secret_key_2027_kailash'
    );
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, email: true, name: true, role: true, phone: true },
    });

    if (!user) {
      return res.status(401).json({ error: 'Invalid or expired session. User not found.' });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Invalid or expired access token.' });
  }
};

export const requireAdmin = (req, res, next) => {
  const allowed = ['SUPER_ADMIN', 'ADMIN'];
  if (!req.user || !allowed.includes(req.user.role)) {
    return res.status(403).json({ error: 'Administrative privilege required.' });
  }
  next();
};

export const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required.' });
    }
    // SUPER_ADMIN has master privileges
    if (req.user.role === 'SUPER_ADMIN') {
      return next();
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        error: `Insufficient permissions. Required role: ${roles.join(' or ')}. Your role: ${req.user.role}`,
      });
    }
    next();
  };
};
