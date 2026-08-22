with open('src/db/evidence.ts', 'r') as f:
    content = f.read()

import_stmt = "import { eq, and, desc, isNull, inArray, ilike, or } from 'drizzle-orm';"
content = content.replace("import { eq, and, desc, isNull, inArray } from 'drizzle-orm';", import_stmt)

new_get_evidence = """
export async function getEvidenceItems(params: {
  caseFileId?: string,
  query?: string,
  status?: string,
  page?: number,
  limit?: number
} = {}) {
  const { caseFileId, query, status, page = 1, limit = 50 } = params;
  
  let conditions = [isNull(evidenceItems.deletedAt)];
  
  if (status && status !== 'ALL') {
    conditions.push(eq(evidenceItems.status, status as any));
  }
  
  if (query) {
    conditions.push(
      or(
        ilike(evidenceItems.title, `%${query}%`),
        ilike(evidenceItems.description, `%${query}%`)
      )
    );
  }

  let q = db.select({
    id: evidenceItems.id,
    title: evidenceItems.title,
    description: evidenceItems.description,
    type: evidenceItems.type,
    stance: evidenceItems.stance,
    status: evidenceItems.status,
    createdAt: evidenceItems.createdAt,
    submittedBy: {
      uid: users.uid,
      displayName: users.displayName,
      avatar: users.avatar
    },
    source: {
      id: sources.id,
      name: sources.name,
      reliability: sources.reliability
    }
  }).from(evidenceItems)
  .leftJoin(users, eq(evidenceItems.submittedById, users.uid))
  .leftJoin(sources, eq(evidenceItems.sourceId, sources.id));

  if (caseFileId) {
    q.innerJoin(evidenceCaseFiles, eq(evidenceCaseFiles.evidenceId, evidenceItems.id))
    conditions.push(eq(evidenceCaseFiles.caseFileId, caseFileId));
  }
  
  q.where(and(...conditions));

  const offset = (page - 1) * limit;
  const result = await q.orderBy(desc(evidenceItems.createdAt)).limit(limit).offset(offset);
  
  // Quick count for total pages (hacky but functional for now)
  const totalQ = await db.select({ count: evidenceItems.id }).from(evidenceItems).where(and(...conditions));
  
  return {
    items: result,
    total: totalQ.length,
    page,
    totalPages: Math.ceil(totalQ.length / limit)
  };
}
"""

import re
content = re.sub(r"export async function getEvidenceItems\(caseFileId\?: string\) \{.*?\n\}", new_get_evidence.strip(), content, flags=re.DOTALL)

with open('src/db/evidence.ts', 'w') as f:
    f.write(content)
