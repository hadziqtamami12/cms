export const up = async ({ query, getDbType }) => {
  const dbType = getDbType();
  if (dbType === 'postgres') {
    await query(`
      CREATE TABLE IF NOT EXISTS sys_licenses (
        id SERIAL PRIMARY KEY,
        license_key VARCHAR(32) NOT NULL UNIQUE,
        client_name VARCHAR(255) NOT NULL,
        license_type VARCHAR(50) NOT NULL,
        duration_days INT NOT NULL,
        issued_at TIMESTAMP NOT NULL,
        expires_at TIMESTAMP NOT NULL,
        is_active BOOLEAN DEFAULT TRUE,
        is_approved BOOLEAN DEFAULT FALSE,
        approval_note TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      CREATE INDEX IF NOT EXISTS idx_license_key ON sys_licenses(license_key);
    `);
  } else if (dbType === 'mysql') {
    await query(`
      CREATE TABLE IF NOT EXISTS sys_licenses (
        id INT AUTO_INCREMENT PRIMARY KEY,
        license_key VARCHAR(32) NOT NULL UNIQUE,
        client_name VARCHAR(255) NOT NULL,
        license_type VARCHAR(50) NOT NULL,
        duration_days INT NOT NULL,
        issued_at DATETIME NOT NULL,
        expires_at DATETIME NOT NULL,
        is_active BOOLEAN DEFAULT TRUE,
        is_approved BOOLEAN DEFAULT FALSE,
        approval_note TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_license_key (license_key)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);
  }
};

export const down = async ({ query, getDbType }) => {
  const dbType = getDbType();
  if (dbType === 'postgres' || dbType === 'mysql') {
    await query('DROP TABLE IF EXISTS sys_licenses;');
  }
};
