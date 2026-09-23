export const up = async ({ query, getDbType }) => {
  const dbType = getDbType();
  if (dbType === 'postgres') {
    await query(`
      CREATE TABLE IF NOT EXISTS sys_configs (
        key VARCHAR(100) PRIMARY KEY,
        value JSONB NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
  } else if (dbType === 'mysql') {
    await query(`
      CREATE TABLE IF NOT EXISTS sys_configs (
        \`key\` VARCHAR(100) PRIMARY KEY,
        \`value\` JSON NOT NULL,
        \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);
  }
};

export const down = async ({ query, getDbType }) => {
  const dbType = getDbType();
  if (dbType === 'postgres' || dbType === 'mysql') {
    await query('DROP TABLE IF EXISTS sys_configs;');
  }
};
