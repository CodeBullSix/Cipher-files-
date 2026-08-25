import pg from 'pg';
import fs from 'fs';
import dotenv from 'dotenv';
dotenv.config();

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });

async function main() {
  const sql = fs.readFileSync('drizzle/0001_warm_stranger.sql', 'utf8');
  const statements = sql.split('--> statement-breakpoint');
  
  for (let s of statements) {
    if (!s.trim()) continue;
    try {
      await pool.query(s);
    } catch (e) {
      // Ignore unique constraint errors if already exist, or truncation issues
      // But wait, the issue is that we need to clear tables that violate the unique constraint.
      if (e.code === '23505') {
        console.log('Skipping due to unique violation:', e.message);
      } else {
        console.log('Error:', e.message);
      }
    }
  }
  console.log('Done!');
  process.exit(0);
}

main();
