import re

with open('server.ts', 'r') as f:
    content = f.read()

# Replace the GET /api/users implementation
old_api = r"""app\.get\('/api/users', requireAuth, async \(req: AuthRequest, res\) => \{\s*try \{\s*const snap = await adminDb\.collection\('users'\)\.get\(\);\s*const users = snap\.docs\.map\(doc => \{\s*const data = doc\.data\(\);\s*// PRIORITY 2 - PRIVATE EMAIL ARCHITECTURE: Do not return email\s*delete data\.email;\s*return data;\s*\}\);\s*res\.json\(users\);\s*\} catch \(error: any\) \{\s*res\.status\(500\)\.json\(\{ error: 'Failed to fetch users' \}\);\s*\}\s*\}\);"""

new_api = """app.get('/api/users', requireAuth, async (req: AuthRequest, res) => {
  try {
    const users = await getAllUsersPublic();
    res.json(users);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});"""

content = re.sub(old_api, new_api, content)

with open('server.ts', 'w') as f:
    f.write(content)
