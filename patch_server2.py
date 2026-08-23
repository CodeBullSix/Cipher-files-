import re

with open('server.ts', 'r') as f:
    content = f.read()

import_str = "import { adminDb } from './src/lib/firebase-admin.js';\n"
if "adminDb" not in content:
    content = import_str + content

new_api = """
app.get('/api/users', requireAuth, async (req: AuthRequest, res) => {
  try {
    const snap = await adminDb.collection('users').get();
    const users = snap.docs.map(doc => {
      const data = doc.data();
      // PRIORITY 2 - PRIVATE EMAIL ARCHITECTURE: Do not return email
      delete data.email;
      return data;
    });
    res.json(users);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});
"""

# Replace the one we added before
old_api_pattern = re.compile(r"app\.get\('/api/users', requireAuth, async \(req: AuthRequest, res\) => \{.*?\n\}\);", re.DOTALL)
if old_api_pattern.search(content):
    content = old_api_pattern.sub(new_api.strip(), content)
else:
    # Append
    content = content.replace("app.get('/api/users/me'", new_api + "\napp.get('/api/users/me'")

with open('server.ts', 'w') as f:
    f.write(content)
