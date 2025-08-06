import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();
// I use my  local  database and credentials
export const pool = new Pool({
  host:'localhost',   // my  local computer port 
  port: 5432,
  user: 'postgres',   // my  username
  password: '123',  // my  password
  database: 'database',  // my database
});

// Test connection on startup
pool.connect()
  .then(client => {
    console.log('✅ PostgreSQL connection successful');
    client.release(); // always release!
  })
  .catch(err => {
    console.error('❌ PostgreSQL connection failed:', err);
    process.exit(1); // optional: exit process if DB is required
  });
