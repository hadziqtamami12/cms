/**
 * Installation Guard Middleware
 * Directs traffic to /setup if the system is uninstalled.
 * Protects /setup once installed.
 */

import { getDatabase } from '../config/db.js';

let isInstalledCache = null;

export async function checkInstalled() {
  if (process.env.IS_INSTALLED === 'true') {
    return true;
  }

  try {
    const db = await getDatabase();
    const installed = await db.getOption('is_installed', false);
    return Boolean(installed);
  } catch {
    return false;
  }
}

export function setInstalledCache(val) {
  isInstalledCache = Boolean(val);
}

export async function installationGuard(req, res, next) {
  // Allow health check, static assets, and sitemaps at all times
  if (
    req.path === '/api/health' ||
    req.path.startsWith('/uploads') ||
    req.path.endsWith('.xml') ||
    req.path === '/robots.txt'
  ) {
    return next();
  }

  const isInstalled = isInstalledCache !== null ? isInstalledCache : await checkInstalled();
  isInstalledCache = isInstalled;

  const isSetupRoute = req.path.startsWith('/setup') || req.path.startsWith('/api/setup');

  if (!isInstalled) {
    // If not installed, only allow setup endpoints
    if (isSetupRoute || req.path === '/api/settings/public') {
      return next();
    }
    return res.status(403).json({
      error: 'CMS is not installed yet.',
      code: 'ERR_NOT_INSTALLED',
      redirect: '/setup',
    });
  }

  // If already installed, lock down setup routes
  if (isSetupRoute && req.method === 'POST') {
    return res.status(403).json({
      error: 'System is already installed. Setup wizard is permanently locked.',
      code: 'ERR_ALREADY_INSTALLED',
    });
  }

  next();
}

export default installationGuard;
