/**
 * Main Serverless & Express Application Entry Point
 * Designed for Vercel Serverless Functions and standalone Node.js environments
 */

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRoutes from './routes/api.js';
import adminRoutes from './routes/admin.js';
import installerRoutes from './routes/installer.js';
import keygenRoutes from './routes/keygen.js';
import { licenseGuard } from './middleware/licenseGuard.js';
import { dynamicSlugRouter } from './middleware/dynamicSlugRouter.js';
import { initDbConnection } from './config/db.js';

dotenv.config();

const app = express();

// Initialize dynamic DB connection
initDbConnection().catch((err) => {
  console.warn('[Server] DB initialization notice:', err.message);
});

// Global Middlewares
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-programmer-key']
}));

app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// Dynamic Slug Router (e.g. /admin, /sys-portal, /cms-panel)
app.use(dynamicSlugRouter);

// Public & Installer API Routes
app.use('/api/installer', installerRoutes);
app.use('/api/keygen', keygenRoutes);

// License Guard Middleware (Interception of locked or uninstalled requests)
app.use('/api', licenseGuard);

// Core API & Admin Routes
app.use('/api', apiRoutes);
app.use('/api/admin', adminRoutes);

// Mock Media Upload for zero-config testing
app.post('/api/media/mock-upload', (req, res) => {
  res.json({
    success: true,
    fileUrl: `https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80`,
    message: 'Media uploaded successfully to mock adapter'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('[Server Error]', err);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal Server Error'
  });
});

const PORT = process.env.PORT || 5000;
if (!process.env.VERCEL) {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[MultiCMS Server] Running on http://127.0.0.1:${PORT}`);
  });
}

export default app;
