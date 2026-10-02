/**
 * Supabase Client-side SDK Helper
 * Enforces single source of truth connecting to Supabase from the client boundary.
 * Reads VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.
 */

const SUPABASE_URL = (
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_URL) ||
  'https://qaiyooydbeyumwhnsjlk.supabase.co'
).replace(/\/$/, '');

const SUPABASE_ANON_KEY = (
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_ANON_KEY) ||
  ''
);

const STORAGE_BUCKET = (
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_STORAGE_BUCKET) ||
  'cms'
);

export const isClientSupabaseConfigured = () => {
  return Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
};

export const getClientSupabaseConfig = () => ({
  url: SUPABASE_URL,
  anonKey: SUPABASE_ANON_KEY,
  bucket: STORAGE_BUCKET
});

/**
 * Execute client-side REST call directly to Supabase with Anon Key
 */
export const supabaseClientQuery = async (table, options = {}) => {
  if (!isClientSupabaseConfigured()) {
    throw new Error('Supabase Client URL or Anon Key is missing in VITE environment variables.');
  }

  const queryParams = new URLSearchParams(options.params || {});
  const qs = queryParams.toString() ? `?${queryParams.toString()}` : '';
  const url = `${SUPABASE_URL}/rest/v1/${table}${qs}`;

  const res = await fetch(url, {
    method: options.method || 'GET',
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      'Content-Type': 'application/json',
      Prefer: options.prefer || 'return=representation',
      ...options.headers
    },
    body: options.body ? JSON.stringify(options.body) : undefined
  });

  const contentType = res.headers.get('content-type') || '';
  const data = contentType.includes('application/json') ? await res.json() : await res.text();

  if (!res.ok) {
    const errorMsg = typeof data === 'object' ? (data.message || data.error || data.hint) : data;
    throw new Error(`[Supabase Error ${res.status}]: ${errorMsg}`);
  }

  return data;
};

/**
 * Get Public URL of an asset stored in Supabase Storage
 */
export const getClientPublicAssetUrl = (path, bucket = STORAGE_BUCKET) => {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  const clean = path.replace(/^\/+/, '');
  return `${SUPABASE_URL}/storage/v1/object/public/${bucket}/${clean}`;
};

export default {
  isClientSupabaseConfigured,
  getClientSupabaseConfig,
  supabaseClientQuery,
  getClientPublicAssetUrl
};
