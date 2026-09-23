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
  const dbType = customConfig?.type || process.env.DB_TYPE || 'postgres';
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
      pgPool = new pg.Pool({
        connectionString,
        ssl: process.env.DB_SSL === 'false' ? false : { rejectUnauthorized: false },
        max: 20,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 5000,
      });
      const client = await pgPool.connect();
      client.release();
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

/**
 * Universal Query Adapter with SQL injection prevention and memory fallback
 */
export const query = async (sqlOrCollection, params = [], operation = 'find') => {
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
  if (table.includes('config') || table.includes('system')) {
    if (params.key && params.value !== undefined) {
      memoryStore.configs.set(params.key, params.value);
      return [{ key: params.key, value: params.value }];
    }
    if (params.key) {
      const val = memoryStore.configs.get(params.key);
      return val ? [{ key: params.key, value: val }] : [];
    }
    return Array.from(memoryStore.configs.entries()).map(([k, v]) => ({ key: k, value: v }));
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
export default { initDbConnection, query, getDbType, getMemoryStore };
