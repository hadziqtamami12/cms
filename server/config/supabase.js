/**
 * Supabase Server Client & Storage Adapter
 * Single Source of Truth for Supabase REST and Storage bucket operations
 * Implements graceful timeout handling, exponential retry logic, and rich error handling.
 */

const SUPABASE_URL = (process.env.SUPABASE_URL || '').replace(/\/$/, '');
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || '';
const SUPABASE_STORAGE_BUCKET = process.env.SUPABASE_STORAGE_BUCKET || 'cms';

export const isSupabaseConfigured = () => {
  return Boolean(SUPABASE_URL && (SUPABASE_SERVICE_ROLE_KEY || SUPABASE_ANON_KEY));
};

export const getSupabaseConfig = () => ({
  url: SUPABASE_URL,
  serviceKey: SUPABASE_SERVICE_ROLE_KEY,
  anonKey: SUPABASE_ANON_KEY,
  bucket: SUPABASE_STORAGE_BUCKET
});

/**
 * Execute resilient HTTP request to Supabase REST / Storage APIs
 * with exponential backoff retry and explicit error surfacing
 */
export const supabaseRequest = async (path, options = {}, retries = 3, backoffMs = 500) => {
  if (!isSupabaseConfigured()) {
    throw new Error('[Supabase] SUPABASE_URL atau SUPABASE_SERVICE_ROLE_KEY belum dikonfigurasi di .env');
  }

  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  const url = `${SUPABASE_URL}${cleanPath}`;
  const apiKey = options.useAnon ? SUPABASE_ANON_KEY : (SUPABASE_SERVICE_ROLE_KEY || SUPABASE_ANON_KEY);

  const headers = {
    apikey: apiKey,
    Authorization: `Bearer ${apiKey}`,
    ...options.headers
  };

  let lastError = null;

  for (let attempt = 1; attempt <= retries; attempt++) {
    const controller = new AbortController();
    const timeoutMs = options.timeoutMs || 12000;
    const timer = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(url, {
        ...options,
        headers,
        signal: controller.signal
      });
      clearTimeout(timer);

      const contentType = response.headers.get('content-type') || '';
      let bodyData = null;

      if (contentType.includes('application/json')) {
        bodyData = await response.json();
      } else {
        bodyData = await response.text();
      }

      if (!response.ok) {
        const errorMsg = typeof bodyData === 'object' && bodyData !== null
          ? (bodyData.message || bodyData.error || bodyData.msg || JSON.stringify(bodyData))
          : String(bodyData || `HTTP ${response.status}`);
        
        const errObj = new Error(`[Supabase API ${response.status}] ${errorMsg}`);
        errObj.status = response.status;
        errObj.code = typeof bodyData === 'object' ? (bodyData.code || bodyData.statusCode) : response.status;
        errObj.details = typeof bodyData === 'object' ? bodyData.details : null;
        errObj.hint = typeof bodyData === 'object' ? bodyData.hint : null;

        // If client error (400, 401, 403, 404, 409), don't retry, fail immediately with clear explanation
        if (response.status >= 400 && response.status < 500) {
          throw errObj;
        }

        lastError = errObj;
      } else {
        return bodyData;
      }
    } catch (err) {
      clearTimeout(timer);
      lastError = err;
      if (err.name === 'AbortError') {
        lastError = new Error(`[Supabase Timeout] Permintaan ke ${cleanPath} melebihi batas waktu ${timeoutMs}ms.`);
      }

      // If it's the last attempt or an explicit client error, stop retrying
      if (attempt === retries || (err.status && err.status >= 400 && err.status < 500)) {
        throw lastError;
      }

      // Exponential backoff
      await new Promise(r => setTimeout(r, backoffMs * Math.pow(2, attempt - 1)));
    }
  }

  throw lastError;
};

/**
 * Upload binary buffer, Uint8Array, or string to Supabase Storage Bucket
 * with automatic retries and public URL resolution
 */
export const uploadToSupabaseStorage = async ({
  bucket = SUPABASE_STORAGE_BUCKET,
  filePath,
  buffer,
  contentType = 'image/jpeg',
  upsert = true
}) => {
  if (!isSupabaseConfigured()) {
    throw new Error('[Supabase Storage] Kredensial Supabase belum lengkap di environment (.env).');
  }

  const cleanPath = filePath.replace(/^\/+/, '');
  const endpoint = `/storage/v1/object/${bucket}/${cleanPath}`;

  await supabaseRequest(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': contentType,
      'x-upsert': upsert ? 'true' : 'false'
    },
    body: buffer,
    timeoutMs: 15000
  });

  const publicUrl = `${SUPABASE_URL}/storage/v1/object/public/${bucket}/${cleanPath}`;

  return {
    success: true,
    bucket,
    path: cleanPath,
    publicUrl,
    key: `${bucket}/${cleanPath}`
  };
};

/**
 * Delete a file from Supabase Storage
 */
export const deleteFromSupabaseStorage = async ({
  bucket = SUPABASE_STORAGE_BUCKET,
  filePath
}) => {
  if (!isSupabaseConfigured()) return { success: false, error: 'Not configured' };

  const cleanPath = filePath.replace(/^\/+/, '');
  const endpoint = `/storage/v1/object/${bucket}/${cleanPath}`;

  try {
    await supabaseRequest(endpoint, {
      method: 'DELETE'
    });
    return { success: true };
  } catch (err) {
    console.warn(`[Supabase Storage] Delete notice (${cleanPath}):`, err.message);
    return { success: false, error: err.message };
  }
};

/**
 * Get Public CDN / Direct URL for an asset in Supabase Storage
 */
export const getSupabasePublicUrl = (bucket = SUPABASE_STORAGE_BUCKET, filePath) => {
  const cleanPath = (filePath || '').replace(/^\/+/, '');
  return `${SUPABASE_URL}/storage/v1/object/public/${bucket}/${cleanPath}`;
};

export default {
  isSupabaseConfigured,
  getSupabaseConfig,
  supabaseRequest,
  uploadToSupabaseStorage,
  deleteFromSupabaseStorage,
  getSupabasePublicUrl
};
