import { db } from './index.js';
import { caseFiles } from './schema.js';
import { eq, ilike, and } from 'drizzle-orm';

export async function getCases(query?: string, category?: string, status?: any) {
  let q = db.select().from(caseFiles);
  return await q;
}

export async function getCaseById(id: string) {
  const result = await db.select().from(caseFiles).where(eq(caseFiles.id, id));
  return result[0];
}

export async function createCase(data: any) {
  const result = await db.insert(caseFiles).values(data).returning();
  return result[0];
}

export async function updateCase(id: string, data: any) {
  const result = await db.update(caseFiles).set(data).where(eq(caseFiles.id, id)).returning();
  return result[0];
}
