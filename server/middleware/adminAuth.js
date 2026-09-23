/**
 * Admin Authentication & Session Middleware
 */

import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'SUPER_SECURE_ADMIN_JWT_SECRET_2026';

export const generateAdminToken = (user) => {
  return jwt.sign(
    {
      id: user.id || 'superadmin-1',
      username: user.username || 'admin',
      role: 'superadmin'
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
};

export const adminAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : req.cookies?.admin_token;

  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'UNAUTHORIZED',
      message: 'Authentication token missing or invalid'
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.admin = decoded;
    next();
  } catch (err) {
    return res.status(403).json({
      success: false,
      error: 'INVALID_TOKEN',
      message: 'Session expired or token invalid. Please log in again.'
    });
  }
};

export default { adminAuth, generateAdminToken };
