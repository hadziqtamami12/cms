import crypto from 'node:crypto';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'ultra-cms-production-secret-key-32bytes-long';
const COOKIE_NAME = 'ultra_admin_session';

/**
 * Fast and secure password hashing using Node native scrypt
 */
export async function hashPassword(password) {
  return new Promise((resolve, reject) => {
    const salt = crypto.randomBytes(16).toString('hex');
    crypto.scrypt(password, salt, 64, (err, derivedKey) => {
      if (err) return reject(err);
      resolve(`${salt}:${derivedKey.toString('hex')}`);
    });
  });
}

/**
 * Verify hashed password (supports both native scrypt and bcrypt)
 */
export async function verifyPassword(password, storedHash) {
  if (!storedHash) return false;

  // Support bcrypt format ($2a$, $2b$, $2y$) if encountered
  if (storedHash.startsWith('$2')) {
    try {
      const bcryptModule = await import('bcryptjs');
      const bcryptEngine = bcryptModule.default || bcryptModule;
      return await bcryptEngine.compare(password, storedHash);
    } catch {
      // bcryptjs not available
    }
  }

  return new Promise((resolve, reject) => {
    if (!storedHash.includes(':')) return resolve(false);
    const [salt, key] = storedHash.split(':');
    crypto.scrypt(password, salt, 64, (err, derivedKey) => {
      if (err) return reject(err);
      resolve(crypto.timingSafeEqual(Buffer.from(key, 'hex'), derivedKey));
    });
  });
}

/**
 * Bcrypt compatibility wrapper
 */
export const bcrypt = {
  hash: (password, rounds = 10) => hashPassword(password),
  compare: (password, hash) => verifyPassword(password, hash),
};

/**
 * Generate JWT Session Token
 */
export function signSessionToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

/**
 * Verify JWT Token
 */
export function verifySessionToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}

/**
 * Cookie options for high-security production
 */
export function getCookieOptions() {
  const isProd = process.env.NODE_ENV === 'production';
  return {
    httpOnly: true,
    secure: isProd,
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: '/',
  };
}

/**
 * Express middleware to authenticate admin requests
 */
export function requireAdmin(req, res, next) {
  const token = req.cookies?.[COOKIE_NAME] || req.headers.authorization?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized: Session missing' });
  }

  const decoded = verifySessionToken(token);
  if (!decoded) {
    return res.status(401).json({ error: 'Unauthorized: Token expired or invalid' });
  }

  req.admin = decoded;
  next();
}

export { COOKIE_NAME };
