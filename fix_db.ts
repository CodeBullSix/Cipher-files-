import { db } from './src/db/index.js';
import { sql } from 'drizzle-orm';
async function run() {
  await db.execute(sql`
    DO $$ BEGIN
      CREATE TYPE submission_type AS ENUM ('CASE', 'EVIDENCE', 'ENTITY', 'RELATIONSHIP', 'EVENT', 'OTHER');
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;
    
    DO $$ BEGIN
      CREATE TYPE submission_status AS ENUM ('DRAFT', 'PENDING_REVIEW', 'IN_REVIEW', 'RETURNED', 'APPROVED', 'REJECTED');
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;

    CREATE TABLE IF NOT EXISTS "community_submissions" (
      "id" text PRIMARY KEY NOT NULL,
      "type" submission_type NOT NULL,
      "status" submission_status DEFAULT 'PENDING_REVIEW' NOT NULL,
      "title" text NOT NULL,
      "summary" text,
      "content" jsonb NOT NULL,
      "submitted_by_id" text NOT NULL REFERENCES users(uid),
      "reviewer_id" text REFERENCES users(uid),
      "review_decision" text,
      "review_notes" text,
      "created_at" timestamp DEFAULT now() NOT NULL,
      "updated_at" timestamp DEFAULT now() NOT NULL,
      "deleted_at" timestamp
    );
  `);
  console.log("Database updated manually.");
  process.exit(0);
}
run().catch(console.error);
