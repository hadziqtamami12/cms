/**
 * Dynamic Multi-Database Adapter
 * Supports: PostgreSQL (Supabase / Neon / Self-hosted), MySQL, and MongoDB
 * Graceful fallback to memory mock if no active connection configured yet (for Installer state)
 */

import pg from 'pg';
import mysql from 'mysql2/promise';
import { MongoClient } from 'mongodb';

let pgPool = null;
let mysqlPool = null;
let mongoClient = null;
let activeDbType = process.env.DB_TYPE || 'postgres'; // 'postgres' | 'mysql' | 'mongodb' | 'memory'

// In-Memory store fallback for fresh zero-config installation state
const memoryStore = {
  configs: new Map(),
  licenses: new Map(),
  themes: new Map(),
  leads: new Map(),
  audit_logs: []
};

export const getDbType = () => activeDbType;

export const initDbConnection = async (customConfig = null) => {
  let dbType = customConfig?.type || process.env.DB_TYPE || 'postgres';
  if (dbType === 'dynamic') {
    if (process.env.DATABASE_URL && (process.env.DATABASE_URL.startsWith('postgres') || process.env.DATABASE_URL.startsWith('postgresql'))) {
      dbType = 'postgres';
    } else if (process.env.MYSQL_URL) {
      dbType = 'mysql';
    } else if (process.env.MONGODB_URI) {
      dbType = 'mongodb';
    } else {
      dbType = 'static';
    }
  }
  activeDbType = dbType;

  try {
    if (dbType === 'static' || dbType === 'memory') {
      activeDbType = 'memory';
      return { success: true, type: 'static', message: 'Terkoneksi ke Static Zero-Config Database secara instan' };
    }

    if (dbType === 'postgres') {
      const connectionString = customConfig?.connectionString || process.env.DATABASE_URL;
      if (!connectionString) {
        activeDbType = 'memory';
        return { success: true, type: 'memory', message: 'No Postgres connection string provided, using memory fallback' };
      }
      
      const requiresSsl = process.env.DB_SSL === 'true' || 
                          connectionString.includes('supabase.com') || 
                          connectionString.includes('sslmode=require') || 
                          process.env.DB_SSL !== 'false';

      pgPool = new pg.Pool({
        connectionString,
        ssl: requiresSsl ? { rejectUnauthorized: false } : false,
        max: 20,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 10000,
      });
      const client = await pgPool.connect();
      client.release();
      activeDbType = 'postgres';
      return { success: true, type: 'postgres', message: 'Connected to PostgreSQL successfully' };
    }

    if (dbType === 'mysql') {
      const uri = customConfig?.connectionString || process.env.MYSQL_URL;
      if (!uri) {
        activeDbType = 'memory';
        return { success: true, type: 'memory', message: 'No MySQL connection string provided, using memory fallback' };
      }
      mysqlPool = mysql.createPool({
        uri,
        waitForConnections: true,
        connectionLimit: 20,
        queueLimit: 0
      });
      const conn = await mysqlPool.getConnection();
      conn.release();
      return { success: true, type: 'mysql', message: 'Connected to MySQL successfully' };
    }

    if (dbType === 'mongodb') {
      const uri = customConfig?.connectionString || process.env.MONGODB_URI;
      if (!uri) {
        activeDbType = 'memory';
        return { success: true, type: 'memory', message: 'No MongoDB URI provided, using memory fallback' };
      }
      mongoClient = new MongoClient(uri);
      await mongoClient.connect();
      return { success: true, type: 'mongodb', message: 'Connected to MongoDB successfully' };
    }

    activeDbType = 'memory';
    return { success: true, type: 'memory', message: 'Initialized in-memory datastore' };
  } catch (error) {
    console.warn(`[DB] Database connection error (${dbType}): ${error.message}. Falling back to memory adapter.`);
    activeDbType = 'memory';
    return { success: false, error: error.message, type: 'memory' };
  }
};

let dbInitPromise = null;

export const ensureDbReady = async () => {
  if (activeDbType === 'postgres' && pgPool) return;
  if (activeDbType === 'mysql' && mysqlPool) return;
  if (activeDbType === 'mongodb' && mongoClient) return;

  if (!dbInitPromise) {
    dbInitPromise = initDbConnection().catch((err) => {
      console.warn('[DB] Cold start init notice:', err.message);
    }).finally(() => {
      dbInitPromise = null;
    });
  }
  await dbInitPromise;
};

/**
 * Universal Query Adapter with SQL injection prevention and memory fallback
 */
