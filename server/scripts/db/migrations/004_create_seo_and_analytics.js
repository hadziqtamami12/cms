export const up = async ({ query, getDbType }) => {
  const dbType = getDbType();
  if (dbType === 'postgres') {
    await query(`
      CREATE TABLE IF NOT EXISTS sys_seo_marketing (
        id SERIAL PRIMARY KEY,
        target_keywords JSONB DEFAULT '[]'::jsonb,
        meta_title VARCHAR(255),
        meta_description TEXT,
        canonical_url VARCHAR(255),
        gsc_verification VARCHAR(255),
        ga_measurement_id VARCHAR(50),
        gtm_id VARCHAR(50),
        meta_pixel_id VARCHAR(50),
        google_ads_id VARCHAR(50),
        ahrefs_verification VARCHAR(255),
        gmb_place_id VARCHAR(100),
        gmb_embed_url TEXT,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS sys_leads (
        id SERIAL PRIMARY KEY,
        name VARCHAR(150) NOT NULL,
        phone VARCHAR(50) NOT NULL,
        email VARCHAR(150),
        item_id VARCHAR(100),
        message TEXT,
        booking_dates JSONB,
        status VARCHAR(30) DEFAULT 'new',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
  } else if (dbType === 'mysql') {
    await query(`
      CREATE TABLE IF NOT EXISTS sys_seo_marketing (
        id INT AUTO_INCREMENT PRIMARY KEY,
        target_keywords JSON,
        meta_title VARCHAR(255),
        meta_description TEXT,
        canonical_url VARCHAR(255),
        gsc_verification VARCHAR(255),
        ga_measurement_id VARCHAR(50),
        gtm_id VARCHAR(50),
        meta_pixel_id VARCHAR(50),
        google_ads_id VARCHAR(50),
        ahrefs_verification VARCHAR(255),
        gmb_place_id VARCHAR(100),
        gmb_embed_url TEXT,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

      CREATE TABLE IF NOT EXISTS sys_leads (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(150) NOT NULL,
        phone VARCHAR(50) NOT NULL,
        email VARCHAR(150),
        item_id VARCHAR(100),
        message TEXT,
        booking_dates JSON,
        status VARCHAR(30) DEFAULT 'new',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);
  }
};

export const down = async ({ query, getDbType }) => {
  const dbType = getDbType();
  if (dbType === 'postgres' || dbType === 'mysql') {
    await query('DROP TABLE IF EXISTS sys_leads;');
    await query('DROP TABLE IF EXISTS sys_seo_marketing;');
  }
};
