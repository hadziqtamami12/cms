/**
 * Migration 011: High-Concurrency & Performance Query Optimization
 * Adds indexes for rapid lookups under heavy read traffic and stress testing.
 */

export const up = async ({ query, getDbType }) => {
  const dbType = getDbType();

  if (dbType === 'postgres') {
    // Indexes on articles
    await query(`CREATE INDEX IF NOT EXISTS idx_articles_published_created ON articles (is_published, created_at DESC);`).catch(() => {});
    await query(`CREATE INDEX IF NOT EXISTS idx_articles_slug ON articles (slug);`).catch(() => {});
    await query(`CREATE INDEX IF NOT EXISTS idx_articles_category ON articles (category);`).catch(() => {});

    // Indexes on travel_trips (column is_active)
    await query(`CREATE INDEX IF NOT EXISTS idx_travel_trips_slug ON travel_trips (slug);`).catch(() => {});
    await query(`CREATE INDEX IF NOT EXISTS idx_travel_trips_active ON travel_trips (is_active);`).catch(() => {});

    // Indexes on product_images
    await query(`CREATE INDEX IF NOT EXISTS idx_product_images_product_id ON product_images (product_id, sort_order ASC);`).catch(() => {});
    await query(`CREATE INDEX IF NOT EXISTS idx_product_images_slug ON product_images (slug);`).catch(() => {});

    // Ensure admin_users table exists before creating index
    await query(`
      CREATE TABLE IF NOT EXISTS admin_users (
        id VARCHAR(100) PRIMARY KEY,
        username VARCHAR(100) UNIQUE NOT NULL,
        email VARCHAR(150),
        password_hash VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'superadmin',
        admin_slug VARCHAR(100) DEFAULT 'admin',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `).catch(() => {});

    // Indexes on admin tables
    await query(`CREATE INDEX IF NOT EXISTS idx_admin_users_username ON admin_users (username);`).catch(() => {});
    await query(`CREATE INDEX IF NOT EXISTS idx_admin_settings_slug ON admin_settings (admin_slug);`).catch(() => {});

  } else if (dbType === 'mysql') {
    await query(`CREATE INDEX idx_articles_published_created ON articles (is_published, created_at DESC);`).catch(() => {});
    await query(`CREATE INDEX idx_articles_slug ON articles (slug);`).catch(() => {});
    await query(`CREATE INDEX idx_articles_category ON articles (category);`).catch(() => {});
    await query(`CREATE INDEX idx_travel_trips_slug ON travel_trips (slug);`).catch(() => {});
    await query(`CREATE INDEX idx_product_images_product_id ON product_images (product_id, sort_order ASC);`).catch(() => {});
  }
};

export const down = async ({ query, getDbType }) => {
  const dbType = getDbType();
  if (dbType === 'postgres') {
    await query(`DROP INDEX IF EXISTS idx_articles_published_created;`).catch(() => {});
    await query(`DROP INDEX IF EXISTS idx_articles_slug;`).catch(() => {});
    await query(`DROP INDEX IF EXISTS idx_articles_category;`).catch(() => {});
    await query(`DROP INDEX IF EXISTS idx_travel_trips_slug;`).catch(() => {});
    await query(`DROP INDEX IF EXISTS idx_product_images_product_id;`).catch(() => {});
  }
};