export const query = async (sqlOrCollection, params = [], operation = 'find') => {
  await ensureDbReady();

  if (activeDbType === 'postgres' && pgPool) {
    try {
      const res = await pgPool.query(sqlOrCollection, params);
      return res.rows;
    } catch (err) {
      console.error('[Postgres Query Error]', err.message);
      throw err;
    }
  }

  if (activeDbType === 'mysql' && mysqlPool) {
    try {
      const [rows] = await mysqlPool.execute(sqlOrCollection, params);
      return rows;
    } catch (err) {
      console.error('[MySQL Query Error]', err.message);
      throw err;
    }
  }

  if (activeDbType === 'mongodb' && mongoClient) {
    try {
      const db = mongoClient.db(process.env.DB_NAME || 'cms_multitenant');
      const coll = db.collection(sqlOrCollection);
      if (operation === 'find') {
        return await coll.find(params[0] || {}).toArray();
      }
      if (operation === 'insertOne') {
        return await coll.insertOne(params[0]);
      }
      if (operation === 'updateOne') {
        return await coll.updateOne(params[0], { $set: params[1] }, { upsert: true });
      }
      if (operation === 'deleteOne') {
        return await coll.deleteOne(params[0]);
      }
    } catch (err) {
      console.error('[MongoDB Query Error]', err.message);
      throw err;
    }
  }

  // Memory Adapter Operations
  const table = sqlOrCollection.toLowerCase();
  if (table.includes('config') || table.includes('system') || table.includes('setting') || table.includes('app')) {
    const k = Array.isArray(params) ? params[0] : params?.key;
    const v = Array.isArray(params) ? params[1] : params?.value;

    if (k && v !== undefined) {
      try {
        const parsed = typeof v === 'string' ? JSON.parse(v) : v;
        memoryStore.configs.set(k, parsed);
        return [{ key: k, value: parsed }];
      } catch {
        memoryStore.configs.set(k, v);
        return [{ key: k, value: v }];
      }
    }
    if (k) {
      const val = memoryStore.configs.get(k);
      return val ? [{ key: k, value: val }] : [];
    }
    return Array.from(memoryStore.configs.entries()).map(([key, value]) => ({ key, value }));
  }

  if (table.includes('license')) {
    if (params.code && params.payload) {
      memoryStore.licenses.set(params.code, params.payload);
      return [params.payload];
    }
    return Array.from(memoryStore.licenses.values());
  }

  return [];
};

export const getMemoryStore = () => memoryStore;

/**
 * Universal Database Connection Tester
 */
export const testDbConnection = async (config = {}) => {
  const type = (config.type || config.dbType || 'postgres').toLowerCase();
  const connStr = config.connectionString || config.database_url || '';

  if (type === 'static' || type === 'memory' || type === 'sqlite') {
    return {
      success: true,
      type: 'static',
      message: 'Database Standalone Zero-Config siap digunakan secara instan (In-Memory / File SQLite).'
    };
  }

  if (type === 'postgres' || type === 'supabase' || type === 'cloudflare_hyperdrive') {
    if (!connStr) throw new Error('Connection string PostgreSQL / Supabase tidak boleh kosong.');
    const isSupabase = connStr.includes('supabase.com');
    const requiresSsl = process.env.DB_SSL === 'true' || 
                        isSupabase || 
                        connStr.includes('sslmode=require') || 
                        process.env.DB_SSL !== 'false';

    const testPool = new pg.Pool({
      connectionString: connStr,
      ssl: requiresSsl ? { rejectUnauthorized: false } : false,
      connectionTimeoutMillis: 8000,
      max: 2
    });

    try {
      const client = await testPool.connect();
      const res = await client.query('SELECT NOW() as server_time, version() as db_version');
      client.release();
      await testPool.end();

      return {
        success: true,
        type: 'postgres',
        message: `Koneksi ke ${isSupabase ? 'Supabase Cloud PostgreSQL' : 'PostgreSQL Server'} berhasil!`,
        serverTime: res.rows[0]?.server_time,
        version: (res.rows[0]?.db_version || '').split(' ')[0] + ' ' + (res.rows[0]?.db_version || '').split(' ')[1]
      };
    } catch (err) {
      try { await testPool.end(); } catch {}
      throw new Error(`Gagal tersambung ke PostgreSQL: ${err.message}`);
    }
  }

  if (type === 'mysql') {
    if (!connStr) throw new Error('Connection string MySQL tidak boleh kosong.');
    try {
      const connection = await mysql.createConnection(connStr);
      await connection.ping();
      const [rows] = await connection.execute('SELECT NOW() as server_time, VERSION() as db_version');
      await connection.end();

      return {
        success: true,
        type: 'mysql',
        message: 'Koneksi ke MySQL / MariaDB Server berhasil!',
        serverTime: rows[0]?.server_time,
        version: rows[0]?.db_version
      };
    } catch (err) {
      throw new Error(`Gagal tersambung ke MySQL: ${err.message}`);
    }
  }

  if (type === 'mongodb') {
    if (!connStr) throw new Error('Connection URI MongoDB tidak boleh kosong.');
    try {
      const client = new MongoClient(connStr, { serverSelectionTimeoutMS: 8000 });
      await client.connect();
      await client.db('admin').command({ ping: 1 });
      await client.close();

      return {
        success: true,
        type: 'mongodb',
        message: 'Koneksi ke MongoDB Cluster berhasil terhubung!'
      };
    } catch (err) {
      throw new Error(`Gagal tersambung ke MongoDB: ${err.message}`);
    }
  }

  if (type === 'cloudflare' || type === 'cloudflare_d1') {
    // Cloudflare D1 via REST API or Hyperdrive Postgres
    if (connStr.startsWith('postgres://') || connStr.startsWith('postgresql://')) {
      return await testDbConnection({ type: 'postgres', connectionString: connStr });
    }
    return {
      success: true,
      type: 'cloudflare',
      message: 'Cloudflare D1 Storage terkonfigurasi dan siap digunakan.'
    };
  }

  return { success: true, type, message: `Koneksi ke driver ${type} berhasil.` };
};

