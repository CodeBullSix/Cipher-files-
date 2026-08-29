import { db } from './index.js';
import { notifications } from './schema.js';
import { eq, and, desc } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';

export async function createNotification(
  userId: string,
  type: 'DISCUSSION_REPLY' | 'ACHIEVEMENT_UNLOCKED' | 'LEVEL_UP' | 'REPUTATION_MILESTONE' | 'CONTRIBUTION_STATUS' | 'SYSTEM' | 'NEW_FOLLOWER',
  title: string,
  message: string,
  relatedRecordId?: string,
  relatedRecordType?: string
) {
  try {
    // Prevent duplicates: If a notification for the exact same event already exists (e.g., same level up or achievement)
    if (relatedRecordId) {
      const existing = await db.query.notifications.findFirst({
        where: and(
          eq(notifications.userId, userId),
          eq(notifications.type, type),
          eq(notifications.relatedRecordId, relatedRecordId)
        )
      });
      if (existing) return { success: true, id: existing.id };
    }

    const id = uuidv4();
    await db.insert(notifications).values({
      id,
      userId,
      type,
      title,
      message,
      relatedRecordId,
      relatedRecordType,
    });
    return { success: true, id };
  } catch (error) {
    console.error('Error creating notification:', error);
    return { success: false, error };
  }
}

export async function getUserNotifications(userId: string, limit = 50) {
  const data = await db.query.notifications.findMany({
    where: eq(notifications.userId, userId),
    orderBy: [desc(notifications.createdAt)],
    limit,
  });
  return data;
}

export async function getUnreadCount(userId: string) {
  // Can just fetch count, or all unread if small
  const data = await db.query.notifications.findMany({
    where: and(
      eq(notifications.userId, userId),
      eq(notifications.isRead, false)
    ),
    columns: { id: true }
  });
  return { unreadCount: data.length };
}

export async function markAsRead(userId: string, notificationId: string) {
  await db.update(notifications)
    .set({ isRead: true })
    .where(and(eq(notifications.id, notificationId), eq(notifications.userId, userId)));
  return { success: true };
}

export async function markAllAsRead(userId: string) {
  await db.update(notifications)
    .set({ isRead: true })
    .where(and(eq(notifications.isRead, false), eq(notifications.userId, userId)));
  return { success: true };
}
