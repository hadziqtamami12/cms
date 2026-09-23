/**
 * Migration 009: Create Products, Multi-Tier Prices, and Product Media Gallery
 * Supports PostgreSQL, MySQL, and In-Memory Adapter
 */

export const up = async ({ query, getDbType }) => {
  const dbType = getDbType();

  if (dbType === 'postgres') {
    await query(`
      CREATE TABLE IF NOT EXISTS products (
        id VARCHAR(100) PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        category VARCHAR(100) DEFAULT 'Umum',
        description TEXT,
        price VARCHAR(100),
        price_self_drive VARCHAR(100),
        price_with_driver VARCHAR(100),
        period VARCHAR(50) DEFAULT '/hari',
        badge VARCHAR(100),
        image TEXT,
        specs JSONB DEFAULT '[]'::jsonb,
        pricing_tiers JSONB DEFAULT '[]'::jsonb,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);

      CREATE TABLE IF NOT EXISTS product_prices (
        id VARCHAR(100) PRIMARY KEY,
        product_id VARCHAR(100) NOT NULL,
        label VARCHAR(100) NOT NULL,
        price VARCHAR(100) NOT NULL,
        unit VARCHAR(100),
        is_default BOOLEAN DEFAULT FALSE,
        sort_order INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      CREATE INDEX IF NOT EXISTS idx_product_prices_product_id ON product_prices(product_id);

      CREATE TABLE IF NOT EXISTS product_images (
        id VARCHAR(100) PRIMARY KEY,
        product_id VARCHAR(100),
        url TEXT NOT NULL,
        file_name VARCHAR(255),
        slug VARCHAR(255),
        title VARCHAR(255),
        alt_text VARCHAR(255),
        caption TEXT,
        sort_order INT DEFAULT 0,
        is_primary BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      CREATE INDEX IF NOT EXISTS idx_product_images_product_id ON product_images(product_id);
    `);
  } else if (dbType === 'mysql') {
    await query(`
      CREATE TABLE IF NOT EXISTS products (
        \`id\` VARCHAR(100) PRIMARY KEY,
        \`title\` VARCHAR(255) NOT NULL,
        \`category\` VARCHAR(100) DEFAULT 'Umum',
        \`description\` TEXT,
        \`price\` VARCHAR(100),
        \`price_self_drive\` VARCHAR(100),
        \`price_with_driver\` VARCHAR(100),
        \`period\` VARCHAR(50) DEFAULT '/hari',
        \`badge\` VARCHAR(100),
        \`image\` TEXT,
        \`specs\` JSON,
        \`pricing_tiers\` JSON,
        \`is_active\` BOOLEAN DEFAULT TRUE,
        \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_products_category (\`category\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

      CREATE TABLE IF NOT EXISTS product_prices (
        \`id\` VARCHAR(100) PRIMARY KEY,
        \`product_id\` VARCHAR(100) NOT NULL,
        \`label\` VARCHAR(100) NOT NULL,
        \`price\` VARCHAR(100) NOT NULL,
        \`unit\` VARCHAR(100),
        \`is_default\` BOOLEAN DEFAULT FALSE,
        \`sort_order\` INT DEFAULT 0,
        \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_product_prices_product_id (\`product_id\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

      CREATE TABLE IF NOT EXISTS product_images (
        \`id\` VARCHAR(100) PRIMARY KEY,
        \`product_id\` VARCHAR(100),
        \`url\` TEXT NOT NULL,
        \`file_name\` VARCHAR(255),
        \`slug\` VARCHAR(255),
        \`title\` VARCHAR(255),
        \`alt_text\` VARCHAR(255),
        \`caption\` TEXT,
        \`sort_order\` INT DEFAULT 0,
        \`is_primary\` BOOLEAN DEFAULT FALSE,
        \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_product_images_product_id (\`product_id\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);
  }
};

export const down = async ({ query, getDbType }) => {
  const dbType = getDbType();
  if (dbType === 'postgres' || dbType === 'mysql') {
    await query('DROP TABLE IF EXISTS product_images;');
    await query('DROP TABLE IF EXISTS product_prices;');
    await query('DROP TABLE IF EXISTS products;');
  }
};
