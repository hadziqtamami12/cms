/**
 * Client-Side License Helper Utilities & Keygen Math
 */

const CHARSET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const MASTER_SALT = 'CMS_PRO_KEYGEN_SALT_2026_x89aF2';
const BASE_EPOCH_DAYS = 19700;

export const formatLicenseKey = (input = '') => {
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

const simpleHash4 = (str, salt = MASTER_SALT) => {
  let hash = 0;
  const input = str + salt;
  for (let i = 0; i < input.length; i++) {
    hash = ((hash << 5) - hash) + input.charCodeAt(i);
    hash |= 0;
  }
  let n = Math.abs(hash);
  let res = '';
  for (let i = 0; i < 4; i++) {
    res += CHARSET[n % CHARSET.length];
    n = Math.floor(n / CHARSET.length);
  }
  return res.padEnd(4, 'X');
};

const encodeNum = (num, length = 4) => {
  let res = '';
  let n = Math.abs(num);
  for (let i = 0; i < length; i++) {
    res = CHARSET[n % CHARSET.length] + res;
    n = Math.floor(n / CHARSET.length);
  }
  return res;
};

export const generateClientLicenseKey = ({ clientName = 'CLIENT', type = 'yearly', customDays = null }) => {
  const safeClient = clientName.toUpperCase().replace(/[^A-Z0-9]/g, '');
  const nowDays = Math.floor(Date.now() / (1000 * 60 * 60 * 24));
  const daysOffset = nowDays - BASE_EPOCH_DAYS;
  const typeCode = type === 'trial' ? 'T' : (type === 'yearly' ? 'Y' : 'L');
  const durationDays = customDays || (type === 'trial' ? 30 : 365);
  const block1 = `${typeCode}${encodeNum(durationDays, 3)}`;
  const block2 = encodeNum(daysOffset, 4);
  const block3 = simpleHash4(safeClient, MASTER_SALT + '_CLIENT');
  const block4 = simpleHash4(`${block1}-${block2}-${block3}`, MASTER_SALT + '_SIGNATURE');
  const licenseKey = `${block1}-${block2}-${block3}-${block4}`;

  return {
    licenseKey,
    clientName: safeClient,
    type,
    durationDays,
    issuedAt: new Date(),
    expiresAt: new Date(Date.now() + durationDays * 24 * 60 * 60 * 1000)
  };
};

export default {
  formatLicenseKey,
  isValidLicenseFormat,
  generateClientLicenseKey
};
