import { db } from './src/db/index.js';
import { sql } from 'drizzle-orm';
import fs from 'fs';
const migrationSql = fs.readFileSync('drizzle/0002_lethal_human_robot.sql', 'utf8');
const statements = migrationSql.split('--> statement-breakpoint');
for (const stmt of statements) {
  if (stmt.trim()) {
    console.log('Running:', stmt.trim().substring(0, 50));
    await db.execute(sql.raw(stmt.trim()));
  }
}
console.log('Migration complete');
process.exit(0);
