with open('src/db/discussions.ts', 'r') as f:
    content = f.read()

import_stmt = "import { discussions, discussionReplies, discussionVotes, users, evidenceDiscussions, evidenceItems, sources } from './schema.js';"
content = content.replace("import { discussions, discussionReplies, discussionVotes, users } from './schema.js';", import_stmt)

new_create_discussion = """
export async function createDiscussion(data: any) {
  const result = await db.insert(discussions).values({
    id: data.id,
    title: data.title,
    content: data.content,
    authorId: data.authorId,
    caseFileId: data.caseFileId
  }).returning();
  
  if (data.evidenceIds && data.evidenceIds.length > 0) {
    const links = data.evidenceIds.map((eId: string) => ({
      evidenceId: eId,
      discussionId: data.id
    }));
    await db.insert(evidenceDiscussions).values(links);
  }
  
  return result[0];
}

export async function getDiscussionEvidence(discussionId: string) {
  return await db.select({
    id: evidenceItems.id,
    title: evidenceItems.title,
    description: evidenceItems.description,
    type: evidenceItems.type,
    stance: evidenceItems.stance,
    status: evidenceItems.status,
  }).from(evidenceItems)
  .innerJoin(evidenceDiscussions, eq(evidenceDiscussions.evidenceId, evidenceItems.id))
  .where(eq(evidenceDiscussions.discussionId, discussionId));
}
"""

import re
content = re.sub(r"export async function createDiscussion.*?return result\[0\];\n}", new_create_discussion.strip(), content, flags=re.DOTALL)

with open('src/db/discussions.ts', 'w') as f:
    f.write(content)
