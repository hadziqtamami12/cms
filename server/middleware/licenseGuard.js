/**
 * Licensing & Token Lockout Guard Middleware
 * Automatically intercepts incoming requests:
 * - Redirects to /install if system database or admin is not configured.
 * - Redirects to /subscription-hold if 16-character license is expired and no programmer approval exists.
 * - Allows keygen portal and installer setup endpoints to bypass lock.
 */

import { getSystemLicenseStatus } from '../services/licenseService.js';

export const licenseGuard = async (req, res, next) => {
  // Allow static files, installer, keygen, and health checks to bypass guard
  const path = req.path;
  const isBypassRoute = (
    path.startsWith('/api/installer') ||
    path.startsWith('/api/keygen') ||
    path.startsWith('/api/health') ||
    path.startsWith('/icons') ||
    path.startsWith('/assets') ||
    path === '/sw.js' ||
    path === '/manifest.json' ||
    path === '/robots.txt'
  );

  if (isBypassRoute) {
    return next();
  }

  try {
    const status = await getSystemLicenseStatus();

    // 1. Not Installed Check
    if (!status.isInstalled) {
      if (req.headers.accept?.includes('application/json') || path.startsWith('/api/')) {
        return res.status(403).json({
          success: false,
          error: 'SYSTEM_NOT_CONFIGURED',
          message: 'Setup installer has not been completed. Please run the setup wizard.',
          redirectTo: '/install'
        });
      }
      return res.redirect('/install');
    }

    // 2. Lockout State Check (Expired License & Not Programmer Approved)
    if (status.isLocked) {
      if (req.headers.accept?.includes('application/json') || path.startsWith('/api/')) {
        return res.status(402).json({
          success: false,
          error: 'SUBSCRIPTION_HOLD',
          message: 'The system license has expired or is locked. All public and admin operations are temporarily on hold.',
          redirectTo: '/subscription-hold',
          licenseStatus: status
        });
      }
      return res.redirect('/subscription-hold');
    }

    // License is active and valid
    req.licenseStatus = status;
    next();
  } catch (err) {
    console.error('[License Guard Error]', err.message);
    next();
  }
};

export default licenseGuard;
