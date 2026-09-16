import { Router } from 'express';
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { requireAdmin } from '../lib/auth-helper.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname, '../data');
const MEDIA_FILE = path.join(DATA_DIR, 'media.json');

const router = Router();

// Allowed MIME types for direct cloud storage upload
const ALLOWED_MIME_TYPES = new Set([
  // Images
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/svg+xml',
  // Videos
  'video/mp4',
  'video/webm',
  'video/ogg',
  'video/quicktime',
]);

const MAX_FILE_SIZE_BYTES = 100 * 1024 * 1024; // 100 MB (Allowed directly to S3/R2)

/**
 * Ensures media data file exists
 */
async function getMediaList() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    const raw = await fs.readFile(MEDIA_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

async function saveMediaList(list) {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(MEDIA_FILE, JSON.stringify(list, null, 2), 'utf-8');
}

/**
 * Configure S3 Client for Cloudflare R2 / AWS S3
 */
function getS3Client() {
  const accountId = process.env.R2_ACCOUNT_ID;
  const accessKeyId = process.env.R2_ACCESS_KEY_ID || process.env.AWS_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY || process.env.AWS_SECRET_ACCESS_KEY;
  const endpoint = process.env.S3_ENDPOINT || (accountId ? `https://${accountId}.r2.cloudflarestorage.com` : undefined);
  const region = process.env.AWS_REGION || 'auto';

  if (!accessKeyId || !secretAccessKey) {
    return null;
  }

  return new S3Client({
    region,
    endpoint,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  });
}

/**
 * POST /api/media/presigned-url
 * Generates an authorized PUT URL for direct browser-to-bucket upload.
 * Bypasses Vercel Serverless 4.5MB request body limitation!
 */
router.post('/presigned-url', requireAdmin, async (req, res) => {
  try {
    const { fileName, fileType, fileSize } = req.body;

    if (!fileName || !fileType) {
      return res.status(400).json({ error: 'fileName and fileType are required' });
    }

    if (!ALLOWED_MIME_TYPES.has(fileType.toLowerCase())) {
      return res.status(400).json({
        error: `Tipe file "${fileType}" tidak didukung. Harap gunakan format gambar (JPG, PNG, WebP, SVG, GIF) atau video (MP4, WebM).`,
      });
    }

    if (fileSize && fileSize > MAX_FILE_SIZE_BYTES) {
      return res.status(400).json({
        error: `Ukuran file terlalu besar. Maksimum diperbolehkan adalah ${MAX_FILE_SIZE_BYTES / (1024 * 1024)} MB.`,
      });
    }

    // Sanitize filename & generate unique object key
    const sanitizedName = fileName
      .toLowerCase()
      .replace(/[^a-z0-9.]+/g, '-')
      .replace(/^-+|-+$/g, '');
    const timestamp = Date.now();
    const randomHex = Math.random().toString(36).substring(2, 8);
    const key = `uploads/${timestamp}-${randomHex}-${sanitizedName}`;

    const bucketName = process.env.R2_BUCKET_NAME || process.env.AWS_S3_BUCKET || 'cms-media';
    const publicDomain = process.env.R2_PUBLIC_DOMAIN || process.env.PUBLIC_MEDIA_URL;

    const s3Client = getS3Client();

    let uploadUrl = '';
    let publicFileUrl = '';

    if (s3Client) {
      // Generate actual S3 / Cloudflare R2 Presigned URL
      const command = new PutObjectCommand({
        Bucket: bucketName,
        Key: key,
        ContentType: fileType,
      });

      uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 }); // 1 hour expiration
      publicFileUrl = publicDomain
        ? `${publicDomain.replace(/\/$/, '')}/${key}`
        : `https://${bucketName}.s3.amazonaws.com/${key}`;
    } else {
      // Local development fallback mock when S3 env vars are not set
      uploadUrl = `/api/media/mock-upload?key=${encodeURIComponent(key)}`;
      publicFileUrl = `https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=1200&auto=format&fit=crop&q=80`;
    }

    return res.json({
      uploadUrl,
      publicFileUrl,
      key,
      fileName,
      fileType,
      expiresIn: 3600,
    });
  } catch (err) {
    console.error('[Media Presigned URL Error]:', err);
    return res.status(500).json({ error: err.message || 'Gagal menghasilkan presigned URL' });
  }
});

/**
 * PUT /api/media/mock-upload
 * Local dev mock to handle direct PUT upload when S3 credentials are not set
 */
router.put('/mock-upload', (req, res) => {
  res.status(200).send('OK');
});

/**
 * POST /api/media/save
 * Stores media metadata in database after frontend finishes direct upload
 */
router.post('/save', requireAdmin, async (req, res) => {
  try {
    const { fileName, fileType, fileSize, url, key } = req.body;

    if (!url || !fileName) {
      return res.status(400).json({ error: 'fileName and url are required' });
    }

    const mediaList = await getMediaList();
    const newMedia = {
      id: `media_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      fileName,
      fileType: fileType || 'application/octet-stream',
      fileSize: fileSize || 0,
      url,
      key: key || fileName,
      createdAt: new Date().toISOString(),
    };

    mediaList.unshift(newMedia);
    await saveMediaList(mediaList);

    return res.status(201).json({ success: true, media: newMedia });
  } catch (err) {
    console.error('[Media Save Error]:', err);
    return res.status(500).json({ error: err.message || 'Gagal menyimpan metadata media' });
  }
});

/**
 * GET /api/media
 * Lists all uploaded media files for GrapesJS Asset Manager & Media Library
 */
router.get('/', requireAdmin, async (req, res) => {
  try {
    const mediaList = await getMediaList();
    return res.json(mediaList);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

/**
 * DELETE /api/media/:id
 */
router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const mediaList = await getMediaList();
    const item = mediaList.find((m) => m.id === id);

    if (!item) {
      return res.status(404).json({ error: 'Media not found' });
    }

    // Optional: Delete from S3/R2 if key and S3 client exist
    const s3Client = getS3Client();
    if (s3Client && item.key) {
      const bucketName = process.env.R2_BUCKET_NAME || process.env.AWS_S3_BUCKET || 'cms-media';
      try {
        await s3Client.send(new DeleteObjectCommand({ Bucket: bucketName, Key: item.key }));
      } catch (s3Err) {
        console.warn('[Media S3 Delete Warning]:', s3Err.message);
      }
    }

    const updated = mediaList.filter((m) => m.id !== id);
    await saveMediaList(updated);

    return res.json({ success: true, message: 'Media berhasil dihapus' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

export default router;