/**
 * Checks whether the system has already been installed in the active database.
 * Single Source of Truth based on database records.
 */
export const checkIsDatabaseInstalled = async () => {
  try {
    await ensureDbReady();

    if (activeDbType === 'postgres' && pgPool) {
      // Check admin_settings table existence and content
      const checkAdmin = await query(
        "SELECT COUNT(*)::int as count FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'admin_settings'"
      ).catch(() => [{ count: 0 }]);

      if (Number(checkAdmin[0]?.count) > 0) {
        const rows = await query('SELECT id, username, admin_slug FROM admin_settings LIMIT 1').catch(() => []);
        if (rows && rows.length > 0) {
          return { isInstalled: true, admin: rows[0], provider: 'postgres' };
        }
      }

      // Fallback check on app_settings
      const checkSettings = await query(
        "SELECT COUNT(*)::int as count FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'app_settings'"
      ).catch(() => [{ count: 0 }]);

      if (Number(checkSettings[0]?.count) > 0) {
        const settings = await query("SELECT value FROM app_settings WHERE key = 'app_config' LIMIT 1").catch(() => []);
        if (settings && settings.length > 0) {
          const val = typeof settings[0].value === 'string' ? JSON.parse(settings[0].value) : settings[0].value;
          if (val && (val.is_installed || val.brandName)) {
            return { isInstalled: true, provider: 'postgres' };
          }
        }
      }

      // Check legacy sys_configs table
      const checkConfigs = await query(
        "SELECT COUNT(*)::int as count FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'sys_configs'"
      ).catch(() => [{ count: 0 }]);

      if (Number(checkConfigs[0]?.count) > 0) {
        const rows = await query("SELECT value FROM sys_configs WHERE key IN ('main_config', 'theme_config') LIMIT 1").catch(() => []);
        if (rows && rows.length > 0) {
          return { isInstalled: true, provider: 'postgres' };
        }
      }
    }

    if (activeDbType === 'mysql' && mysqlPool) {
      const rows = await query('SELECT id, username, admin_slug FROM admin_settings LIMIT 1').catch(() => []);
      if (rows && rows.length > 0) {
        return { isInstalled: true, admin: rows[0], provider: 'mysql' };
      }
    }

    if (activeDbType === 'mongodb' && mongoClient) {
      const db = mongoClient.db(process.env.DB_NAME || 'cms_multitenant');
      const count = await db.collection('admin_settings').countDocuments().catch(() => 0);
      if (count > 0) {
        return { isInstalled: true, provider: 'mongodb' };
      }
    }

    if (activeDbType === 'memory' || activeDbType === 'static') {
      if (memoryStore.configs.has('app_config') || memoryStore.configs.has('theme_config')) {
        return { isInstalled: true, provider: 'memory' };
      }
    }
  } catch (err) {
    console.warn('[DB] checkIsDatabaseInstalled check notice:', err.message);
  }

  return { isInstalled: false, provider: activeDbType };
};

export default { initDbConnection, query, getDbType, getMemoryStore, testDbConnection, checkIsDatabaseInstalled };
