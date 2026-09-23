/**
 * Migration 008: Create Articles and Travel Trips Tables
 * Supports PostgreSQL, MySQL, and Memory Adapter
 */

export const up = async ({ query, getDbType }) => {
  const dbType = getDbType();

  if (dbType === 'postgres') {
    await query(`
      CREATE TABLE IF NOT EXISTS articles (
        id VARCHAR(100) PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        slug VARCHAR(255) UNIQUE NOT NULL,
        content TEXT NOT NULL,
        excerpt TEXT,
        featured_image TEXT,
        category VARCHAR(100) DEFAULT 'Umum',
        tags JSONB DEFAULT '[]'::jsonb,
        location_variable VARCHAR(100),
        meta_title VARCHAR(255),
        meta_description TEXT,
        canonical_url TEXT,
        schema_markup JSONB,
        is_published BOOLEAN DEFAULT TRUE,
        views_count INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      CREATE INDEX IF NOT EXISTS idx_articles_slug ON articles(slug);
      CREATE INDEX IF NOT EXISTS idx_articles_category ON articles(category);
      CREATE INDEX IF NOT EXISTS idx_articles_location ON articles(location_variable);

      CREATE TABLE IF NOT EXISTS travel_trips (
        id VARCHAR(100) PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        slug VARCHAR(255) UNIQUE NOT NULL,
        description TEXT,
        route_itinerary JSONB NOT NULL DEFAULT '[]'::jsonb,
        duration VARCHAR(100),
        price_per_pax VARCHAR(100),
        price_per_group VARCHAR(100),
        images JSONB DEFAULT '[]'::jsonb,
        highlights JSONB DEFAULT '[]'::jsonb,
        included JSONB DEFAULT '[]'::jsonb,
        excluded JSONB DEFAULT '[]'::jsonb,
        badge VARCHAR(100),
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      CREATE INDEX IF NOT EXISTS idx_travel_trips_slug ON travel_trips(slug);
    `);
  } else if (dbType === 'mysql') {
    await query(`
      CREATE TABLE IF NOT EXISTS articles (
        \`id\` VARCHAR(100) PRIMARY KEY,
        \`title\` VARCHAR(255) NOT NULL,
        \`slug\` VARCHAR(255) UNIQUE NOT NULL,
        \`content\` MEDIUMTEXT NOT NULL,
        \`excerpt\` TEXT,
        \`featured_image\` TEXT,
        \`category\` VARCHAR(100) DEFAULT 'Umum',
        \`tags\` JSON,
        \`location_variable\` VARCHAR(100),
        \`meta_title\` VARCHAR(255),
        \`meta_description\` TEXT,
        \`canonical_url\` TEXT,
        \`schema_markup\` JSON,
        \`is_published\` BOOLEAN DEFAULT TRUE,
        \`views_count\` INT DEFAULT 0,
        \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_articles_slug (\`slug\`),
        INDEX idx_articles_category (\`category\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

      CREATE TABLE IF NOT EXISTS travel_trips (
        \`id\` VARCHAR(100) PRIMARY KEY,
        \`title\` VARCHAR(255) NOT NULL,
        \`slug\` VARCHAR(255) UNIQUE NOT NULL,
        \`description\` TEXT,
        \`route_itinerary\` JSON NOT NULL,
        \`duration\` VARCHAR(100),
        \`price_per_pax\` VARCHAR(100),
        \`price_per_group\` VARCHAR(100),
        \`images\` JSON,
        \`highlights\` JSON,
        \`included\` JSON,
        \`excluded\` JSON,
        \`badge\` VARCHAR(100),
        \`is_active\` BOOLEAN DEFAULT TRUE,
        \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_travel_trips_slug (\`slug\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);
  }
};

export const down = async ({ query, getDbType }) => {
  const dbType = getDbType();
  if (dbType === 'postgres' || dbType === 'mysql') {
    await query('DROP TABLE IF EXISTS articles;');
    await query('DROP TABLE IF EXISTS travel_trips;');
  }
};
