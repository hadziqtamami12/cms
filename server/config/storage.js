/**
 * Unified Cloud Storage Adapter: Supabase Storage & Cloudflare R2
 * Supabase Storage is the primary single source of truth for media, logos, and assets.
 */

import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import {
  isSupabaseConfigured,
  uploadToSupabaseStorage,
  deleteFromSupabaseStorage,
  getSupabasePublicUrl
} from './supabase.js';

const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID || '';
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID || '';
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY || '';
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME || 'cms-assets';
const R2_PUBLIC_DOMAIN = process.env.R2_PUBLIC_DOMAIN || 'https://cdn.yourdomain.com';
const SUPABASE_STORAGE_BUCKET = process.env.SUPABASE_STORAGE_BUCKET || 'cms';

let s3Client = null;

if (R2_ACCOUNT_ID && R2_ACCESS_KEY_ID && R2_SECRET_ACCESS_KEY) {
  s3Client = new S3Client({
    region: 'auto',
    endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: R2_ACCESS_KEY_ID,
      secretAccessKey: R2_SECRET_ACCESS_KEY,
    },
  });
}

export const isR2Configured = () => {
  return Boolean(s3Client && R2_BUCKET_NAME);
};

export const isSupabaseStorageConfigured = () => {
  return isSupabaseConfigured();
};

/**
 * Upload buffer or binary data directly to active storage
 * Enforces Supabase Storage as primary cloud bucket.
 */
export const uploadAsset = async ({
  filename,
  buffer,
  contentType = 'image/jpeg',
  folder = 'uploads'
}) => {
  const sanitized = (filename || 'asset')
    .replace(/[^a-zA-Z0-9.-]/g, '-')
    .replace(/-+/g, '-');
  const key = `${folder}/${Date.now()}-${sanitized}`;

  // 1. Primary: Supabase Storage
  if (isSupabaseConfigured()) {
    const res = await uploadToSupabaseStorage({
      bucket: SUPABASE_STORAGE_BUCKET,
      filePath: key,
      buffer,
      contentType,
      upsert: true
    });
    return {
      success: true,
      publicUrl: res.publicUrl,
      key: res.key,
      driver: 'supabase'
    };
  }

  // 2. Secondary: Cloudflare R2
  if (isR2Configured()) {
    const command = new PutObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: key,
      Body: buffer,
      ContentType: contentType,
      CacheControl: 'public, max-age=31536000, immutable'
    });
    await s3Client.send(command);
    const publicUrl = `${R2_PUBLIC_DOMAIN.replace(/\/$/, '')}/${key}`;
    return {
      success: true,
      publicUrl,
      key,
      driver: 'r2'
    };
  }

  throw new Error('[Storage] Tidak ada storage provider cloud (Supabase Storage / R2) yang terkonfigurasi di .env.');
};

/**
 * Generates presigned URL or direct upload target
 */
export const getUploadPresignedUrl = async (filename, contentType, expiresIn = 3600) => {
  const sanitized = (filename || 'asset')
    .replace(/[^a-zA-Z0-9.-]/g, '-')
    .replace(/-+/g, '-');
  const key = `uploads/${Date.now()}-${sanitized}`;

  // Supabase Storage
  if (isSupabaseConfigured()) {
    const publicUrl = getSupabasePublicUrl(SUPABASE_STORAGE_BUCKET, key);
    return {
      uploadUrl: `/api/admin/media/upload-direct`,
      publicUrl,
      key,
      isMock: false,
      driver: 'supabase'
    };
  }

  // Cloudflare R2
  if (s3Client) {
    const command = new PutObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: key,
      ContentType: contentType,
      CacheControl: 'public, max-age=31536000, immutable'
    });

    const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn });
    const publicUrl = `${R2_PUBLIC_DOMAIN.replace(/\/$/, '')}/${key}`;

    return { uploadUrl, publicUrl, key, isMock: false, driver: 'r2' };
  }

  throw new Error('[Storage] Supabase Storage belum terkonfigurasi. Pastikan SUPABASE_URL dan SUPABASE_SERVICE_ROLE_KEY valid.');
};

export const deleteFile = async (key) => {
  if (!key) return { success: true };

  // Supabase Storage key
  if (isSupabaseConfigured()) {
    const path = key.startsWith(`${SUPABASE_STORAGE_BUCKET}/`)
      ? key.replace(`${SUPABASE_STORAGE_BUCKET}/`, '')
      : key;
    return await deleteFromSupabaseStorage({
      bucket: SUPABASE_STORAGE_BUCKET,
      filePath: path
    });
  }

  // R2 Storage key
  if (s3Client) {
    const command = new DeleteObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: key
    });
    await s3Client.send(command);
    return { success: true };
  }

  return { success: true };
};

export default {
  isR2Configured,
  isSupabaseStorageConfigured,
  uploadAsset,
  getUploadPresignedUrl,
  deleteFile
};
