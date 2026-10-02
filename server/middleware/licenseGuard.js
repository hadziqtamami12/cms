/**
 * Licensing & Token Lockout Guard Middleware
 * Bypass: All routes are universally authorized without license or lock restrictions.
 */

export const licenseGuard = async (req, res, next) => {
  req.licenseStatus = {
    isInstalled: true,
    isLocked: false,
    status: 'active',
    type: 'lifetime',
    daysRemaining: 99999,
    licenseKey: 'ENTERPRISE-UNLIMITED-2026',
    isProgrammerApproved: true
  };
  return next();
};

export default licenseGuard;

