import re

with open('src/db/schema.ts', 'r') as f:
    content = f.read()

if 'jsonb(' not in content and 'jsonb' not in content:
    content = content.replace("pgEnum, unique } from 'drizzle-orm/pg-core';", "pgEnum, unique, jsonb } from 'drizzle-orm/pg-core';")

replacement = """export const caseFiles = pgTable('case_files', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  slug: text('slug').notNull().unique(),
  summary: text('summary').notNull(),
  description: text('description'),
  category: text('category').notNull(),
  status: caseStatusEnum('status').notNull(),
  caseNumber: text('case_number'),
  subtitle: text('subtitle'),
  officialVerdict: text('official_verdict'),
  coverImage: text('cover_image'),
  claim: text('claim'),
  claimOrigin: text('claim_origin'),
  whatWeKnow: jsonb('what_we_know'),
  speculations: jsonb('speculations'),
  timeline: jsonb('timeline'),
  featured: boolean('featured').default(false).notNull(),
"""
content = re.sub(r"export const caseFiles = pgTable\('case_files', {[\s\S]*?featured: boolean\('featured'\).default\(false\).notNull\(\),", replacement, content, count=1)

with open('src/db/schema.ts', 'w') as f:
    f.write(content)
