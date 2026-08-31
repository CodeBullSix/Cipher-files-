CREATE TYPE "public"."appeal_status" AS ENUM('SUBMITTED', 'UNDER_REVIEW', 'UPHELD', 'OVERTURNED');--> statement-breakpoint
CREATE TYPE "public"."moderation_action" AS ENUM('APPROVE', 'REJECT', 'REMOVE', 'DISPUTE', 'RESTORE', 'LOCK', 'UNLOCK', 'BAN', 'UNBAN', 'RESOLVE', 'DISMISS', 'REPORT', 'ASSIGN', 'UNASSIGN', 'APPEAL', 'UPHOLD', 'OVERTURN');--> statement-breakpoint
CREATE TYPE "public"."notification_type" AS ENUM('DISCUSSION_REPLY', 'ACHIEVEMENT_UNLOCKED', 'LEVEL_UP', 'REPUTATION_MILESTONE', 'CONTRIBUTION_STATUS', 'SYSTEM', 'NEW_FOLLOWER');--> statement-breakpoint
CREATE TYPE "public"."report_reason" AS ENUM('SPAM', 'HARASSMENT', 'MISINFORMATION', 'INAPPROPRIATE', 'OTHER');--> statement-breakpoint
CREATE TYPE "public"."report_status" AS ENUM('OPEN', 'UNDER_REVIEW', 'RESOLVED', 'DISMISSED');--> statement-breakpoint
ALTER TYPE "public"."rep_event_type" ADD VALUE 'EVIDENCE_VERIFIED';--> statement-breakpoint
ALTER TYPE "public"."rep_event_type" ADD VALUE 'MANUAL_REWARD';--> statement-breakpoint
ALTER TYPE "public"."rep_event_type" ADD VALUE 'PENALTY';--> statement-breakpoint
ALTER TYPE "public"."rep_event_type" ADD VALUE 'DISCUSSION_REPLY';--> statement-breakpoint
CREATE TABLE "appeals" (
	"id" text PRIMARY KEY NOT NULL,
	"appellant_id" text NOT NULL,
	"target_type" text NOT NULL,
	"target_id" text NOT NULL,
	"original_moderator_id" text,
	"reason" text NOT NULL,
	"status" "appeal_status" DEFAULT 'SUBMITTED' NOT NULL,
	"resolution_reason" text,
	"resolved_by_id" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"resolved_at" timestamp,
	CONSTRAINT "unique_active_appeal" UNIQUE("appellant_id","target_type","target_id")
);
--> statement-breakpoint
CREATE TABLE "moderation_logs" (
	"id" text PRIMARY KEY NOT NULL,
	"actor_id" text NOT NULL,
	"action" "moderation_action" NOT NULL,
	"target_type" text NOT NULL,
	"target_id" text NOT NULL,
	"reason" text,
	"previous_status" text,
	"new_status" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "notifications" (
	"id" uuid PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"type" "notification_type" NOT NULL,
	"title" text NOT NULL,
	"message" text NOT NULL,
	"related_record_id" text,
	"related_record_type" text,
	"is_read" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "reports" (
	"id" text PRIMARY KEY NOT NULL,
	"reporter_id" text NOT NULL,
	"target_type" text NOT NULL,
	"target_id" text NOT NULL,
	"target_author_id" text,
	"reason" "report_reason" NOT NULL,
	"description" text,
	"status" "report_status" DEFAULT 'OPEN' NOT NULL,
	"assignee_id" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"resolved_at" timestamp,
	"resolved_by_id" text,
	CONSTRAINT "unique_report" UNIQUE("reporter_id","target_id")
);
--> statement-breakpoint
CREATE TABLE "user_achievements" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"achievement_id" varchar(255) NOT NULL,
	"earned_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "unique_user_achievement" UNIQUE("user_id","achievement_id")
);
--> statement-breakpoint
CREATE TABLE "user_follows" (
	"follower_id" text NOT NULL,
	"following_id" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_follows_follower_id_following_id_pk" PRIMARY KEY("follower_id","following_id")
);
--> statement-breakpoint
ALTER TABLE "case_locations" DROP CONSTRAINT "unique_case_location";--> statement-breakpoint
ALTER TABLE "case_organisations" DROP CONSTRAINT "unique_case_organisation";--> statement-breakpoint
ALTER TABLE "case_people" DROP CONSTRAINT "unique_case_person";--> statement-breakpoint
ALTER TABLE "case_files" ADD COLUMN "deleted_at" timestamp;--> statement-breakpoint
ALTER TABLE "documents" ADD COLUMN "deleted_at" timestamp;--> statement-breakpoint
ALTER TABLE "entity_relationships" ADD COLUMN "deleted_at" timestamp;--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "deleted_at" timestamp;--> statement-breakpoint
ALTER TABLE "evidence_items" ADD COLUMN "assignee_id" text;--> statement-breakpoint
ALTER TABLE "investigation_workspaces" ADD COLUMN "deleted_at" timestamp;--> statement-breakpoint
ALTER TABLE "locations" ADD COLUMN "deleted_at" timestamp;--> statement-breakpoint
ALTER TABLE "organisations" ADD COLUMN "deleted_at" timestamp;--> statement-breakpoint
ALTER TABLE "people" ADD COLUMN "deleted_at" timestamp;--> statement-breakpoint
ALTER TABLE "reputation_events" ADD COLUMN "points" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "reputation_events" ADD COLUMN "related_record_id" text;--> statement-breakpoint
ALTER TABLE "reputation_events" ADD COLUMN "reason" text;--> statement-breakpoint
ALTER TABLE "sources" ADD COLUMN "deleted_at" timestamp;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "deleted_at" timestamp;--> statement-breakpoint
ALTER TABLE "workspace_connections" ADD COLUMN "deleted_at" timestamp;--> statement-breakpoint
ALTER TABLE "workspace_notes" ADD COLUMN "deleted_at" timestamp;--> statement-breakpoint
ALTER TABLE "appeals" ADD CONSTRAINT "appeals_appellant_id_users_uid_fk" FOREIGN KEY ("appellant_id") REFERENCES "public"."users"("uid") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "appeals" ADD CONSTRAINT "appeals_original_moderator_id_users_uid_fk" FOREIGN KEY ("original_moderator_id") REFERENCES "public"."users"("uid") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "appeals" ADD CONSTRAINT "appeals_resolved_by_id_users_uid_fk" FOREIGN KEY ("resolved_by_id") REFERENCES "public"."users"("uid") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "moderation_logs" ADD CONSTRAINT "moderation_logs_actor_id_users_uid_fk" FOREIGN KEY ("actor_id") REFERENCES "public"."users"("uid") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_users_uid_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("uid") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reports" ADD CONSTRAINT "reports_reporter_id_users_uid_fk" FOREIGN KEY ("reporter_id") REFERENCES "public"."users"("uid") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reports" ADD CONSTRAINT "reports_target_author_id_users_uid_fk" FOREIGN KEY ("target_author_id") REFERENCES "public"."users"("uid") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reports" ADD CONSTRAINT "reports_assignee_id_users_uid_fk" FOREIGN KEY ("assignee_id") REFERENCES "public"."users"("uid") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reports" ADD CONSTRAINT "reports_resolved_by_id_users_uid_fk" FOREIGN KEY ("resolved_by_id") REFERENCES "public"."users"("uid") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_achievements" ADD CONSTRAINT "user_achievements_user_id_users_uid_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("uid") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_follows" ADD CONSTRAINT "user_follows_follower_id_users_uid_fk" FOREIGN KEY ("follower_id") REFERENCES "public"."users"("uid") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_follows" ADD CONSTRAINT "user_follows_following_id_users_uid_fk" FOREIGN KEY ("following_id") REFERENCES "public"."users"("uid") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "evidence_items" ADD CONSTRAINT "evidence_items_assignee_id_users_uid_fk" FOREIGN KEY ("assignee_id") REFERENCES "public"."users"("uid") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "case_locs_case_id_idx" ON "case_locations" USING btree ("case_file_id");--> statement-breakpoint
CREATE INDEX "case_orgs_case_id_idx" ON "case_organisations" USING btree ("case_file_id");--> statement-breakpoint
CREATE INDEX "case_people_case_id_idx" ON "case_people" USING btree ("case_file_id");--> statement-breakpoint
ALTER TABLE "reputation_events" ADD CONSTRAINT "unique_user_rep_event" UNIQUE("user_id","type","related_record_id");