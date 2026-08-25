CREATE TYPE "public"."entity_verification_status" AS ENUM('UNVERIFIED', 'VERIFIED', 'DISPUTED');--> statement-breakpoint
CREATE TYPE "public"."event_precision" AS ENUM('EXACT', 'DAY', 'MONTH', 'YEAR', 'APPROXIMATE', 'RANGE', 'UNKNOWN');--> statement-breakpoint
CREATE TYPE "public"."event_type" AS ENUM('MEETING', 'PUBLICATION', 'EMPLOYMENT', 'FOUNDING', 'INVESTIGATION', 'INCIDENT', 'MOVEMENT', 'COMMUNICATION', 'LEGAL', 'POLITICAL', 'OTHER');--> statement-breakpoint
CREATE TABLE "case_locations" (
	"case_file_id" text NOT NULL,
	"location_id" text NOT NULL,
	CONSTRAINT "unique_case_location" UNIQUE("case_file_id","location_id")
);
--> statement-breakpoint
CREATE TABLE "case_organisations" (
	"case_file_id" text NOT NULL,
	"organisation_id" text NOT NULL,
	CONSTRAINT "unique_case_organisation" UNIQUE("case_file_id","organisation_id")
);
--> statement-breakpoint
CREATE TABLE "case_people" (
	"case_file_id" text NOT NULL,
	"person_id" text NOT NULL,
	CONSTRAINT "unique_case_person" UNIQUE("case_file_id","person_id")
);
--> statement-breakpoint
CREATE TABLE "case_relationships" (
	"case_file_id" text NOT NULL,
	"relationship_id" text NOT NULL,
	CONSTRAINT "unique_case_relationship" UNIQUE("case_file_id","relationship_id")
);
--> statement-breakpoint
CREATE TABLE "entity_relationships" (
	"id" text PRIMARY KEY NOT NULL,
	"source_type" text NOT NULL,
	"source_id" text NOT NULL,
	"target_type" text NOT NULL,
	"target_id" text NOT NULL,
	"relationship_type" text NOT NULL,
	"description" text,
	"verification_status" "entity_verification_status" DEFAULT 'UNVERIFIED' NOT NULL,
	"created_by" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "unique_entity_relationship" UNIQUE("source_type","source_id","target_type","target_id","relationship_type")
);
--> statement-breakpoint
CREATE TABLE "event_case_files" (
	"event_id" text NOT NULL,
	"case_file_id" text NOT NULL,
	CONSTRAINT "unique_event_case_file" UNIQUE("event_id","case_file_id")
);
--> statement-breakpoint
CREATE TABLE "event_evidence" (
	"event_id" text NOT NULL,
	"evidence_id" text NOT NULL,
	CONSTRAINT "unique_event_evidence" UNIQUE("event_id","evidence_id")
);
--> statement-breakpoint
CREATE TABLE "event_locations" (
	"event_id" text NOT NULL,
	"location_id" text NOT NULL,
	CONSTRAINT "unique_event_location" UNIQUE("event_id","location_id")
);
--> statement-breakpoint
CREATE TABLE "event_organisations" (
	"event_id" text NOT NULL,
	"organisation_id" text NOT NULL,
	CONSTRAINT "unique_event_organisation" UNIQUE("event_id","organisation_id")
);
--> statement-breakpoint
CREATE TABLE "event_people" (
	"event_id" text NOT NULL,
	"person_id" text NOT NULL,
	CONSTRAINT "unique_event_person" UNIQUE("event_id","person_id")
);
--> statement-breakpoint
CREATE TABLE "event_relationships" (
	"event_id" text NOT NULL,
	"relationship_id" text NOT NULL,
	CONSTRAINT "unique_event_relationship" UNIQUE("event_id","relationship_id")
);
--> statement-breakpoint
CREATE TABLE "events" (
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
);
--> statement-breakpoint
CREATE TABLE "evidence_entity_relationships" (
	"evidence_id" text NOT NULL,
	"relationship_id" text NOT NULL,
	CONSTRAINT "unique_evidence_relationship" UNIQUE("evidence_id","relationship_id")
);
--> statement-breakpoint
CREATE TABLE "evidence_locations" (
	"evidence_id" text NOT NULL,
	"location_id" text NOT NULL,
	CONSTRAINT "unique_evidence_location" UNIQUE("evidence_id","location_id")
);
--> statement-breakpoint
CREATE TABLE "evidence_organisations" (
	"evidence_id" text NOT NULL,
	"organisation_id" text NOT NULL,
	CONSTRAINT "unique_evidence_organisation" UNIQUE("evidence_id","organisation_id")
);
--> statement-breakpoint
CREATE TABLE "evidence_people" (
	"evidence_id" text NOT NULL,
	"person_id" text NOT NULL,
	CONSTRAINT "unique_evidence_person" UNIQUE("evidence_id","person_id")
);
--> statement-breakpoint
CREATE TABLE "locations" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"location_type" text,
	"description" text,
	"country" text,
	"coordinates" text,
	"verification_status" "entity_verification_status" DEFAULT 'UNVERIFIED' NOT NULL,
	"created_by" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "organisations" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"aliases" text,
	"description" text,
	"type" text,
	"verification_status" "entity_verification_status" DEFAULT 'UNVERIFIED' NOT NULL,
	"created_by" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "people" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"aliases" text,
	"description" text,
	"image_url" text,
	"verification_status" "entity_verification_status" DEFAULT 'UNVERIFIED' NOT NULL,
	"created_by" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "case_files" ADD COLUMN "case_number" text;--> statement-breakpoint
