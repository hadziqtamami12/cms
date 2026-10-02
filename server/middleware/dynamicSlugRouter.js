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

export const loadAdminSlugFromDb = async (queryFn) => {
  try {
    if (typeof queryFn === 'function') {
      const rows = await queryFn("SELECT admin_slug FROM admin_settings WHERE admin_slug IS NOT NULL LIMIT 1");
      if (rows && rows.length > 0 && rows[0].admin_slug) {
        setAdminSlug(rows[0].admin_slug);
      }
    }
  } catch (_) {}
};

export default { dynamicSlugRouter, getAdminSlug, setAdminSlug, loadAdminSlugFromDb };

