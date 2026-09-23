/**
 * Licensing & Token Lockout Guard Middleware
 * Automatically intercepts incoming requests:
 * - Redirects to /install if system database or admin is not configured.
 * - Redirects to /subscription-hold if 16-character license is expired and no programmer approval exists.
 * - Allows keygen portal and installer setup endpoints to bypass lock.
 */

import { getSystemLicenseStatus } from '../services/licenseService.js';

export const licenseGuard = async (req, res, next) => {
  // Normalize full path (from req.originalUrl) and relative mount path (req.path)
  const fullPath = (req.originalUrl?.split('?')[0] || (req.baseUrl || '') + (req.path || '')).toLowerCase();
  const path = (req.path || '').toLowerCase();

  // Allow static files, installer, keygen, health checks, public config, settings, and authenticated admin calls to bypass guard
  const isBypassRoute = (
    fullPath === '/api/config' || path === '/config' ||
    fullPath === '/api/settings/public' || path === '/settings/public' ||
    fullPath.startsWith('/api/settings') || path.startsWith('/settings') ||
    fullPath.startsWith('/api/admin') || path.startsWith('/admin') ||
    fullPath.startsWith('/api/installer') || path.startsWith('/installer') ||
    fullPath.startsWith('/api/keygen') || path.startsWith('/keygen') ||
    fullPath.startsWith('/api/health') || path.startsWith('/health') ||
    fullPath.startsWith('/api/media') || path.startsWith('/media') ||
    fullPath.startsWith('/icons') || path.startsWith('/icons') ||
    fullPath.startsWith('/assets') || path.startsWith('/assets') ||
    fullPath === '/sw.js' || path === '/sw.js' ||
    fullPath === '/manifest.json' || path === '/manifest.json' ||
    fullPath === '/robots.txt' || path === '/robots.txt' ||
    Boolean(req.headers.authorization) // Authenticated admin calls never blocked
  );

  if (isBypassRoute) {
    return next();
  }

  try {
    const status = await getSystemLicenseStatus();

    // 1. Not Installed Check
    if (!status.isInstalled) {
      if (req.headers.accept?.includes('application/json') || fullPath.startsWith('/api/') || path.startsWith('/api/')) {
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
