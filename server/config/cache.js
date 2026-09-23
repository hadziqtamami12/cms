/**
 * Multi-Tier Caching Layer (Redis + In-Memory Fallback)
 * Ensures ultra-fast Core Web Vitals (<50ms TTFB) under massive concurrent spikes
 */

import Redis from 'ioredis';

let redisClient = null;
const memoryCache = new Map();
const memoryExpiry = new Map();

// Initialize Redis only if REDIS_URL or REDIS_HOST is explicitly configured (non-empty)
const redisUrl = (process.env.REDIS_URL || '').trim();
const redisHost = (process.env.REDIS_HOST || '').trim();

if (redisUrl || redisHost) {
  try {
    redisClient = new Redis(redisUrl || {
      host: redisHost || '127.0.0.1',
      port: Number(process.env.REDIS_PORT) || 6379,
      password: process.env.REDIS_PASSWORD || undefined,
      lazyConnect: true,
      maxRetriesPerRequest: 1,
      retryStrategy: (times) => {
        if (times > 2) return null; // Stop retrying after 2 attempts
        return Math.min(times * 100, 500);
      }
    });

    redisClient.connect().then(() => {
      console.log('[Cache] Redis connected successfully');
    }).catch((err) => {
      console.warn('[Cache] Redis connection failed, falling back to in-memory TTL cache:', err.message);
      redisClient = null;
    });

    redisClient.on('error', () => {
      redisClient = null; // Silently disable on repeated failures
    });
  } catch (err) {
    console.warn('[Cache] Could not start Redis client, using in-memory cache:', err.message);
    redisClient = null;
  }
}

export const getCache = async (key) => {
  if (redisClient && redisClient.status === 'ready') {
    try {
      const data = await redisClient.get(key);
      return data ? JSON.parse(data) : null;
    } catch {
      // Fall through to memory
    }
  }

  // Memory fallback
  const expiry = memoryExpiry.get(key);
  if (expiry && Date.now() > expiry) {
    memoryCache.delete(key);
    memoryExpiry.delete(key);
    return null;
  }
  return memoryCache.get(key) || null;
};

export const setCache = async (key, value, ttlSeconds = 300) => {
  if (redisClient && redisClient.status === 'ready') {
    try {
      await redisClient.setex(key, ttlSeconds, JSON.stringify(value));
      return;
    } catch {
      // Fall through to memory
    }
  }

  memoryCache.set(key, value);
  memoryExpiry.set(key, Date.now() + (ttlSeconds * 1000));
};

export const delCache = async (patternOrKey) => {
  if (redisClient && redisClient.status === 'ready') {
    try {
      if (patternOrKey.includes('*')) {
        const keys = await redisClient.keys(patternOrKey);
        if (keys.length > 0) await redisClient.del(...keys);
      } else {
        await redisClient.del(patternOrKey);
      }
    } catch {
      // Fall through
    }
  }

  for (const key of memoryCache.keys()) {
    if (key === patternOrKey || (patternOrKey.includes('*') && key.startsWith(patternOrKey.replace('*', '')))) {
      memoryCache.delete(key);
      memoryExpiry.delete(key);
    }
  }
};

export const clearAllCache = async () => {
  if (redisClient && redisClient.status === 'ready') {
    try {
      await redisClient.flushdb();
    } catch {}
  }
  memoryCache.clear();
  memoryExpiry.clear();
};

export default { getCache, setCache, delCache, clearAllCache };
