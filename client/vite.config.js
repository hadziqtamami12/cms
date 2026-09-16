import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'robots.txt', 'apple-touch-icon.png'],
      manifest: {
        name: 'Ultra CMS - Modern Web Platform',
        short_name: 'UltraCMS',
        description: 'Ultra High-Performance Multi-Purpose Headless CMS & Visual Builder',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'portrait-primary',
        start_url: '/',
        icons: [
          {
            src: '/pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: '/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          },
        ],
      },
      workbox: {
        // Strict navigate fallback bypass for admin, builder, setup, and api routes
        navigateFallback: '/index.html',
        navigateFallbackDenylist: [
          /^\/wp-admin/,
          /^\/admin/,
          /^\/builder/,
          /^\/setup/,
          /^\/api/,
          /.*\.xml$/,
          /.*\.txt$/,
        ],
        runtimeCaching: [
          // 1. Static Assets: Cache-First
          {
            urlPattern: ({ request }) =>
              request.destination === 'style' ||
              request.destination === 'script' ||
              request.destination === 'worker' ||
              request.destination === 'font' ||
              request.destination === 'image',
            handler: 'CacheFirst',
            options: {
              cacheName: 'static-assets-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
              },
            },
          },
          // 2. Public Content API: Network-First with Cache Fallback for offline reading
          {
            urlPattern: ({ url, request }) =>
              url.pathname.startsWith('/api/posts') ||
              url.pathname.startsWith('/api/pages') ||
              url.pathname.startsWith('/api/settings/public'),
            handler: 'NetworkFirst',
            options: {
              cacheName: 'public-content-cache',
              networkTimeoutSeconds: 3,
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 24 * 60 * 60, // 24 Hours
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
        ],
      },
    }),
  ],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
  build: {
    target: 'esnext',
    minify: 'esbuild',
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Decouple public client bundle completely from admin/builder tools
          if (id.includes('/src/admin/')) {
            return 'admin-builder-chunk';
          }
          if (id.includes('node_modules/lucide-react')) {
            return 'icons-chunk';
          }
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom')) {
            return 'react-vendor';
          }
        },
      },
    },
  },
});
