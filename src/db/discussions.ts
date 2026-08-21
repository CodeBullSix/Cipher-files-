import { db } from './index.js';
import { discussions, discussionReplies, discussionVotes, users } from './schema.js';
import { eq, and, desc } from 'drizzle-orm';

export async function getDiscussions(caseFileId?: string) {
  let q = db.select({
    id: discussions.id,
    title: discussions.title,
    content: discussions.content,
    createdAt: discussions.createdAt,
    author: {
      uid: users.uid,
      displayName: users.displayName,
      avatar: users.avatar
    }
  }).from(discussions).leftJoin(users, eq(discussions.authorId, users.uid));
  
  if (caseFileId) {
    q.where(eq(discussions.caseFileId, caseFileId));
  }
  
  return await q.orderBy(desc(discussions.createdAt));
}

export async function createDiscussion(data: any) {
  const result = await db.insert(discussions).values(data).returning();
  return result[0];
}

export async function getDiscussionReplies(discussionId: string) {
  return await db.select({
    id: discussionReplies.id,
    content: discussionReplies.content,
    createdAt: discussionReplies.createdAt,
    author: {
      uid: users.uid,
      displayName: users.displayName,
      avatar: users.avatar
    }
  }).from(discussionReplies).leftJoin(users, eq(discussionReplies.authorId, users.uid))
  .where(eq(discussionReplies.discussionId, discussionId))
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
