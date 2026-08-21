import { db } from './index.js';
import { users } from './schema.js';
import { eq } from 'drizzle-orm';

export async function getOrCreateUser(uid: string, email: string, displayName: string) {
  const result = await db.insert(users)
    .values({
      uid,
      username: uid.substring(0, 12), // simple fallback username
      email,
      displayName
    })
    .onConflictDoUpdate({
      target: users.uid,
      set: { email, displayName },
    })
    .returning();

  return result[0];
}

export async function getUser(uid: string) {
  const result = await db.select().from(users).where(eq(users.uid, uid));
  return result[0];
}

export async function updateUser(uid: string, data: any) {
  const result = await db.update(users).set(data).where(eq(users.uid, uid)).returning();
  return result[0];
}
