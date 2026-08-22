import { db } from './index.js';
import { discussions, discussionReplies, discussionVotes, users, evidenceDiscussions, evidenceItems, sources } from './schema.js';
import { eq, and, desc, isNull } from 'drizzle-orm';

export async function getDiscussions(caseFileId?: string) {
  const conditions = [isNull(discussions.deletedAt)];
  if (caseFileId) {
    conditions.push(eq(discussions.caseFileId, caseFileId));
  }
  
  let q = db.select({
    id: discussions.id,
    title: discussions.title,
    content: discussions.content,
    createdAt: discussions.createdAt,
    locked: discussions.locked,
    deletedAt: discussions.deletedAt,
    author: {
      uid: users.uid,
      displayName: users.displayName,
      avatar: users.avatar
    }
  }).from(discussions).leftJoin(users, eq(discussions.authorId, users.uid))
  .where(and(...conditions));
  
  return await q.orderBy(desc(discussions.createdAt));
}

export async function getDiscussionById(discussionId: string) {
  const result = await db.select().from(discussions).where(eq(discussions.id, discussionId));
  return result[0];
}

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

export async function getDiscussionReplies(discussionId: string) {
  return await db.select({
    id: discussionReplies.id,
    content: discussionReplies.content,
    createdAt: discussionReplies.createdAt,
    deletedAt: discussionReplies.deletedAt,
    author: {
      uid: users.uid,
      displayName: users.displayName,
      avatar: users.avatar
    }
  }).from(discussionReplies).leftJoin(users, eq(discussionReplies.authorId, users.uid))
  .where(and(eq(discussionReplies.discussionId, discussionId), isNull(discussionReplies.deletedAt)))
  .orderBy(discussionReplies.createdAt);
}

export async function createReply(data: any) {
  const result = await db.insert(discussionReplies).values(data).returning();
  return result[0];
}

export async function voteDiscussion(discussionId: string, authorId: string, value: number) {
  const result = await db.insert(discussionVotes).values({
    id: `vote-${discussionId}-${authorId}`,
    discussionId,
    authorId,
    value
  }).onConflictDoUpdate({
    target: [discussionVotes.discussionId, discussionVotes.authorId],
    set: { value }
  }).returning();
  return result[0];
}

export async function updateDiscussionStatus(discussionId: string, updates: { locked?: boolean; deletedAt?: Date | null }) {
  const result = await db.update(discussions)
    .set(updates)
    .where(eq(discussions.id, discussionId))
    .returning();
  return result[0];
}
