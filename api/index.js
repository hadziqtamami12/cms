import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import authRoutes from './routes/auth.js';
import pagesRoutes from './routes/pages.js';
import postsRoutes from './routes/posts.js';
import importRoutes from './routes/import.js';
import settingsRoutes from './routes/settings.js';
import mediaRoutes from './routes/media.js';
import setupRoutes from '../server/routes/setup.js';
import sitemapRoutes from '../server/routes/sitemap.js';
import { installationGuard } from '../server/middleware/installation-guard.js';

const app = express();

// Performance and security middleware
app.disable('x-powered-by');
app.use((req, res, next) => {
  res.setHeader('X-Engine', 'Ultra-Performance-Headless-CMS');
  next();
});

// JSON and URL-encoded body parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// CORS configuration
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://localhost:5000',
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, server-to-server)
      if (!origin) return callback(null, true);
      if (allowedOrigins.length === 0 || allowedOrigins.includes(origin) || process.env.NODE_ENV !== 'production') {
        return callback(null, true);
      }
      callback(null, true);
    },
    credentials: true,
  })
);

// Sitemaps & robots.txt (Bypass installation guard so crawlers can access without restriction)
app.use(sitemapRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    engine: 'Ultra-CMS-Enterprise',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Installation guard middleware
app.use(installationGuard);

// API Routes
app.use('/api/setup', setupRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/pages', pagesRoutes);
app.use('/api/posts', postsRoutes);
app.use('/api/import', importRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/media', mediaRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[API Error]', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
  });
});

// Local dev server listener
if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`[CMS Server] Ready on http://localhost:${PORT}`);
  });
}

// Export default for Vercel Serverless
export default app;
