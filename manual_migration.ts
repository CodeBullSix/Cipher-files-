import { db } from './src/db/index.js';
import { sql } from 'drizzle-orm';
async function main() {
  try {
    await db.execute(sql`CREATE TABLE "events" (
      "id" text PRIMARY KEY NOT NULL,
      "title" text NOT NULL,
      "description" text,
      "type" "event_type" NOT NULL,
      "date_string" text,
      "start_date" timestamp,
      "end_date" timestamp,
      "date_precision" "event_precision" DEFAULT 'EXACT' NOT NULL,
      "location" text,
      "verification_status" "entity_verification_status" DEFAULT 'UNVERIFIED' NOT NULL,
      "created_by" text NOT NULL,
      "created_at" timestamp DEFAULT now() NOT NULL,
      "updated_at" timestamp DEFAULT now() NOT NULL
    );`);
  } catch (e) {
    console.error(e);
  }
  process.exit(0);
}
main();
