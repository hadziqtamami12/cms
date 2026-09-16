/**
 * Client API utility with error handling and credentials support
 */

const API_BASE = '/api';

export async function fetchPublicPage(slug = 'home') {
  const normalized = slug === 'home' || slug === '' ? 'home' : slug;
  const res = await fetch(`${API_BASE}/pages/public/${normalized}`, {
    headers: { 'Accept': 'application/json' },
  });
  if (!res.ok) {
    if (res.status === 404) return null;
    throw new Error(`Failed to load page (${res.status})`);
  }
  return await res.json();
}

const TOKEN_KEY = 'ultra_admin_token';

function getAuthHeaders(extra = {}) {
  const token = typeof window !== 'undefined' ? localStorage.getItem(TOKEN_KEY) : null;
  return {
    ...extra,
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
  };
}

export async function fetchAdminPages() {
  const res = await fetch(`${API_BASE}/pages`, {
    headers: getAuthHeaders(),
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Failed to fetch pages');
  return await res.json();
}

export async function saveAdminPage(pageData) {
  const method = pageData.id ? 'PUT' : 'POST';
  const url = pageData.id ? `${API_BASE}/pages/${pageData.id}` : `${API_BASE}/pages`;
  const res = await fetch(url, {
    method,
    headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
    credentials: 'include',
    body: JSON.stringify(pageData),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || 'Failed to save page');
  }
  return await res.json();
}

export async function deleteAdminPage(id) {
  const res = await fetch(`${API_BASE}/pages/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Failed to delete page');
  return await res.json();
}

export async function importDirectJson(jsonPayload, apiKey = '') {
  const headers = getAuthHeaders({ 'Content-Type': 'application/json' });
  if (apiKey) headers['x-api-key'] = apiKey;

  const res = await fetch(`${API_BASE}/import`, {
    method: 'POST',
    headers,
    credentials: 'include',
    body: typeof jsonPayload === 'string' ? jsonPayload : JSON.stringify(jsonPayload),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || 'Import failed');
  }
  return await res.json();
}

export async function checkAuthStatus() {
  try {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: getAuthHeaders(),
      credentials: 'include',
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function loginAdmin(username, password) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ username, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Login failed');
  if (data.token) {
    localStorage.setItem(TOKEN_KEY, data.token);
  }
  return data;
}

export async function logoutAdmin() {
  localStorage.removeItem(TOKEN_KEY);
  await fetch(`${API_BASE}/auth/logout`, {
    method: 'POST',
    headers: getAuthHeaders(),
    credentials: 'include',
  });
}

export async function getSystemSettings() {
  const res = await fetch(`${API_BASE}/settings`);
  if (!res.ok) throw new Error('Failed to load settings');
  return await res.json();
}

export const getSettings = getSystemSettings;

export async function updateSystemSettings(settings) {
  const res = await fetch(`${API_BASE}/settings`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(settings),
  });
  if (!res.ok) throw new Error('Failed to update settings');
  return await res.json();
}

export const updateSettings = updateSystemSettings;

export async function testDatabaseConnection(dbType, config) {
  const res = await fetch(`${API_BASE}/settings/test-db`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ dbType, config }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Connection test failed');
  return data;
}

export async function setupInitialAdmin(setupData) {
  const res = await fetch(`${API_BASE}/auth/setup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(setupData),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Setup failed');
  return data;
}

export async function fetchAdminPosts() {
  const res = await fetch(`${API_BASE}/posts`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error('Gagal mengambil daftar artikel');
  return await res.json();
}

export async function saveAdminPost(postData) {
  const isEdit = Boolean(postData.id);
  const method = isEdit ? 'PUT' : 'POST';
  const url = isEdit ? `${API_BASE}/posts/${postData.id}` : `${API_BASE}/posts`;
  const res = await fetch(url, {
    method,
    headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
    credentials: 'include',
    body: JSON.stringify(postData),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Gagal menyimpan artikel');
  return data;
}

export async function deleteAdminPost(id) {
  const res = await fetch(`${API_BASE}/posts/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
    credentials: 'include',
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Gagal menghapus artikel');
  return data;
}
