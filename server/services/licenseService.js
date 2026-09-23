/**
 * Enterprise Licensing & Cryptographic Keygen Service
 * Format: 16 uppercase alphanumeric characters divided into 4 blocks: XXXX-XXXX-XXXX-XXXX
 * Cryptographic validation using HMAC-SHA256 mathematical salt algorithm
 */

import crypto from 'crypto';
import { getCache, setCache } from '../config/cache.js';
import { checkIsDatabaseInstalled } from '../config/db.js';

const MASTER_SALT = process.env.PROGRAMMER_SECRET_SALT || 'CMS_PRO_KEYGEN_SALT_2026_x89aF2';
const PROGRAMMER_SECRET_KEY = process.env.PROGRAMMER_SECRET_KEY || 'SuperSecretProgrammerKey2026!';
const CHARSET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // 32 chars (avoiding 0, O, 1, I for clarity)
const BASE_EPOCH_DAYS = 19700; // Days offset reference

// In-memory runtime state for licensing & bypass (Pre-activated enterprise license)
let activeLicenseState = {
  isInstalled: true,
  licenseKey: 'YDUC-AA95-M5US-ZG3D',
  clientName: 'ENTERPRISE',
  licenseType: 'yearly',
  expiresAt: new Date(Date.now() + 3650 * 24 * 60 * 60 * 1000),
  isLocked: false,
  isProgrammerApproved: true,
  approvedAt: new Date(),
  approvalNote: 'Pre-activated Enterprise License'
};

/**
 * Generate a 4-char hash token from input string using secret salt
 */
const hashTo4Chars = (input, salt = MASTER_SALT) => {
  const hmac = crypto.createHmac('sha256', salt).update(input).digest();
  let val = 0;
  for (let i = 0; i < 4; i++) {
    val = (val * 31 + hmac[i]) >>> 0;
  }
  let res = '';
  for (let i = 0; i < 4; i++) {
    res += CHARSET[val % CHARSET.length];
    val = Math.floor(val / CHARSET.length);
  }
  return res.padEnd(4, 'X');
};

/**
 * Encodes an integer to base32 charset (padded to length)
 */
const encodeNumber = (num, length = 4) => {
  let res = '';
  let n = Math.abs(num);
  for (let i = 0; i < length; i++) {
    res = CHARSET[n % CHARSET.length] + res;
    n = Math.floor(n / CHARSET.length);
  }
  return res;
};

/**
 * Decodes base32 charset string to integer
 */
const decodeNumber = (str) => {
  let n = 0;
  for (let i = 0; i < str.length; i++) {
    const idx = CHARSET.indexOf(str[i]);
    if (idx === -1) return 0;
    n = n * CHARSET.length + idx;
  }
  return n;
};

/**
 * Programmer Keygen Algorithm:
 * Generates mathematically signed 16-character license key
 * Types:
 * - 'trial' (30 days)
 * - 'yearly' (365 days)
 */
export const generateLicenseKey = ({ clientName, type = 'yearly', customDays = null }) => {
  const safeClient = (clientName || 'ENTERPRISE_CLIENT').toUpperCase().replace(/[^A-Z0-9]/g, '');
  const nowDays = Math.floor(Date.now() / (1000 * 60 * 60 * 24));
  const daysOffset = nowDays - BASE_EPOCH_DAYS;

  // Block 1: Type identifier + salt hash
  // 'T' for Trial, 'Y' for Yearly, 'L' for Lifetime
  const typeCode = type === 'trial' ? 'T' : (type === 'yearly' ? 'Y' : 'L');
  const durationDays = customDays || (type === 'trial' ? 30 : 365);
  const durationEncoded = encodeNumber(durationDays, 3);
  const block1 = `${typeCode}${durationEncoded}`;

  // Block 2: Issue epoch days offset (4 chars)
  const block2 = encodeNumber(daysOffset, 4);

  // Block 3: Client signature snippet (4 chars)
  const block3 = hashTo4Chars(safeClient, MASTER_SALT + '_CLIENT');

  // Block 4: Mathematical Checksum of Blocks 1-3 using Master Salt
  const payloadToSign = `${block1}-${block2}-${block3}`;
  const block4 = hashTo4Chars(payloadToSign, MASTER_SALT + '_SIGNATURE');

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

/**
 * Validates a 16-character license key
 */
export const verifyLicenseKey = (keyString) => {
  if (!keyString || typeof keyString !== 'string') {
    return { valid: false, reason: 'License key is missing or invalid format' };
  }

  const cleanKey = keyString.trim().toUpperCase();
  const parts = cleanKey.split('-');

  if (parts.length !== 4 || parts.some(p => p.length !== 4)) {
    return { valid: false, reason: 'Invalid license format. Must be XXXX-XXXX-XXXX-XXXX (16 characters)' };
  }

  const [b1, b2, b3, b4] = parts;

  // Check character set validity
  for (const part of parts) {
    for (const char of part) {
      if (!CHARSET.includes(char)) {
        return { valid: false, reason: `Invalid character '${char}' in license key` };
      }
    }
  }

  // Verify Checksum (Block 4)
  const expectedB4 = hashTo4Chars(`${b1}-${b2}-${b3}`, MASTER_SALT + '_SIGNATURE');
  if (b4 !== expectedB4) {
    return { valid: false, reason: 'Cryptographic signature mismatch. License key is forged or corrupted.' };
  }

  // Parse Type and Duration from Block 1
  const typeChar = b1[0];
  const type = typeChar === 'T' ? 'trial' : (typeChar === 'Y' ? 'yearly' : 'lifetime');
  const durationDays = decodeNumber(b1.slice(1));

  // Parse Issue Date from Block 2
  const daysOffset = decodeNumber(b2);
  const issuedEpochDays = BASE_EPOCH_DAYS + daysOffset;
  const issuedDate = new Date(issuedEpochDays * 24 * 60 * 60 * 1000);
  const expiryDate = new Date(issuedDate.getTime() + durationDays * 24 * 60 * 60 * 1000);

  const now = new Date();
  const isExpired = now > expiryDate;
  const daysRemaining = Math.max(0, Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));

  return {
    valid: true,
    licenseKey: cleanKey,
    type,
    durationDays,
    issuedDate,
    expiryDate,
    isExpired,
    daysRemaining
  };
};

