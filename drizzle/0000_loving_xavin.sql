CREATE TYPE "public"."audit_action" AS ENUM('SUBMITTED', 'EDITED', 'REVIEW_STARTED', 'VERIFIED', 'DISPUTED', 'REJECTED', 'RESTORED', 'DELETED');--> statement-breakpoint
CREATE TYPE "public"."case_status" AS ENUM('CONFIRMED', 'DOCUMENTED', 'DISPUTED', 'UNVERIFIED', 'DEBUNKED', 'UNKNOWN');--> statement-breakpoint
CREATE TYPE "public"."evidence_stance" AS ENUM('SUPPORTING', 'CONTRADICTING', 'CONTEXTUAL', 'UNDETERMINED');--> statement-breakpoint
CREATE TYPE "public"."evidence_status" AS ENUM('UNVERIFIED', 'UNDER_REVIEW', 'VERIFIED', 'DISPUTED', 'REJECTED');--> statement-breakpoint
CREATE TYPE "public"."evidence_type" AS ENUM('DOCUMENT', 'PHOTOGRAPH', 'VIDEO', 'AUDIO', 'TESTIMONY', 'OFFICIAL_RECORD', 'NEWS_REPORT', 'INTERVIEW', 'DATASET', 'ARCHIVED_WEBPAGE', 'OTHER');--> statement-breakpoint
CREATE TYPE "public"."rep_event_type" AS ENUM('CREATED_DISCUSSION', 'CREATED_CASE', 'CONTRIBUTED_EVIDENCE', 'FACT_CHECKED', 'RECEIVED_UPVOTE');--> statement-breakpoint
CREATE TYPE "public"."source_reliability" AS ENUM('HIGH', 'MEDIUM', 'LOW', 'UNKNOWN');--> statement-breakpoint
CREATE TYPE "public"."source_type" AS ENUM('PRIMARY', 'SECONDARY', 'TERTIARY', 'ARCHIVAL', 'OFFICIAL', 'JOURNALISTIC', 'ACADEMIC', 'WITNESS', 'USER_SUBMITTED', 'OTHER');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('USER', 'CONTRIBUTOR', 'MODERATOR', 'ADMIN');--> statement-breakpoint
CREATE TABLE "case_files" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"slug" text NOT NULL,
	"summary" text NOT NULL,
	"description" text,
	"category" text NOT NULL,
	"status" "case_status" NOT NULL,
	"featured" boolean DEFAULT false NOT NULL,
	"created_by" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "case_files_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "discussion_replies" (
	"id" text PRIMARY KEY NOT NULL,
	"discussion_id" text NOT NULL,
	"author_id" text NOT NULL,
	"content" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "discussion_votes" (
	"id" text PRIMARY KEY NOT NULL,
	"discussion_id" text NOT NULL,
	"author_id" text NOT NULL,
	"value" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "unique_vote" UNIQUE("discussion_id","author_id")
);
--> statement-breakpoint
CREATE TABLE "discussions" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"content" text NOT NULL,
	"author_id" text NOT NULL,
	"case_file_id" text,
	"locked" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "documents" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"file_name" text NOT NULL,
	"file_type" text NOT NULL,
	"file_size" integer NOT NULL,
	"storage_key" text NOT NULL,
	"checksum" text,
	"page_count" integer,
	"uploaded_by_id" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "evidence_audit_logs" (
	"id" text PRIMARY KEY NOT NULL,
	"evidence_id" text NOT NULL,
	"user_id" text NOT NULL,
	"action" "audit_action" NOT NULL,
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "evidence_case_files" (
	"evidence_id" text NOT NULL,
	"case_file_id" text NOT NULL,
	CONSTRAINT "unique_evidence_case" UNIQUE("evidence_id","case_file_id")
);
--> statement-breakpoint
CREATE TABLE "evidence_discussions" (
	"evidence_id" text NOT NULL,
	"discussion_id" text NOT NULL,
	CONSTRAINT "unique_evidence_discussion" UNIQUE("evidence_id","discussion_id")
);
--> statement-breakpoint
CREATE TABLE "evidence_items" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"type" "evidence_type" NOT NULL,
	"stance" "evidence_stance" NOT NULL,
	"status" "evidence_status" DEFAULT 'UNVERIFIED' NOT NULL,
	"source_id" text,
	"document_id" text,
	"submitted_by_id" text NOT NULL,
	"verified_by_id" text,
	"verification_notes" text,
	"verified_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "reputation_events" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"type" "rep_event_type" NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sources" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"source_type" "source_type" NOT NULL,
	"url" text,
	"publisher" text,
	"author" text,
	"publication_date" timestamp,
	"accessed_at" timestamp,
	"reliability" "source_reliability" DEFAULT 'UNKNOWN' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"uid" text PRIMARY KEY NOT NULL,
	"username" text NOT NULL,
	"display_name" text NOT NULL,
	"email" text NOT NULL,
	"avatar" text,
	"bio" text,
	"role" "user_role" DEFAULT 'USER' NOT NULL,
	"reputation" integer DEFAULT 0 NOT NULL,
	"level" integer DEFAULT 1 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_username_unique" UNIQUE("username")
);
--> statement-breakpoint
ALTER TABLE "case_files" ADD CONSTRAINT "case_files_created_by_users_uid_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("uid") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "discussion_replies" ADD CONSTRAINT "discussion_replies_discussion_id_discussions_id_fk" FOREIGN KEY ("discussion_id") REFERENCES "public"."discussions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "discussion_replies" ADD CONSTRAINT "discussion_replies_author_id_users_uid_fk" FOREIGN KEY ("author_id") REFERENCES "public"."users"("uid") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "discussion_votes" ADD CONSTRAINT "discussion_votes_discussion_id_discussions_id_fk" FOREIGN KEY ("discussion_id") REFERENCES "public"."discussions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "discussion_votes" ADD CONSTRAINT "discussion_votes_author_id_users_uid_fk" FOREIGN KEY ("author_id") REFERENCES "public"."users"("uid") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "discussions" ADD CONSTRAINT "discussions_author_id_users_uid_fk" FOREIGN KEY ("author_id") REFERENCES "public"."users"("uid") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "discussions" ADD CONSTRAINT "discussions_case_file_id_case_files_id_fk" FOREIGN KEY ("case_file_id") REFERENCES "public"."case_files"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "documents" ADD CONSTRAINT "documents_uploaded_by_id_users_uid_fk" FOREIGN KEY ("uploaded_by_id") REFERENCES "public"."users"("uid") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "evidence_audit_logs" ADD CONSTRAINT "evidence_audit_logs_evidence_id_evidence_items_id_fk" FOREIGN KEY ("evidence_id") REFERENCES "public"."evidence_items"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "evidence_audit_logs" ADD CONSTRAINT "evidence_audit_logs_user_id_users_uid_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("uid") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "evidence_case_files" ADD CONSTRAINT "evidence_case_files_evidence_id_evidence_items_id_fk" FOREIGN KEY ("evidence_id") REFERENCES "public"."evidence_items"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "evidence_case_files" ADD CONSTRAINT "evidence_case_files_case_file_id_case_files_id_fk" FOREIGN KEY ("case_file_id") REFERENCES "public"."case_files"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "evidence_discussions" ADD CONSTRAINT "evidence_discussions_evidence_id_evidence_items_id_fk" FOREIGN KEY ("evidence_id") REFERENCES "public"."evidence_items"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "evidence_discussions" ADD CONSTRAINT "evidence_discussions_discussion_id_discussions_id_fk" FOREIGN KEY ("discussion_id") REFERENCES "public"."discussions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "evidence_items" ADD CONSTRAINT "evidence_items_source_id_sources_id_fk" FOREIGN KEY ("source_id") REFERENCES "public"."sources"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "evidence_items" ADD CONSTRAINT "evidence_items_document_id_documents_id_fk" FOREIGN KEY ("document_id") REFERENCES "public"."documents"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "evidence_items" ADD CONSTRAINT "evidence_items_submitted_by_id_users_uid_fk" FOREIGN KEY ("submitted_by_id") REFERENCES "public"."users"("uid") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "evidence_items" ADD CONSTRAINT "evidence_items_verified_by_id_users_uid_fk" FOREIGN KEY ("verified_by_id") REFERENCES "public"."users"("uid") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reputation_events" ADD CONSTRAINT "reputation_events_user_id_users_uid_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("uid") ON DELETE no action ON UPDATE no action;