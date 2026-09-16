import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname, '../data');
const PAGES_FILE = path.join(DATA_DIR, 'pages.json');
const SETTINGS_FILE = path.join(DATA_DIR, 'settings.json');

// Memory singleton connections to preserve across Vercel function invocations
const connectionCache = {
  driver: null,
  client: null,
  pool: null,
};

/**
 * Ensures data directory and initial JSON fallback files exist
 */
async function ensureLocalData() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    try {
      await fs.access(PAGES_FILE);
    } catch {
      await fs.writeFile(PAGES_FILE, JSON.stringify([], null, 2), 'utf-8');
    }
    try {
      await fs.access(SETTINGS_FILE);
    } catch {
      const defaultSettings = {
        dbType: 'json',
        siteName: 'Ultra CMS Engine',
        cacheType: 'memory',
        setupCompleted: false,
      };
      await fs.writeFile(SETTINGS_FILE, JSON.stringify(defaultSettings, null, 2), 'utf-8');
    }
  } catch (err) {
    console.error('[DB-Factory] Local filesystem init error:', err.message);
  }
}

/**
 * Static JSON / File-based Driver (Instant zero-dependency fallback)
 */
const JsonDriver = {
  async getPages() {
    await ensureLocalData();
    try {
      const raw = await fs.readFile(PAGES_FILE, 'utf-8');
      return JSON.parse(raw);
    } catch {
      return [];
    }
  },

  async getPageBySlug(slug) {
    const pages = await this.getPages();
    const isHomeQuery = !slug || slug === 'home' || slug === 'index';
    return (
      pages.find((p) => {
        if (isHomeQuery) return p.slug === '' || p.slug === 'home' || p.slug === 'index';
        return p.slug === slug;
      }) || null
    );
  },

  async savePage(pageData) {
    const pages = await this.getPages();
    const now = new Date().toISOString();
    const index = pages.findIndex((p) => p.id === pageData.id || p.slug === pageData.slug);

    const record = {
      ...pageData,
      id: pageData.id || `page_${Date.now()}`,
      updatedAt: now,
      createdAt: index >= 0 ? pages[index].createdAt : now,
    };

    if (index >= 0) {
      pages[index] = record;
    } else {
      pages.push(record);
    }

    await fs.writeFile(PAGES_FILE, JSON.stringify(pages, null, 2), 'utf-8');
    return record;
  },

  async deletePage(id) {
    const pages = await this.getPages();
    const filtered = pages.filter((p) => p.id !== id);
    await fs.writeFile(PAGES_FILE, JSON.stringify(filtered, null, 2), 'utf-8');
    return true;
  },

  async getSettings() {
    await ensureLocalData();
    try {
      const raw = await fs.readFile(SETTINGS_FILE, 'utf-8');
      return JSON.parse(raw);
    } catch {
      return { dbType: 'json', setupCompleted: false };
    }
  },

  async saveSettings(settingsData) {
    await ensureLocalData();
    const current = await this.getSettings();
    const merged = { ...current, ...settingsData, updatedAt: new Date().toISOString() };
    await fs.writeFile(SETTINGS_FILE, JSON.stringify(merged, null, 2), 'utf-8');
    return merged;
  },
};

/**
 * Supabase / PostgreSQL Serverless Driver (Lazy Loaded)
 */
async function getSupabaseDriver(config) {
  try {
    const { createClient } = await import('@supabase/supabase-js');
    const client = connectionCache.client || createClient(config.supabaseUrl, config.supabaseKey);
    connectionCache.client = client;

    return {
      async getPages() {
        const { data, error } = await client.from('cms_pages').select('*');
        if (error) throw error;
        return data || [];
      },
      async getPageBySlug(slug) {
        const { data, error } = await client
          .from('cms_pages')
          .select('*')
          .eq('slug', slug)
          .maybeSingle();
        if (error) throw error;
        return data;
      },
      async savePage(pageData) {
        const { data, error } = await client
          .from('cms_pages')
          .upsert({ ...pageData, updatedAt: new Date().toISOString() })
          .select()
          .single();
        if (error) throw error;
        return data;
      },
      async deletePage(id) {
        const { error } = await client.from('cms_pages').delete().eq('id', id);
        if (error) throw error;
        return true;
      },
      async getSettings() {
        const { data } = await client.from('cms_settings').select('*').single();
        return data || (await JsonDriver.getSettings());
      },
      async saveSettings(settingsData) {
        const { data, error } = await client
          .from('cms_settings')
          .upsert({ id: 'global', ...settingsData })
          .select()
          .single();
        if (error) throw error;
        return data;
      },
    };
  } catch (err) {
    console.warn('[DB-Factory] Supabase driver unavailable, falling back to JSON:', err.message);
    return JsonDriver;
  }
}

/**
 * MySQL Connection Pool Driver (Lazy Loaded via mysql2/promise)
 */
