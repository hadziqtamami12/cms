/**
 * Dynamic XML Sitemap & Robots.txt Router
 */

import { Router } from 'express';
import {
  generateSitemapIndex,
  generatePageSitemap,
  generatePostSitemap,
  generateRobotsTxt,
} from '../services/sitemap.js';

const router = Router();

// Sitemap Index
router.get(['/sitemap_index.xml', '/sitemap.xml', '/api/sitemap.xml', '/api/sitemap_index.xml'], async (req, res) => {
  try {
    const xml = await generateSitemapIndex(req);
    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    res.setHeader('X-Robots-Tag', 'noindex');
    res.send(xml);
  } catch (err) {
    console.error('[Sitemap Index Error]', err);
    res.status(500).send('Error generating sitemap index');
  }
});

// Pages Sitemap
router.get(['/page-sitemap.xml', '/page.xml', '/pages.xml', '/api/page-sitemap.xml', '/api/page.xml'], async (req, res) => {
  try {
    const xml = await generatePageSitemap(req);
    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    res.send(xml);
  } catch (err) {
    console.error('[Page Sitemap Error]', err);
    res.status(500).send('Error generating page sitemap');
  }
});

// Posts Sitemap
router.get(['/post-sitemap.xml', '/post.xml', '/posts.xml', '/api/post-sitemap.xml', '/api/post.xml'], async (req, res) => {
  try {
    const xml = await generatePostSitemap(req);
    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    res.send(xml);
  } catch (err) {
    console.error('[Post Sitemap Error]', err);
    res.status(500).send('Error generating post sitemap');
  }
});

// Robots.txt
router.get(['/robots.txt', '/api/robots.txt'], async (req, res) => {
  try {
    const text = await generateRobotsTxt(req);
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.send(text);
  } catch (err) {
    console.error('[Robots.txt Error]', err);
    res.status(500).send('Error generating robots.txt');
  }
});

export default router;
