export const up = async ({ query, getDbType }) => {
  const dbType = getDbType();
  if (dbType === 'postgres') {
    await query(`
      CREATE TABLE IF NOT EXISTS sys_themes (
        id VARCHAR(50) PRIMARY KEY,
        industry VARCHAR(50) NOT NULL,
        name VARCHAR(100) NOT NULL,
        description TEXT,
        preview_image TEXT,
        is_active BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS sys_landing_content (
        id SERIAL PRIMARY KEY,
        industry VARCHAR(50) NOT NULL,
        theme_id VARCHAR(50) NOT NULL,
        data JSONB NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
  } else if (dbType === 'mysql') {
    await query(`
      CREATE TABLE IF NOT EXISTS sys_themes (
        id VARCHAR(50) PRIMARY KEY,
        industry VARCHAR(50) NOT NULL,
        name VARCHAR(100) NOT NULL,
        description TEXT,
        preview_image TEXT,
        is_active BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

      CREATE TABLE IF NOT EXISTS sys_landing_content (
        id INT AUTO_INCREMENT PRIMARY KEY,
        industry VARCHAR(50) NOT NULL,
        theme_id VARCHAR(50) NOT NULL,
        data JSON NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);
  }
};

export const down = async ({ query, getDbType }) => {
  const dbType = getDbType();
  if (dbType === 'postgres' || dbType === 'mysql') {
    await query('DROP TABLE IF EXISTS sys_landing_content;');
    await query('DROP TABLE IF EXISTS sys_themes;');
  }
};
