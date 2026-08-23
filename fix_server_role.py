import re

with open('server.ts', 'r') as f:
    content = f.read()

content = content.replace("app.put('/api/users/:id/role', requireModerator", "app.put('/api/users/:id/role', requireAuth, requireModerator")

with open('server.ts', 'w') as f:
    f.write(content)