async function getMySQLDriver(config) {
  try {
    const mysql = await import('mysql2/promise');
    if (!connectionCache.pool) {
      connectionCache.pool = mysql.createPool({
        host: config.mysqlHost || 'localhost',
        port: Number(config.mysqlPort) || 3306,
        user: config.mysqlUser,
        password: config.mysqlPassword,
        database: config.mysqlDatabase,
        waitForConnections: true,
        connectionLimit: 5,
        queueLimit: 0,
      });
    }

    const pool = connectionCache.pool;
    return {
      async getPages() {
        const [rows] = await pool.query('SELECT * FROM cms_pages');
        return rows.map((r) => ({ ...r, blocks: typeof r.blocks === 'string' ? JSON.parse(r.blocks) : r.blocks }));
      },
      async getPageBySlug(slug) {
        const [rows] = await pool.query('SELECT * FROM cms_pages WHERE slug = ? LIMIT 1', [slug]);
        if (!rows.length) return null;
        const r = rows[0];
        return { ...r, blocks: typeof r.blocks === 'string' ? JSON.parse(r.blocks) : r.blocks };
      },
      async savePage(pageData) {
        const blocksStr = JSON.stringify(pageData.blocks || []);
        const seoStr = JSON.stringify(pageData.seo || {});
        const now = new Date().toISOString();
        await pool.query(
          `INSERT INTO cms_pages (id, slug, title, status, theme_id, mobile_nav_type, seo, blocks, updated_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
           ON DUPLICATE KEY UPDATE title=VALUES(title), status=VALUES(status), theme_id=VALUES(theme_id),
           mobile_nav_type=VALUES(mobile_nav_type), seo=VALUES(seo), blocks=VALUES(blocks), updated_at=VALUES(updated_at)`,
          [
            pageData.id || `page_${Date.now()}`,
            pageData.slug,
            pageData.title,
            pageData.status || 'published',
            pageData.themeId || 'default',
            pageData.mobileNavType || 'curved',
            seoStr,
            blocksStr,
            now,
          ]
        );
        return pageData;
      },
      async deletePage(id) {
        await pool.query('DELETE FROM cms_pages WHERE id = ?', [id]);
        return true;
      },
      async getSettings() {
        return JsonDriver.getSettings();
      },
      async saveSettings(settingsData) {
        return JsonDriver.saveSettings(settingsData);
      },
    };
  } catch (err) {
    console.warn('[DB-Factory] MySQL driver unavailable, falling back to JSON:', err.message);
    return JsonDriver;
  }
}

/**
 * MongoDB Native Driver (Lazy Loaded singleton)
 */
async function getMongoDriver(config) {
  try {
    const { MongoClient } = await import('mongodb');
    if (!connectionCache.client) {
      connectionCache.client = new MongoClient(config.mongoUrl, { maxPoolSize: 5 });
      await connectionCache.client.connect();
    }
    const db = connectionCache.client.db(config.mongoDbName || 'ultra_cms');
    const pagesCol = db.collection('pages');
    const settingsCol = db.collection('settings');

    return {
      async getPages() {
        return await pagesCol.find({}).toArray();
      },
      async getPageBySlug(slug) {
        return await pagesCol.findOne({ slug });
      },
      async savePage(pageData) {
        const id = pageData.id || `page_${Date.now()}`;
        const record = { ...pageData, id, updatedAt: new Date().toISOString() };
        await pagesCol.updateOne({ id }, { $set: record }, { upsert: true });
        return record;
      },
      async deletePage(id) {
        await pagesCol.deleteOne({ id });
        return true;
      },
      async getSettings() {
        const doc = await settingsCol.findOne({ id: 'global' });
        return doc || (await JsonDriver.getSettings());
      },
      async saveSettings(settingsData) {
        await settingsCol.updateOne(
          { id: 'global' },
          { $set: { ...settingsData, updatedAt: new Date().toISOString() } },
          { upsert: true }
        );
        return settingsData;
      },
    };
  } catch (err) {
    console.warn('[DB-Factory] MongoDB driver unavailable, falling back to JSON:', err.message);
    return JsonDriver;
  }
}

/**
 * Unified Database Factory Interface
 * Resolves active driver dynamically based on settings or env
 */
export async function getDbDriver() {
  const settings = await JsonDriver.getSettings();
  const dbType = process.env.DB_TYPE || settings.dbType || 'json';

  switch (dbType) {
    case 'supabase':
    case 'postgres':
      return await getSupabaseDriver({
        supabaseUrl: process.env.SUPABASE_URL || settings.supabaseUrl,
        supabaseKey: process.env.SUPABASE_KEY || settings.supabaseKey,
      });
    case 'mysql':
      return await getMySQLDriver({
        mysqlHost: process.env.MYSQL_HOST || settings.mysqlHost,
        mysqlPort: process.env.MYSQL_PORT || settings.mysqlPort,
        mysqlUser: process.env.MYSQL_USER || settings.mysqlUser,
        mysqlPassword: process.env.MYSQL_PASSWORD || settings.mysqlPassword,
        mysqlDatabase: process.env.MYSQL_DATABASE || settings.mysqlDatabase,
      });
    case 'mongodb':
      return await getMongoDriver({
        mongoUrl: process.env.MONGO_URL || settings.mongoUrl,
        mongoDbName: process.env.MONGO_DB_NAME || settings.mongoDbName,
      });
    case 'json':
    default:
      return JsonDriver;
  }
}

export { JsonDriver };
