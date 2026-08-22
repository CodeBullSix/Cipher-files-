with open('server.ts', 'r') as f:
    content = f.read()

content = content.replace(
    "app.get('/api/discussions/:id/evidence', requireAuth, async (req: AuthRequest, res) => {",
    "app.get('/api/discussions/:id/evidence', async (req, res) => {"
)

with open('server.ts', 'w') as f:
    f.write(content)
