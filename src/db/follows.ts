import { db } from './index.js';
import { userFollows, users } from './schema.js';
import { eq, and } from 'drizzle-orm';
import { createNotification } from './notifications.js';

export async function checkIsFollowing(followerId: string, followingId: string) {
  const data = await db.query.userFollows.findFirst({
    where: and(
      eq(userFollows.followerId, followerId),
      eq(userFollows.followingId, followingId)
    )
  });
  return !!data;
}

export async function followUser(followerId: string, followingId: string) {
  if (followerId === followingId) throw new Error('Cannot follow yourself');

  try {
    await db.insert(userFollows).values({
      followerId,
      followingId,
    });
    
    // Notify
    const followerData = await db.query.users.findFirst({ where: eq(users.uid, followerId) });
    const followerName = followerData?.username || followerData?.displayName || 'An investigator';
    
    await createNotification(
      followingId,
      'NEW_FOLLOWER',
      'New Follower',
      `${followerName} is now following your contributions.`,
      followerId,
      'PROFILE'
    ).catch(console.error);

    return { success: true };
  } catch (e: any) {
    if (e.code === '23505') return { success: true }; // Already following
    throw e;
  }
}

export async function unfollowUser(followerId: string, followingId: string) {
  await db.delete(userFollows).where(
    and(
      eq(userFollows.followerId, followerId),
      eq(userFollows.followingId, followingId)
    )
  );
  return { success: true };
}

export async function getFollowers(userId: string) {
  const data = await db.query.userFollows.findMany({
    where: eq(userFollows.followingId, userId),
    with: {
      follower: {
        columns: {
          uid: true,
          username: true,
          displayName: true,
          avatar: true,
          role: true,
          level: true,
          reputation: true,
        }
      }
    },
    limit: 100, // sensible limit
  });
  return data.map(d => d.follower);
}

export async function getFollowing(userId: string) {
  const data = await db.query.userFollows.findMany({
    where: eq(userFollows.followerId, userId),
    with: {
      following: {
        columns: {
          uid: true,
          username: true,
          displayName: true,
          avatar: true,
          role: true,
          level: true,
          reputation: true,
        }
      }
    },
    limit: 100, // sensible limit
  });
  return data.map(d => d.following);
}

export async function getFollowCounts(userId: string) {
  const followers = await db.query.userFollows.findMany({
    where: eq(userFollows.followingId, userId),
    columns: { followerId: true }
  });
  const following = await db.query.userFollows.findMany({
    where: eq(userFollows.followerId, userId),
    columns: { followingId: true }
  });
  return {
    followersCount: followers.length,
    followingCount: following.length
  };
}
