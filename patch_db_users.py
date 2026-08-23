import re

with open('src/db/users.ts', 'r') as f:
    content = f.read()

new_get_create = """export async function getOrCreateUser(uid: string, email: string, displayName: string) {
  const role = (email.toLowerCase() === 'ajsteptoe123@gmail.com') ? 'ADMIN' : 'USER';
  
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
}"""

# Replace the old one
old_pattern = re.compile(r"export async function getOrCreateUser.*?return result\[0\];\s*\}", re.DOTALL)
content = old_pattern.sub(new_get_create, content)

with open('src/db/users.ts', 'w') as f:
    f.write(content)
