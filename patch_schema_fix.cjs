const fs = require('fs');
const file = 'src/db/schema.ts';
let content = fs.readFileSync(file, 'utf8');

content = content.replace("export const users = pgTable('users', {\n  uid: text('uid').primaryKey(),\n  email: text('email').notNull().unique(),\n  username: text('username').notNull().unique(),\n  displayName: text('display_name'),\n  avatarUrl: text('avatar_url'),\n  role: text('role').default('INVESTIGATOR').notNull(),\n  trustScore: integer('trust_score').default(0).notNull(),\n  status: text('status').default('ACTIVE').notNull(),\n  lastActiveAt: timestamp('last_active_at'),\n  createdAt: timestamp('created_at').defaultNow().notNull(),\n  deletedAt: timestamp('deleted_at'),\n  assigneeId: text('assignee_id').references(() => users.uid, { onDelete: 'set null' }),", "export const users = pgTable('users', {\n  uid: text('uid').primaryKey(),\n  email: text('email').notNull().unique(),\n  username: text('username').notNull().unique(),\n  displayName: text('display_name'),\n  avatarUrl: text('avatar_url'),\n  role: text('role').default('INVESTIGATOR').notNull(),\n  trustScore: integer('trust_score').default(0).notNull(),\n  status: text('status').default('ACTIVE').notNull(),\n  lastActiveAt: timestamp('last_active_at'),\n  createdAt: timestamp('created_at').defaultNow().notNull(),\n  deletedAt: timestamp('deleted_at'),");

fs.writeFileSync(file, content);
