import dotenv from 'dotenv';
import pg from 'pg';

dotenv.config();

async function main() {
  const pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    const res = await pool.query(`
      SELECT 
        tablename, 
        rowsecurity 
      FROM pg_tables 
      WHERE schemaname = 'public';
    `);
    console.log('Row security status:');
    console.table(res.rows);

    const policies = await pool.query(`
      SELECT 
        schemaname, 
        tablename, 
        policyname, 
        permissive, 
        roles, 
        cmd, 
        qual 
      FROM pg_policies 
      WHERE schemaname = 'public';
    `);
    console.log('Policies:');
    console.table(policies.rows);
  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}

main();
