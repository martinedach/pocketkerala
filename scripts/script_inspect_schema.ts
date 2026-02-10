import { Client } from 'pg';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env' });

// Credentials from process.env (loaded from .env)
const config = {
  user: process.env.SUPABASE_DB_USER,
  password: process.env.SUPABASE_DB_PASSWORD,
  host: process.env.SUPABASE_DB_HOST,
  port: parseInt(process.env.SUPABASE_DB_PORT || '5432'),
  database: process.env.SUPABASE_DB_NAME,
  ssl: { rejectUnauthorized: false }
};

async function inspect() {
  console.log('Connecting with config:', { ...config, password: '****' });
  const client = new Client(config);
  try {
    await client.connect();
    console.log('Connected to database.');

    const tablesQuery = `
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `;
    const tablesRes = await client.query(tablesQuery);
    
    console.log('\n--- TABLES ---');
    for (const row of tablesRes.rows) {
      console.log(`Table: ${row.table_name}`);
      
      const columnsQuery = `
        SELECT column_name, data_type, is_nullable
        FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = $1
        ORDER BY ordinal_position;
      `;
      const columnsRes = await client.query(columnsQuery, [row.table_name]);
      columnsRes.rows.forEach(col => {
        console.log(`  - ${col.column_name} (${col.data_type}, ${col.is_nullable === 'YES' ? 'nullable' : 'not null'})`);
      });
      console.log('');
    }

  } catch (err) {
    console.error('Error:', err);
  } finally {
    await client.end();
  }
}

inspect();
