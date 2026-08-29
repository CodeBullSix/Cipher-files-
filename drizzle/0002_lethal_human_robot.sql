CREATE TYPE "public"."workspace_entity_type" AS ENUM('CASE', 'PERSON', 'ORGANISATION', 'LOCATION', 'EVIDENCE', 'EVENT');--> statement-breakpoint
CREATE TABLE "investigation_workspaces" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"owner" text NOT NULL,
	"case_id" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "workspace_connections" (
	"id" text PRIMARY KEY NOT NULL,
	"workspace_id" text NOT NULL,
	"source_ref_id" text NOT NULL,
	"target_ref_id" text NOT NULL,
	"label" text NOT NULL,
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "workspace_notes" (
	"id" text PRIMARY KEY NOT NULL,
	"workspace_id" text NOT NULL,
	"content" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "workspace_references" (
	"id" text PRIMARY KEY NOT NULL,
	"workspace_id" text NOT NULL,
	"entity_type" "workspace_entity_type" NOT NULL,
	"entity_id" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "investigation_workspaces" ADD CONSTRAINT "investigation_workspaces_owner_users_uid_fk" FOREIGN KEY ("owner") REFERENCES "public"."users"("uid") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "investigation_workspaces" ADD CONSTRAINT "investigation_workspaces_case_id_case_files_id_fk" FOREIGN KEY ("case_id") REFERENCES "public"."case_files"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workspace_connections" ADD CONSTRAINT "workspace_connections_workspace_id_investigation_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."investigation_workspaces"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workspace_connections" ADD CONSTRAINT "workspace_connections_source_ref_id_workspace_references_id_fk" FOREIGN KEY ("source_ref_id") REFERENCES "public"."workspace_references"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workspace_connections" ADD CONSTRAINT "workspace_connections_target_ref_id_workspace_references_id_fk" FOREIGN KEY ("target_ref_id") REFERENCES "public"."workspace_references"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workspace_notes" ADD CONSTRAINT "workspace_notes_workspace_id_investigation_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."investigation_workspaces"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workspace_references" ADD CONSTRAINT "workspace_references_workspace_id_investigation_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."investigation_workspaces"("id") ON DELETE cascade ON UPDATE no action;