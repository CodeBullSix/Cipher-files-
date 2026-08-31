with open('server.ts', 'r') as f:
    content = f.read()

# Replace the messy ending
messy_end = """  app.get('/api/users/:id/contributions', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit as string) || 50;
    const filter = req.query.filter as string | undefined;
    const data = await getUserContributions(req.params.id, filter, limit);
    res.json(data);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch contributions' });
  }
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`CIPHER FILES Intelligence Server active on http://0.0.0.0:${PORT}`);
  });
}

start();"""

# Remove exact matches if possible, or just regex
import re
match = re.search(r"  app\.get\('/api/users/:id/contributions'[\s\S]*?start\(\);", content)
if match:
    # We replace it with proper structured layout
    proper_end = """}

app.get('/api/users/:id/contributions', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit as string) || 50;
    const filter = req.query.filter as string | undefined;
    const data = await getUserContributions(req.params.id, filter, limit);
    res.json(data);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch contributions' });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`CIPHER FILES Intelligence Server active on http://0.0.0.0:${PORT}`);
});

start();"""
    content = content.replace(match.group(0), proper_end)
    with open('server.ts', 'w') as f:
        f.write(content)
    print("Fixed ending")