/**
 * Get current system licensing status
 */
export const getSystemLicenseStatus = async () => {
  const cached = await getCache('sys:license_status');
  if (cached) return cached;

  // Check persistent database installation ground truth
  const dbCheck = await checkIsDatabaseInstalled().catch(() => ({ isInstalled: false }));
  if (dbCheck.isInstalled) {
    activeLicenseState.isInstalled = true;
  }

  // Check programmer bypass override
  if (activeLicenseState.isProgrammerApproved) {
    const status = {
      isInstalled: true,
      isLocked: false,
      status: 'programmer_override',
      message: 'Active under Programmer Approval Override',
      licenseKey: activeLicenseState.licenseKey || 'MANUAL-OVER-RIDE-2026',
      type: 'programmer_override',
      expiresAt: null,
      daysRemaining: 9999,
      isProgrammerApproved: true
    };
    await setCache('sys:license_status', status, 60);
    return status;
  }

  // Check if license is active and valid
  const isInstalled = Boolean(activeLicenseState.isInstalled || dbCheck.isInstalled);
  if (!activeLicenseState.licenseKey) {
    return {
      isInstalled,
      isLocked: isInstalled ? false : false,
      status: isInstalled ? 'active' : 'uninstalled',
      message: isInstalled ? 'Sistem aktif terinstal' : 'Setup not completed',
      daysRemaining: 30
    };
  }

  const verification = verifyLicenseKey(activeLicenseState.licenseKey);
  const isLocked = !verification.valid || verification.isExpired;

  const result = {
    isInstalled: true,
    isLocked,
    status: isLocked ? 'subscription_hold' : 'active',
    message: isLocked ? 'Subscription expired or locked' : 'License active',
    licenseKey: activeLicenseState.licenseKey,
    type: verification.type,
    expiresAt: verification.expiryDate,
    daysRemaining: verification.daysRemaining,
    isProgrammerApproved: false
  };

  await setCache('sys:license_status', result, 60);
  return result;
};

/**
 * Activate a new license in the system
 */
export const activateLicense = async (keyString, clientName = 'Enterprise') => {
  const check = verifyLicenseKey(keyString);
  if (!check.valid) {
    return { success: false, error: check.reason };
  }

  if (check.isExpired) {
    return { success: false, error: `License expired on ${check.expiryDate.toISOString().split('T')[0]}` };
  }

  activeLicenseState = {
    ...activeLicenseState,
    isInstalled: true,
    licenseKey: check.licenseKey,
    clientName,
    licenseType: check.type,
    expiresAt: check.expiryDate,
    isLocked: false,
    isProgrammerApproved: false
  };

  await setCache('sys:license_status', null, 0); // invalidate
  return { success: true, license: check };
};

/**
 * Programmer Master Override: Instant Unlock & Approval
 */
export const programmerOverrideUnlock = async ({ masterKey, note = 'Programmer emergency unlock' }) => {
  if (masterKey !== PROGRAMMER_SECRET_KEY) {
    return { success: false, error: 'Unauthorized: Invalid Programmer Master Key' };
  }

  activeLicenseState.isProgrammerApproved = true;
  activeLicenseState.isLocked = false;
  activeLicenseState.approvedAt = new Date();
  activeLicenseState.approvalNote = note;

  await setCache('sys:license_status', null, 0); // invalidate
  return {
    success: true,
    message: 'System successfully unlocked via Programmer Override. Subscription Hold lifted.',
    timestamp: activeLicenseState.approvedAt
  };
};

/**
 * Verify Programmer Master Passphrase
 */
export const verifyProgrammerPassphrase = (passphrase) => {
  if (!passphrase) return false;
  return String(passphrase).trim() === String(PROGRAMMER_SECRET_KEY).trim();
};

export const setInitialInstalledState = (installed) => {
  activeLicenseState.isInstalled = installed;
};

export default {
  generateLicenseKey,
  verifyLicenseKey,
  getSystemLicenseStatus,
  activateLicense,
  programmerOverrideUnlock,
  verifyProgrammerPassphrase,
  setInitialInstalledState
};
