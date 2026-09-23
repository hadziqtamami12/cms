/**
 * Cloudflare R2 Storage Adapter (S3-Compatible)
 * Handles fast, lightweight WebP/AVIF asset uploads, presigned URLs, and edge CDN URLs
 */

import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID || '';
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID || '';
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY || '';
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME || 'cms-assets';
const R2_PUBLIC_DOMAIN = process.env.R2_PUBLIC_DOMAIN || 'https://cdn.yourdomain.com';

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

export const getUploadPresignedUrl = async (filename, contentType, expiresIn = 3600) => {
  if (!s3Client) {
    // Return mock upload endpoint if not configured
    return {
      uploadUrl: `/api/media/mock-upload?file=${encodeURIComponent(filename)}`,
      publicUrl: `/assets/uploads/${filename}`,
      key: filename,
      isMock: true
    };
  }

  const key = `uploads/${Date.now()}-${filename.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
  const command = new PutObjectCommand({
    Bucket: R2_BUCKET_NAME,
    Key: key,
    ContentType: contentType,
    CacheControl: 'public, max-age=31536000, immutable'
  });

  const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn });
  const publicUrl = `${R2_PUBLIC_DOMAIN.replace(/\/$/, '')}/${key}`;

  return { uploadUrl, publicUrl, key, isMock: false };
};

export const deleteFile = async (key) => {
  if (!s3Client) return { success: true, isMock: true };
  const command = new DeleteObjectCommand({
    Bucket: R2_BUCKET_NAME,
    Key: key
  });
  await s3Client.send(command);
  return { success: true };
};

export default { isR2Configured, getUploadPresignedUrl, deleteFile };
