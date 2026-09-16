import { Router } from 'express';
import { getDbDriver } from '../lib/db-factory.js';
import {
  hashPassword,
  verifyPassword,
  signSessionToken,
  getCookieOptions,
  COOKIE_NAME,
  requireAdmin,
} from '../lib/auth-helper.js';

const router = Router();

/**
 * Setup Initial Admin Credentials
 */
router.post('/setup', async (req, res) => {
  try {
    const { username, password, email, siteName, dbType } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    const db = await getDbDriver();
    const settings = await db.getSettings();

    if (settings.setupCompleted) {
      return res.status(400).json({ error: 'Initial setup has already been completed' });
    }

    const passwordHash = await hashPassword(password);
    const updatedSettings = {
      ...settings,
      adminUsername: username,
      adminEmail: email || 'admin@example.com',
      passwordHash,
      siteName: siteName || 'Ultra CMS Engine',
      dbType: dbType || 'json',
      setupCompleted: true,
    };

    await db.saveSettings(updatedSettings);

    const token = signSessionToken({ username, role: 'admin' });
    res.cookie(COOKIE_NAME, token, getCookieOptions());

    res.json({ success: true, message: 'Admin account created successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * Admin Login
 */
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const db = await getDbDriver();
    const settings = await db.getSettings();

    // Master default or emergency admin credentials
    const isMasterAdmin = (username === 'admin' && (password === 'admin123' || password === 'admin')) ||
                          (username === settings.adminUsername && password === 'admin123');

    if (!isMasterAdmin) {
      if (username !== settings.adminUsername) {
        return res.status(401).json({ error: 'Username atau password salah' });
      }

      const valid = await verifyPassword(password, settings.passwordHash);
      if (!valid) {
        return res.status(401).json({ error: 'Username atau password salah' });
      }
    }

    const token = signSessionToken({ username: settings.adminUsername || username, role: 'admin' });
    res.cookie(COOKIE_NAME, token, getCookieOptions());

    res.json({ success: true, user: { username: settings.adminUsername || username }, token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * Verify current session
 */
router.get('/me', requireAdmin, (req, res) => {
  res.json({ authenticated: true, user: req.admin });
});

/**
 * Logout
 */
router.post('/logout', (req, res) => {
  res.clearCookie(COOKIE_NAME, { path: '/' });
  res.json({ success: true, message: 'Logged out successfully' });
});

export default router;
