/**
 * Dynamic Admin Slug Router Middleware
 * Allows configuring the administrative portal URL slug via ENV (ADMIN_SLUG) or DB
 * (e.g. /admin, /sys-portal, /cms-panel)
 */

let configuredAdminSlug = (process.env.ADMIN_SLUG || 'admin').replace(/^\/+|\/+$/g, '');

export const getAdminSlug = () => configuredAdminSlug;

export const setAdminSlug = (newSlug) => {
  if (newSlug) {
    configuredAdminSlug = newSlug.replace(/^\/+|\/+$/g, '');
  }
  return configuredAdminSlug;
};

export const dynamicSlugRouter = (req, res, next) => {
  const currentSlug = getAdminSlug();
  const path = req.path;

  // Provide current admin slug in request header / context
  req.adminSlug = currentSlug;

  // If request hits the dynamic admin slug (e.g. /admin, /sys-portal), flag for admin processing
  const slugPattern = new RegExp(`^\\/${currentSlug}(\\/|$)`);
  if (slugPattern.test(path)) {
    req.isAdminRoute = true;
  }

  next();
};

export default { dynamicSlugRouter, getAdminSlug, setAdminSlug };
