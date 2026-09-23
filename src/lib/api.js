/**
 * Frontend API Client with Automatic Lockout & Installer Redirection
 */

const API_BASE = '/api';

export const fetchConfig = async () => {
  try {
    const res = await fetch(`${API_BASE}/config`);
    const data = await res.json();
    return data;
  } catch (err) {
    console.warn('[API Client] fetchConfig fallback:', err.message);
    return { success: false, error: err.message };
  }
};

export const submitLead = async (leadData) => {
  const res = await fetch(`${API_BASE}/leads`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(leadData)
  });
  return await res.json();
};

export const adminLogin = async (username, password) => {
  const res = await fetch(`${API_BASE}/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  return await res.json();
};

export const switchTheme = async ({ industry, themeId, bottomNavStyle, token }) => {
  const res = await fetch(`${API_BASE}/admin/theme/switch`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ industry, themeId, bottomNavStyle })
  });
  return await res.json();
};

export const updateSeoMarketing = async (seoData, token) => {
  const res = await fetch(`${API_BASE}/admin/seo-marketing`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ seo: seoData })
  });
  return await res.json();
};

export const updateAdminSlug = async (newSlug, token) => {
  const res = await fetch(`${API_BASE}/admin/slug`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ newSlug })
  });
  return await res.json();
};

export const testInstallerDb = async (params) => {
  const res = await fetch(`${API_BASE}/installer/test-db`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params)
  });
  return await res.json();
};

export const completeInstaller = async (params) => {
  const res = await fetch(`${API_BASE}/installer/complete`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params)
  });
  return await res.json();
};

export const programmerKeygenLogin = async (masterKey) => {
  const res = await fetch(`${API_BASE}/keygen/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ masterKey })
  });
  return await res.json();
};

export const generateKeygenLicense = async (params, masterKey) => {
  const res = await fetch(`${API_BASE}/keygen/generate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-programmer-key': masterKey
    },
    body: JSON.stringify(params)
  });
  return await res.json();
};

export const emergencyOverrideUnlock = async (masterKey, note) => {
  const res = await fetch(`${API_BASE}/keygen/override-unlock`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-programmer-key': masterKey
    },
    body: JSON.stringify({ masterKey, note })
  });
  return await res.json();
};

export default {
  fetchConfig,
  submitLead,
  adminLogin,
  switchTheme,
  updateSeoMarketing,
  updateAdminSlug,
  testInstallerDb,
  completeInstaller,
  programmerKeygenLogin,
  generateKeygenLicense,
  emergencyOverrideUnlock
};
