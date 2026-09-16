import { Router } from 'express';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { requireAdmin } from '../lib/auth-helper.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const POSTS_FILE = path.join(__dirname, '../data/posts.json');

const router = Router();

async function readPosts() {
  try {
    const data = await fs.readFile(POSTS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    if (err.code === 'ENOENT') return [];
    throw err;
  }
}

async function writePosts(posts) {
  await fs.writeFile(POSTS_FILE, JSON.stringify(posts, null, 2), 'utf-8');
}

/**
 * GET /api/posts
 * Public & Admin: Fetch all posts
 */
router.get('/', async (req, res) => {
  try {
    const posts = await readPosts();
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * GET /api/posts/:id
 * Public & Admin: Fetch single post
 */
router.get('/:id', async (req, res) => {
  try {
    const posts = await readPosts();
    const post = posts.find((p) => p.id === req.params.id || p.slug === req.params.id);
    if (!post) return res.status(404).json({ error: 'Post tidak ditemukan' });
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * POST /api/posts
 * Admin: Create new post
 */
router.post('/', requireAdmin, async (req, res) => {
  try {
    const { title, slug, category, author, imageUrl, excerpt, content, readTime } = req.body;
    if (!title) {
      return res.status(400).json({ error: 'Judul artikel wajib diisi' });
    }

    const posts = await readPosts();
    const newPost = {
      id: `art_${Date.now()}`,
      slug: slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      title,
      category: category || 'Umum',
      author: author || 'Admin Editorial',
      imageUrl: imageUrl || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=800',
      excerpt: excerpt || '',
      content: content || '',
      readTime: readTime || '3 menit baca',
      date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
      createdAt: new Date().toISOString(),
    };

    posts.unshift(newPost);
    await writePosts(posts);

    res.status(201).json(newPost);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * PUT /api/posts/:id
 * Admin: Update existing post
 */
router.put('/:id', requireAdmin, async (req, res) => {
  try {
    const posts = await readPosts();
    const index = posts.findIndex((p) => p.id === req.params.id || p.slug === req.params.id);
    if (index === -1) {
      return res.status(404).json({ error: 'Post tidak ditemukan' });
    }

    posts[index] = {
      ...posts[index],
      ...req.body,
      updatedAt: new Date().toISOString(),
    };

    await writePosts(posts);
    res.json(posts[index]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * DELETE /api/posts/:id
 * Admin: Delete post
 */
router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    const posts = await readPosts();
    const filtered = posts.filter((p) => p.id !== req.params.id && p.slug !== req.params.id);
    if (filtered.length === posts.length) {
      return res.status(404).json({ error: 'Post tidak ditemukan' });
    }

    await writePosts(filtered);
    res.json({ success: true, message: 'Artikel berhasil dihapus' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
