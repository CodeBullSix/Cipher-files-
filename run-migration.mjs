import pg from 'pg';
import fs from 'fs';
import dotenv from 'dotenv';
dotenv.config();
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const sql = fs.readFileSync('drizzle/0002_lethal_human_robot.sql', 'utf8');
const statements = sql.split('--> statement-breakpoint');
for (const stmt of statements) {
  if (stmt.trim()) {
    console.log('Running:', stmt.trim().substring(0, 50));
    await pool.query(stmt.trim());
  }
}
console.log('Migration complete');
process.exit(0);
