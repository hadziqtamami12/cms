import dotenv from 'dotenv';
import pg from 'pg';

dotenv.config();

async function main() {
  const pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    const cols = await pool.query(`
      SELECT table_name, column_name, data_type, is_nullable 
      FROM information_schema.columns 
      WHERE table_schema = 'public' 
      ORDER BY table_name, ordinal_position;
    `);
    const tables = {};
    for (const row of cols.rows) {
      if (!tables[row.table_name]) tables[row.table_name] = [];
      tables[row.table_name].push(`${row.column_name} (${row.data_type}, nullable: ${row.is_nullable})`);
    }
    console.log(JSON.stringify(tables, null, 2));

    // Check if admin_settings has any rows
    const adminRows = await pool.query('SELECT id, username, email, admin_slug FROM admin_settings');
    console.log('admin_settings rows:', adminRows.rows);

    // Check if app_settings has any rows
    const appRows = await pool.query('SELECT key FROM app_settings');
    console.log('app_settings keys:', appRows.rows);

    // Check orders count
    const ordersCount = await pool.query('SELECT count(*) FROM orders');
    console.log('orders count:', ordersCount.rows[0]);

    // Check articles count
    const articlesCount = await pool.query('SELECT count(*) FROM articles');
    console.log('articles count:', articlesCount.rows[0]);

    // Check travel_trips count
    const tripsCount = await pool.query('SELECT count(*) FROM travel_trips');
    console.log('travel_trips count:', tripsCount.rows[0]);
  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}

main();
