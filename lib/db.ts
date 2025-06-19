import { Pool } from 'pg';
import { neon } from '@neondatabase/serverless';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL is not set');
}

// Use the neon driver for serverless environment
export const sql = neon(connectionString);

// You can also create a standard pg Pool if needed for specific operations
// const pool = new Pool({ connectionString });
// export { pool };

// Helper function to execute queries (optional, but can simplify API routes)
// export async function query(text: string, params?: any[]) {
//   const client = await pool.connect();
//   try {
//     const result = await client.query(text, params);
//     return result;
//   } finally {
//     client.release();
//   }
// } 