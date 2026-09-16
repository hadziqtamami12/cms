/**
 * Ultra-Fast Cache-Aside Provider for Vercel Serverless
 * Supports Upstash Redis REST (Zero TCP cold-start), ioredis TCP, and In-Memory fallback.
 */

// In-Memory cache fallback with TTL support
class MemoryCache {
  constructor() {
    this.store = new Map();
  }

  async get(key) {
    const item = this.store.get(key);
    if (!item) return null;
    if (Date.now() > item.expiresAt) {
      this.store.delete(key);
      return null;
    }
    return item.value;
  }

  async set(key, value, ttlSeconds = 300) {
    this.store.set(key, {
      value,
      expiresAt: Date.now() + ttlSeconds * 1000,
    });
    return true;
  }

  async del(key) {
    this.store.delete(key);
    return true;
  }

  async flushAll() {
    this.store.clear();
    return true;
  }
}

const memoryFallback = new MemoryCache();
let ioredisClient = null;

/**
 * Upstash REST Cache Client (High-speed HTTP, 0ms TCP cold-start)
 */
class UpstashRestClient {
  constructor(url, token) {
    this.baseUrl = url.replace(/\/$/, '');
    this.token = token;
  }

  async get(key) {
    try {
      const res = await fetch(`${this.baseUrl}/get/${encodeURIComponent(key)}`, {
        headers: { Authorization: `Bearer ${this.token}` },
      });
      if (!res.ok) return null;
      const data = await res.json();
      if (!data.result) return null;
      return typeof data.result === 'string' ? JSON.parse(data.result) : data.result;
    } catch (err) {
      console.warn('[Cache] Upstash GET error:', err.message);
      return null;
    }
  }

  async set(key, value, ttlSeconds = 300) {
    try {
      const serialized = JSON.stringify(value);
      const res = await fetch(
        `${this.baseUrl}/set/${encodeURIComponent(key)}?ex=${ttlSeconds}`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${this.token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(serialized),
        }
      );
      return res.ok;
    } catch (err) {
      console.warn('[Cache] Upstash SET error:', err.message);
      return false;
    }
  }

  async del(key) {
    try {
      const res = await fetch(`${this.baseUrl}/del/${encodeURIComponent(key)}`, {
        headers: { Authorization: `Bearer ${this.token}` },
      });
      return res.ok;
    } catch {
      return false;
    }
  }

  async flushAll() {
    try {
      const res = await fetch(`${this.baseUrl}/flushdb`, {
        headers: { Authorization: `Bearer ${this.token}` },
      });
      return res.ok;
    } catch {
      return false;
    }
  }
}

/**
 * Resolves the appropriate cache client dynamically
 */
export async function getCacheClient() {
  // 1. Upstash REST (Highest priority for Vercel Serverless)
  const upstashUrl = process.env.UPSTASH_REDIS_REST_URL;
  const upstashToken = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (upstashUrl && upstashToken) {
    return new UpstashRestClient(upstashUrl, upstashToken);
  }

  // 2. Custom Redis TCP (via ioredis lazy load)
  const redisUrl = process.env.REDIS_URL;
  if (redisUrl) {
    try {
      if (!ioredisClient) {
        const { default: Redis } = await import('ioredis');
        ioredisClient = new Redis(redisUrl, {
          maxRetriesPerRequest: 1,
          connectTimeout: 500,
          lazyConnect: true,
        });
        await ioredisClient.connect();
      }

      return {
        async get(key) {
          const raw = await ioredisClient.get(key);
          return raw ? JSON.parse(raw) : null;
        },
        async set(key, value, ttlSeconds = 300) {
          return await ioredisClient.set(key, JSON.stringify(value), 'EX', ttlSeconds);
        },
        async del(key) {
          return await ioredisClient.del(key);
        },
        async flushAll() {
          return await ioredisClient.flushdb();
        },
      };
    } catch (err) {
      console.warn('[Cache] ioredis connection failed, using memory fallback:', err.message);
    }
  }

  // 3. Ultra-fast In-Memory fallback
  return memoryFallback;
}

/**
 * Cache invalidator triggered on page publish/update
 */
export async function invalidatePageCache(slug) {
  const cache = await getCacheClient();
  const keys = [
    `page:${slug}`,
    'page:home',
    'sitemap:xml',
    'pages:all',
  ];
  await Promise.all(keys.map((k) => cache.del(k)));
  console.log(`[Cache] Invalidated cache for slug: ${slug}`);
}
