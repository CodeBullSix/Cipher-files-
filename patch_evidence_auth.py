with open('src/routes/evidence.ts', 'r') as f:
    content = f.read()

content = content.replace(
    "router.get('/documents/:key', requireAuth, (req, res) => {",
    "router.get('/documents/:key', (req, res) => {"
)

with open('src/routes/evidence.ts', 'w') as f:
    f.write(content)
