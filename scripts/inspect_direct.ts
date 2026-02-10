import { Client } from 'pg';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env' });

// Parse project ref from user string or just hardcode for this attempt
// User in env: postgres.gkfruyfgkllgdlzagype => ref: gkfruyfgkllgdlzagype
const projectRef = 'gkfruyfgkllgdlzagype';
const dbPassword = process.env.SUPABASE_DB_PASSWORD;

const config = {
  user: 'postgres',
  password: dbPassword,
  host: `db.${projectRef}.supabase.co`,
  port: 5432,
  database: 'postgres',
  ssl: { rejectUnauthorized: false }
};

async function inspect() {
  console.log('Connecting to direct DB...');
  console.log('Host:', config.host);
  
  const client = new Client(config);
  try {
    await client.connect();
    console.log('Connected!');

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
        console.log(`  - ${col.column_name} (${col.data_type})`);
      });
      console.log('');
    }

  } catch (err) {
    console.error('Connection failed:', err);
  } finally {
    await client.end();
  }
}

inspect();
