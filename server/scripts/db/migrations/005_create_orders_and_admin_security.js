export const up = async ({ query, getDbType }) => {
  const dbType = getDbType();
  if (dbType === 'postgres') {
    await query(`
      CREATE TABLE IF NOT EXISTS orders (
        id VARCHAR(100) PRIMARY KEY,
        customer_name VARCHAR(150) NOT NULL,
        customer_phone VARCHAR(50) NOT NULL,
        customer_email VARCHAR(150),
        item_details JSONB NOT NULL,
        transaction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        total_amount NUMERIC(15, 2) DEFAULT 0,
        status VARCHAR(30) DEFAULT 'pending',
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS admin_settings (
        id VARCHAR(50) PRIMARY KEY,
        username VARCHAR(100) NOT NULL,
        email VARCHAR(150),
        password_hash VARCHAR(255) NOT NULL,
        admin_slug VARCHAR(100) DEFAULT 'admin',
        token_version INT DEFAULT 1,
        last_login_at TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS seo_metrics (
        id SERIAL PRIMARY KEY,
        metric_date DATE NOT NULL UNIQUE,
        daily_visitors INT DEFAULT 0,
        page_views INT DEFAULT 0,
        gsc_clicks INT DEFAULT 0,
        gsc_impressions INT DEFAULT 0,
        avg_position NUMERIC(4, 1) DEFAULT 0,
        ctr NUMERIC(5, 2) DEFAULT 0,
        traffic_sources JSONB DEFAULT '{"direct": 40, "organic": 35, "referral": 15, "social": 10}'::jsonb,
        top_keywords JSONB DEFAULT '[]'::jsonb,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
  } else if (dbType === 'mysql') {
    await query(`
      CREATE TABLE IF NOT EXISTS orders (
        id VARCHAR(100) PRIMARY KEY,
        customer_name VARCHAR(150) NOT NULL,
        customer_phone VARCHAR(50) NOT NULL,
        customer_email VARCHAR(150),
        item_details JSON NOT NULL,
        transaction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        total_amount DECIMAL(15, 2) DEFAULT 0,
        status VARCHAR(30) DEFAULT 'pending',
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

      CREATE TABLE IF NOT EXISTS admin_settings (
        id VARCHAR(50) PRIMARY KEY,
        username VARCHAR(100) NOT NULL,
        email VARCHAR(150),
        password_hash VARCHAR(255) NOT NULL,
        admin_slug VARCHAR(100) DEFAULT 'admin',
        token_version INT DEFAULT 1,
        last_login_at TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

      CREATE TABLE IF NOT EXISTS seo_metrics (
        id INT AUTO_INCREMENT PRIMARY KEY,
        metric_date DATE NOT NULL UNIQUE,
        daily_visitors INT DEFAULT 0,
        page_views INT DEFAULT 0,
        gsc_clicks INT DEFAULT 0,
        gsc_impressions INT DEFAULT 0,
        avg_position DECIMAL(4, 1) DEFAULT 0,
        ctr DECIMAL(5, 2) DEFAULT 0,
        traffic_sources JSON,
        top_keywords JSON,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);
  }
};

export const down = async ({ query, getDbType }) => {
  const dbType = getDbType();
  if (dbType === 'postgres' || dbType === 'mysql') {
    await query('DROP TABLE IF EXISTS seo_metrics;');
    await query('DROP TABLE IF EXISTS admin_settings;');
    await query('DROP TABLE IF EXISTS orders;');
  }
};
