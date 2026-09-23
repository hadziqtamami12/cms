/**
 * Client-Side License Helper Utilities
 */

export const formatLicenseKey = (input = '') => {
  // Strip non-alphanumeric, uppercase, chunk into 4 blocks of 4
  const cleaned = input.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 16);
  const parts = [];
  for (let i = 0; i < cleaned.length; i += 4) {
    parts.push(cleaned.slice(i, i + 4));
  }
  return parts.join('-');
};

export const isValidLicenseFormat = (key) => {
  if (!key) return false;
  const parts = key.trim().toUpperCase().split('-');
  return parts.length === 4 && parts.every(p => p.length === 4 && /^[A-Z0-9]{4}$/.test(p));
};
