export const up = async ({ query, getDbType }) => {
  const dbType = getDbType();
  if (dbType === 'postgres') {
    await query(`
      CREATE TABLE IF NOT EXISTS sys_seo_services (
        service_id VARCHAR(50) PRIMARY KEY,
        service_name VARCHAR(100) NOT NULL,
        is_connected BOOLEAN DEFAULT FALSE,
        connection_token TEXT,
        property_id VARCHAR(100),
        last_synced_at TIMESTAMP,
        cached_metrics JSONB DEFAULT '{}'::jsonb,
        cached_queries JSONB DEFAULT '[]'::jsonb,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      ALTER TABLE sys_seo_marketing 
      ADD COLUMN IF NOT EXISTS gsc_connected BOOLEAN DEFAULT FALSE,
      ADD COLUMN IF NOT EXISTS ga4_connected BOOLEAN DEFAULT FALSE,
      ADD COLUMN IF NOT EXISTS gads_connected BOOLEAN DEFAULT FALSE;
    `);
  } else if (dbType === 'mysql') {
    await query(`
      CREATE TABLE IF NOT EXISTS sys_seo_services (
        service_id VARCHAR(50) PRIMARY KEY,
        service_name VARCHAR(100) NOT NULL,
        is_connected BOOLEAN DEFAULT FALSE,
        connection_token TEXT,
        property_id VARCHAR(100),
        last_synced_at DATETIME,
        cached_metrics JSON,
        cached_queries JSON,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

      ALTER TABLE sys_seo_marketing 
      ADD COLUMN gsc_connected BOOLEAN DEFAULT FALSE,
      ADD COLUMN ga4_connected BOOLEAN DEFAULT FALSE,
      ADD COLUMN gads_connected BOOLEAN DEFAULT FALSE;
    `);
  }
};

export const down = async ({ query, getDbType }) => {
  const dbType = getDbType();
  if (dbType === 'postgres' || dbType === 'mysql') {
    await query('DROP TABLE IF EXISTS sys_seo_services;');
  }
};