ALTER TABLE "case_files" ADD COLUMN "subtitle" text;--> statement-breakpoint
ALTER TABLE "case_files" ADD COLUMN "official_verdict" text;--> statement-breakpoint
ALTER TABLE "case_files" ADD COLUMN "cover_image" text;--> statement-breakpoint
ALTER TABLE "case_files" ADD COLUMN "claim" text;--> statement-breakpoint
ALTER TABLE "case_files" ADD COLUMN "claim_origin" text;--> statement-breakpoint
ALTER TABLE "case_files" ADD COLUMN "what_we_know" jsonb;--> statement-breakpoint
ALTER TABLE "case_files" ADD COLUMN "speculations" jsonb;--> statement-breakpoint
ALTER TABLE "case_files" ADD COLUMN "timeline" jsonb;--> statement-breakpoint
ALTER TABLE "case_locations" ADD CONSTRAINT "case_locations_case_file_id_case_files_id_fk" FOREIGN KEY ("case_file_id") REFERENCES "public"."case_files"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "case_locations" ADD CONSTRAINT "case_locations_location_id_locations_id_fk" FOREIGN KEY ("location_id") REFERENCES "public"."locations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "case_organisations" ADD CONSTRAINT "case_organisations_case_file_id_case_files_id_fk" FOREIGN KEY ("case_file_id") REFERENCES "public"."case_files"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "case_organisations" ADD CONSTRAINT "case_organisations_organisation_id_organisations_id_fk" FOREIGN KEY ("organisation_id") REFERENCES "public"."organisations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "case_people" ADD CONSTRAINT "case_people_case_file_id_case_files_id_fk" FOREIGN KEY ("case_file_id") REFERENCES "public"."case_files"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "case_people" ADD CONSTRAINT "case_people_person_id_people_id_fk" FOREIGN KEY ("person_id") REFERENCES "public"."people"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "case_relationships" ADD CONSTRAINT "case_relationships_case_file_id_case_files_id_fk" FOREIGN KEY ("case_file_id") REFERENCES "public"."case_files"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "case_relationships" ADD CONSTRAINT "case_relationships_relationship_id_entity_relationships_id_fk" FOREIGN KEY ("relationship_id") REFERENCES "public"."entity_relationships"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "entity_relationships" ADD CONSTRAINT "entity_relationships_created_by_users_uid_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("uid") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event_case_files" ADD CONSTRAINT "event_case_files_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event_case_files" ADD CONSTRAINT "event_case_files_case_file_id_case_files_id_fk" FOREIGN KEY ("case_file_id") REFERENCES "public"."case_files"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event_evidence" ADD CONSTRAINT "event_evidence_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event_evidence" ADD CONSTRAINT "event_evidence_evidence_id_evidence_items_id_fk" FOREIGN KEY ("evidence_id") REFERENCES "public"."evidence_items"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event_locations" ADD CONSTRAINT "event_locations_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event_locations" ADD CONSTRAINT "event_locations_location_id_locations_id_fk" FOREIGN KEY ("location_id") REFERENCES "public"."locations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event_organisations" ADD CONSTRAINT "event_organisations_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event_organisations" ADD CONSTRAINT "event_organisations_organisation_id_organisations_id_fk" FOREIGN KEY ("organisation_id") REFERENCES "public"."organisations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event_people" ADD CONSTRAINT "event_people_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event_people" ADD CONSTRAINT "event_people_person_id_people_id_fk" FOREIGN KEY ("person_id") REFERENCES "public"."people"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event_relationships" ADD CONSTRAINT "event_relationships_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event_relationships" ADD CONSTRAINT "event_relationships_relationship_id_entity_relationships_id_fk" FOREIGN KEY ("relationship_id") REFERENCES "public"."entity_relationships"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "events" ADD CONSTRAINT "events_created_by_users_uid_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("uid") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "evidence_entity_relationships" ADD CONSTRAINT "evidence_entity_relationships_evidence_id_evidence_items_id_fk" FOREIGN KEY ("evidence_id") REFERENCES "public"."evidence_items"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "evidence_entity_relationships" ADD CONSTRAINT "evidence_entity_relationships_relationship_id_entity_relationships_id_fk" FOREIGN KEY ("relationship_id") REFERENCES "public"."entity_relationships"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "evidence_locations" ADD CONSTRAINT "evidence_locations_evidence_id_evidence_items_id_fk" FOREIGN KEY ("evidence_id") REFERENCES "public"."evidence_items"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "evidence_locations" ADD CONSTRAINT "evidence_locations_location_id_locations_id_fk" FOREIGN KEY ("location_id") REFERENCES "public"."locations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "evidence_organisations" ADD CONSTRAINT "evidence_organisations_evidence_id_evidence_items_id_fk" FOREIGN KEY ("evidence_id") REFERENCES "public"."evidence_items"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "evidence_organisations" ADD CONSTRAINT "evidence_organisations_organisation_id_organisations_id_fk" FOREIGN KEY ("organisation_id") REFERENCES "public"."organisations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "evidence_people" ADD CONSTRAINT "evidence_people_evidence_id_evidence_items_id_fk" FOREIGN KEY ("evidence_id") REFERENCES "public"."evidence_items"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "evidence_people" ADD CONSTRAINT "evidence_people_person_id_people_id_fk" FOREIGN KEY ("person_id") REFERENCES "public"."people"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "locations" ADD CONSTRAINT "locations_created_by_users_uid_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("uid") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "organisations" ADD CONSTRAINT "organisations_created_by_users_uid_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("uid") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "people" ADD CONSTRAINT "people_created_by_users_uid_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("uid") ON DELETE no action ON UPDATE no action;