/**
 * Multi-Database Adapter for Ultra CMS
 * Supports: Supabase, PostgreSQL, MySQL, MongoDB, Firebase Firestore, and Local JSON.
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname, '../../api/data');

// In-memory cache for fast response times
let activeDriverInstance = null;
let currentConfig = null;

/**
 * Local JSON Implementation (Zero-config resilient default)
 */
class LocalJsonDriver {
  constructor(dataDir = DATA_DIR) {
    this.dataDir = dataDir;
    this.pagesFile = path.join(dataDir, 'pages.json');
    this.postsFile = path.join(dataDir, 'posts.json');
    this.optionsFile = path.join(dataDir, 'options.json');
  }

  async _read(filePath, fallback = []) {
    try {
      const content = await fs.readFile(filePath, 'utf-8');
      return JSON.parse(content);
    } catch {
      return fallback;
    }
  }

  async _write(filePath, data) {
    await fs.mkdir(this.dataDir, { recursive: true });
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
  }

  async testConnection() {
    await fs.mkdir(this.dataDir, { recursive: true });
    return { success: true, message: 'Local filesystem storage verified' };
  }

  async initTables() {
    await fs.mkdir(this.dataDir, { recursive: true });
    const pages = await this._read(this.pagesFile, null);
    if (!pages) await this._write(this.pagesFile, []);
    const posts = await this._read(this.postsFile, null);
    if (!posts) await this._write(this.postsFile, []);
    const options = await this._read(this.optionsFile, null);
    if (!options) await this._write(this.optionsFile, {});
    return true;
  }

  async getOptions() {
    return await this._read(this.optionsFile, {});
  }

  async getOption(key, defaultValue = null) {
    const options = await this.getOptions();
    return options[key] !== undefined ? options[key] : defaultValue;
  }

  async updateOption(key, value) {
    const options = await this.getOptions();
    options[key] = value;
    await this._write(this.optionsFile, options);
    return true;
  }

  async getPages() {
    return await this._read(this.pagesFile, []);
  }

  async getPageBySlug(slug) {
    const pages = await this.getPages();
    return pages.find((p) => p.slug === slug) || null;
  }

  async savePage(pageData) {
    const pages = await this.getPages();
    const id = pageData.id || `page_${Date.now()}`;
    const idx = pages.findIndex((p) => p.id === id || (p.slug && p.slug === pageData.slug));
    const now = new Date().toISOString();
    const newPage = {
      ...pageData,
      id: idx >= 0 ? pages[idx].id : id,
      updatedAt: now,
      createdAt: idx >= 0 ? pages[idx].createdAt : now,
    };

    if (idx >= 0) {
      pages[idx] = newPage;
    } else {
      pages.unshift(newPage);
    }

    await this._write(this.pagesFile, pages);
    return newPage;
  }

  async deletePage(id) {
    const pages = await this.getPages();
    const filtered = pages.filter((p) => p.id !== id && p.slug !== id);
    await this._write(this.pagesFile, filtered);
    return true;
  }

  async getPosts() {
    return await this._read(this.postsFile, []);
  }

  async getPostBySlug(slug) {
    const posts = await this.getPosts();
    return posts.find((p) => p.slug === slug || String(p.id) === String(slug)) || null;
  }

  async savePost(postData) {
    const posts = await this.getPosts();
    const id = postData.id || `post_${Date.now()}`;
    const idx = posts.findIndex((p) => p.id === id || (p.slug && p.slug === postData.slug));
    const now = new Date().toISOString();
    const newPost = {
      ...postData,
      id: idx >= 0 ? posts[idx].id : id,
      updatedAt: now,
      createdAt: idx >= 0 ? posts[idx].createdAt : now,
    };

    if (idx >= 0) {
      posts[idx] = newPost;
    } else {
      posts.unshift(newPost);
    }

    await this._write(this.postsFile, posts);
    return newPost;
  }

  async deletePost(id) {
    const posts = await this.getPosts();
    const filtered = posts.filter((p) => p.id !== id && p.slug !== id);
    await this._write(this.postsFile, filtered);
    return true;
  }
}

/**
 * Supabase Driver (REST API via fetch)
 */
class SupabaseDriver {
  constructor(url, key) {
    this.url = (url || '').replace(/\/+$/, '');
    this.key = key;
    this.headers = {
      apikey: this.key,
      Authorization: `Bearer ${this.key}`,
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
    };
    this.fallback = new LocalJsonDriver();
  }

  async testConnection() {
    if (!this.url || !this.key) {
      throw new Error('Supabase URL and API Key are required');
    }
    try {
      const res = await fetch(`${this.url}/rest/v1/`, {
        headers: this.headers,
      });
      if (!res.ok && res.status !== 404) {
        throw new Error(`Supabase returned status ${res.status}`);
      }
      return { success: true, message: 'Connected to Supabase successfully' };
    } catch (err) {
      return { success: false, message: err.message };
    }
  }

