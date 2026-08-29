import { db } from './index.js';
import { users } from './schema.js';
import { eq } from 'drizzle-orm';

export async function getOrCreateUser(uid: string, email: string, displayName: string) {
  const role = (email.toLowerCase() === 'ajsteptoe123@gmail.com' || (process.env.ADMIN_EMAIL && email.toLowerCase() === process.env.ADMIN_EMAIL.toLowerCase())) ? 'ADMIN' : 'USER';
  
  const result = await db.insert(users)
    .values({
      uid,
      username: uid.substring(0, 12), // simple fallback username
      email,
      displayName,
      role
    })
    .onConflictDoUpdate({
      target: users.uid,
      set: { email, displayName },
    })
    .returning();
    
  // Ensure the admin gets upgraded if they somehow didn't have the role
  if (role === 'ADMIN' && result[0].role !== 'ADMIN') {
    return await updateUser(uid, { role: 'ADMIN' });
  }
  
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

export async function getAllUsersPublic() {
  const result = await db.select({
    uid: users.uid,
    username: users.username,
    displayName: users.displayName,
    avatar: users.avatar,
    bio: users.bio,
    role: users.role,
    reputation: users.reputation,
    level: users.level,
    createdAt: users.createdAt,
  }).from(users);
  return result;
}
