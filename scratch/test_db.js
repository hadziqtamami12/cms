import dotenv from 'dotenv';
import pg from 'pg';

dotenv.config();

async function main() {
  console.log('Testing Supabase PG connection...');
  console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'Defined' : 'NOT DEFINED');
  console.log('SUPABASE_URL:', process.env.SUPABASE_URL);

  const pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    const res = await pool.query('SELECT NOW() as now, current_database() as db');
    console.log('PG Success:', res.rows[0]);

    const tables = await pool.query("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'");
    console.log('Tables in public schema:', tables.rows.map(r => r.table_name));

    // Test Supabase Storage REST API
    const bucket = process.env.SUPABASE_STORAGE_BUCKET || 'cms';
    const storageUrl = `${process.env.SUPABASE_URL}/storage/v1/bucket`;
    console.log('Testing Supabase Storage at:', storageUrl);

    const bucketRes = await fetch(storageUrl, {
      headers: {
        Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
        apikey: process.env.SUPABASE_SERVICE_ROLE_KEY
      }
    });
    console.log('Bucket list status:', bucketRes.status);
    if (bucketRes.ok) {
      const buckets = await bucketRes.json();
      console.log('Available buckets:', buckets.map(b => ({ id: b.id, name: b.name, public: b.public })));
    } else {
      console.log('Bucket list response:', await bucketRes.text());
    }
  } catch (err) {
    console.error('Error during test:', err);
  } finally {
    await pool.end();
  }
}

main();
