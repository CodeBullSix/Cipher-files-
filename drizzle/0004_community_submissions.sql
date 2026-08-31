CREATE TYPE "public"."submission_status" AS ENUM('DRAFT', 'PENDING_REVIEW', 'IN_REVIEW', 'RETURNED', 'APPROVED', 'REJECTED');--> statement-breakpoint
CREATE TYPE "public"."submission_type" AS ENUM('CASE', 'EVIDENCE', 'ENTITY', 'RELATIONSHIP', 'EVENT', 'OTHER');--> statement-breakpoint
CREATE TABLE "community_submissions" (
	"id" text PRIMARY KEY NOT NULL,
	"type" "submission_type" NOT NULL,
	"status" "submission_status" DEFAULT 'PENDING_REVIEW' NOT NULL,
	"title" text NOT NULL,
	"summary" text,
	"content" jsonb NOT NULL,
	"submitted_by_id" text NOT NULL,
	"reviewer_id" text,
	"review_decision" text,
	"review_notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
ALTER TABLE "community_submissions" ADD CONSTRAINT "community_submissions_submitted_by_id_users_uid_fk" FOREIGN KEY ("submitted_by_id") REFERENCES "public"."users"("uid") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "community_submissions" ADD CONSTRAINT "community_submissions_reviewer_id_users_uid_fk" FOREIGN KEY ("reviewer_id") REFERENCES "public"."users"("uid") ON DELETE no action ON UPDATE no action;