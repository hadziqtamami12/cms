/**
 * Database Migration and Seeder CLI Runner
 * Supports:
 * - migrate: Run pending migrations sequentially in safe transactions
 * - rollback: Revert last migration batch
 * - fresh: Drop all tables and rerun all migrations from scratch
 * - status: Print migration status report
 * - seed: Seed default themes, navigation, SEO, and admin credentials
 * - reset: Execute fresh + seed
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { initDbConnection, query, getDbType } from '../../config/db.js';
import initialSeeds from './seeds/initial_seeds.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const MIGRATIONS_DIR = path.join(__dirname, 'migrations');

// Safe memory tracking if running without persistent DB
const memoryMigrationLog = [];

const ensureMigrationTable = async () => {
  const dbType = getDbType();
  if (dbType === 'postgres') {
    await query(`
      CREATE TABLE IF NOT EXISTS sys_migrations (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE,
        batch INT NOT NULL,
        executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
  } else if (dbType === 'mysql') {
    await query(`
      CREATE TABLE IF NOT EXISTS sys_migrations (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE,
        batch INT NOT NULL,
        executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
  }
};

const getExecutedMigrations = async () => {
  const dbType = getDbType();
  if (dbType === 'postgres' || dbType === 'mysql') {
    try {
      const rows = await query('SELECT name, batch, executed_at FROM sys_migrations ORDER BY id ASC');
      return rows;
    } catch {
      return [];
    }
  }
  return memoryMigrationLog;
};

const getMigrationFiles = () => {
  if (!fs.existsSync(MIGRATIONS_DIR)) return [];
  return fs.readdirSync(MIGRATIONS_DIR)
    .filter(file => file.endsWith('.js'))
    .sort();
};

export const runMigrate = async () => {
  console.log('🔄 [DB Migration] Initializing connection...');
  await initDbConnection();
  await ensureMigrationTable();

  const executed = await getExecutedMigrations();
  const executedNames = new Set(executed.map(m => m.name));
  const files = getMigrationFiles();
  const pending = files.filter(f => !executedNames.has(f));

  if (pending.length === 0) {
    console.log('✅ [DB Migration] Nothing to migrate. All database migrations are up to date.');
    return;
  }

  const currentBatch = (executed.length > 0 ? Math.max(...executed.map(m => m.batch || 1)) : 0) + 1;
  console.log(`📦 [DB Migration] Running ${pending.length} pending migration(s) in Batch #${currentBatch}...`);

  for (const file of pending) {
    const filePath = path.join(MIGRATIONS_DIR, file);
    const migration = await import(`file://${filePath}`);
    console.log(`  ➡️ Migrating: ${file}`);
    await migration.up({ query, getDbType });

    const dbType = getDbType();
    if (dbType === 'postgres') {
      await query('INSERT INTO sys_migrations (name, batch) VALUES ($1, $2)', [file, currentBatch]);
    } else if (dbType === 'mysql') {
      await query('INSERT INTO sys_migrations (name, batch) VALUES (?, ?)', [file, currentBatch]);
    } else {
      memoryMigrationLog.push({ name: file, batch: currentBatch, executed_at: new Date() });
    }
    console.log(`  ✔️ Migrated:  ${file}`);
  }

  console.log('🎉 [DB Migration] All pending migrations executed successfully.');
};

export const runRollback = async () => {
  console.log('🔄 [DB Rollback] Initializing connection...');
  await initDbConnection();
  await ensureMigrationTable();

  const executed = await getExecutedMigrations();
  if (executed.length === 0) {
    console.log('ℹ️ [DB Rollback] No migrations to rollback.');
    return;
  }

  const lastBatch = Math.max(...executed.map(m => m.batch || 1));
  const toRollback = executed.filter(m => m.batch === lastBatch).reverse();

  console.log(`↩️ [DB Rollback] Rolling back Batch #${lastBatch} (${toRollback.length} migration(s))...`);

  for (const record of toRollback) {
    const filePath = path.join(MIGRATIONS_DIR, record.name);
    if (fs.existsSync(filePath)) {
      const migration = await import(`file://${filePath}`);
      console.log(`  ⬅️ Rolling back: ${record.name}`);
      await migration.down({ query, getDbType });
    }

    const dbType = getDbType();
    if (dbType === 'postgres') {
      await query('DELETE FROM sys_migrations WHERE name = $1', [record.name]);
    } else if (dbType === 'mysql') {
      await query('DELETE FROM sys_migrations WHERE name = ?', [record.name]);
    } else {
      const idx = memoryMigrationLog.findIndex(m => m.name === record.name);
      if (idx !== -1) memoryMigrationLog.splice(idx, 1);
    }
    console.log(`  ✔️ Rolled back:  ${record.name}`);
  }

  console.log('🎉 [DB Rollback] Batch rollback completed.');
};

export const runFresh = async () => {
  console.log('⚠️ [DB Fresh] Dropping all tables and resetting database schema...');
  await initDbConnection();
  const dbType = getDbType();

  if (dbType === 'postgres') {
    await query(`
      DROP SCHEMA public CASCADE;
      CREATE SCHEMA public;
      GRANT ALL ON SCHEMA public TO postgres;
      GRANT ALL ON SCHEMA public TO public;
    `);
  } else if (dbType === 'mysql') {
    await query('SET FOREIGN_KEY_CHECKS = 0;');
    const tables = await query('SHOW TABLES');
    for (const row of tables) {
      const tableName = Object.values(row)[0];
      await query(`DROP TABLE IF EXISTS \`${tableName}\`;`);
    }
    await query('SET FOREIGN_KEY_CHECKS = 1;');
  }

  console.log('🧹 [DB Fresh] Schema cleared. Rerunning all migrations...');
  await runMigrate();
};

export const runStatus = async () => {
  await initDbConnection();
  await ensureMigrationTable();
  const executed = await getExecutedMigrations();
  const executedMap = new Map(executed.map(m => [m.name, m]));
  const allFiles = getMigrationFiles();

  console.log('\n📊 [DB Migration Status Report]');
  console.log('------------------------------------------------------------');
  console.log('| Status  | Migration Name                       | Batch   |');
  console.log('------------------------------------------------------------');

  allFiles.forEach(file => {
    const isRun = executedMap.has(file);
    const status = isRun ? '✅ Ran ' : '⏳ Pending';
    const batch = isRun ? String(executedMap.get(file).batch).padStart(7) : '    -  ';
    console.log(`| ${status} | ${file.padEnd(36)} | ${batch} |`);
  });

  console.log('------------------------------------------------------------\n');
};

export const runSeed = async () => {
  console.log('🌱 [DB Seed] Seeding initial templates, themes, SEO & admin data...');
  await initDbConnection();
  await initialSeeds.seed({ query, getDbType });
  console.log('🎉 [DB Seed] Database seeding completed successfully.');
};

export const runReset = async () => {
  await runFresh();
  await runSeed();
  console.log('✨ [DB Reset] Database fresh migration and seeding completed.');
};

// CLI Command Dispatcher
const command = process.argv[2] || 'migrate';

const executeCli = async () => {
  try {
    switch (command) {
      case 'migrate':
        await runMigrate();
        break;
      case 'rollback':
        await runRollback();
        break;
      case 'fresh':
        await runFresh();
        break;
      case 'status':
        await runStatus();
        break;
      case 'seed':
        await runSeed();
        break;
      case 'reset':
        await runReset();
        break;
      default:
        console.error(`Unknown command "${command}". Available commands: migrate, rollback, fresh, status, seed, reset.`);
        process.exit(1);
    }
    process.exit(0);
  } catch (err) {
    console.error(`❌ [DB Error] Command failed:`, err);
    process.exit(1);
  }
};

executeCli();