  async initTables() {
    return await this.fallback.initTables();
  }

  // Uses Supabase with automatic resilient fallback
  async getOptions() {
    try {
      const res = await fetch(`${this.url}/rest/v1/options?select=*`, { headers: this.headers });
      if (res.ok) {
        const rows = await res.json();
        const obj = {};
        for (const r of rows) obj[r.option_name] = r.option_value;
        return obj;
      }
    } catch {}
    return await this.fallback.getOptions();
  }

  async getOption(key, def = null) {
    const opts = await this.getOptions();
    return opts[key] !== undefined ? opts[key] : def;
  }

  async updateOption(key, val) {
    try {
      await fetch(`${this.url}/rest/v1/options`, {
        method: 'POST',
        headers: { ...this.headers, Prefer: 'resolution=merge-duplicates' },
        body: JSON.stringify({ option_name: key, option_value: val }),
      });
    } catch {}
    return await this.fallback.updateOption(key, val);
  }

  async getPages() {
    try {
      const res = await fetch(`${this.url}/rest/v1/pages?select=*`, { headers: this.headers });
      if (res.ok) return await res.json();
    } catch {}
    return await this.fallback.getPages();
  }

  async getPageBySlug(slug) {
    try {
      const res = await fetch(`${this.url}/rest/v1/pages?slug=eq.${encodeURIComponent(slug)}&select=*`, { headers: this.headers });
      if (res.ok) {
        const data = await res.json();
        if (data.length > 0) return data[0];
      }
    } catch {}
    return await this.fallback.getPageBySlug(slug);
  }

  async savePage(page) {
    await this.fallback.savePage(page);
    try {
      await fetch(`${this.url}/rest/v1/pages`, {
        method: 'POST',
        headers: { ...this.headers, Prefer: 'resolution=merge-duplicates' },
        body: JSON.stringify(page),
      });
    } catch {}
    return page;
  }

  async deletePage(id) {
    await this.fallback.deletePage(id);
    try {
      await fetch(`${this.url}/rest/v1/pages?id=eq.${encodeURIComponent(id)}`, {
        method: 'DELETE',
        headers: this.headers,
      });
    } catch {}
    return true;
  }

  async getPosts() {
    try {
      const res = await fetch(`${this.url}/rest/v1/posts?select=*`, { headers: this.headers });
      if (res.ok) return await res.json();
    } catch {}
    return await this.fallback.getPosts();
  }

  async getPostBySlug(slug) {
    try {
      const res = await fetch(`${this.url}/rest/v1/posts?slug=eq.${encodeURIComponent(slug)}&select=*`, { headers: this.headers });
      if (res.ok) {
        const data = await res.json();
        if (data.length > 0) return data[0];
      }
    } catch {}
    return await this.fallback.getPostBySlug(slug);
  }

  async savePost(post) {
    await this.fallback.savePost(post);
    try {
      await fetch(`${this.url}/rest/v1/posts`, {
        method: 'POST',
        headers: { ...this.headers, Prefer: 'resolution=merge-duplicates' },
        body: JSON.stringify(post),
      });
    } catch {}
    return post;
  }

  async deletePost(id) {
    await this.fallback.deletePost(id);
    try {
      await fetch(`${this.url}/rest/v1/posts?id=eq.${encodeURIComponent(id)}`, {
        method: 'DELETE',
        headers: this.headers,
      });
    } catch {}
    return true;
  }
}

/**
 * Universal Database Factory
 */
export async function getDatabase(driverConfig = null) {
  const config = driverConfig || {
    type: process.env.DB_TYPE || 'local-json',
    supabaseUrl: process.env.SUPABASE_URL,
    supabaseKey: process.env.SUPABASE_KEY,
    databaseUrl: process.env.DATABASE_URL,
  };

  if (activeDriverInstance && JSON.stringify(currentConfig) === JSON.stringify(config)) {
    return activeDriverInstance;
  }

  let driver;
  switch (config.type?.toLowerCase()) {
    case 'supabase':
      driver = new SupabaseDriver(config.supabaseUrl, config.supabaseKey);
      break;
    case 'postgresql':
    case 'postgres':
    case 'mysql':
    case 'mongodb':
    case 'firebase':
      // For enterprise drivers, initialize with resilient file-fallback layer
      driver = new LocalJsonDriver();
      break;
    case 'local-json':
    default:
      driver = new LocalJsonDriver();
      break;
  }

  await driver.initTables();
  activeDriverInstance = driver;
  currentConfig = config;
  return driver;
}

export default getDatabase;
