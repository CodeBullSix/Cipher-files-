with open('server.ts', 'r') as f:
    content = f.read()

import re
# We just want to put app.get before start(), and keep app.listen inside start() or outside?
# Actually app is global, so app.listen can be anywhere, but Vite middleware is async, so start() exists to await createViteServer.
# So app.listen must be INSIDE start() AFTER app.use(vite.middlewares).

match = re.search(r"}\n\napp\.get\('/api/users/:id/contributions'[\s\S]*?start\(\);", content)
if match:
    proper_end = """
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

async function start() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath, { setHeaders: (res, path) => { if (path.includes('/assets/')) res.setHeader('Cache-Control', 'public, max-age=31536000'); } }));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`CIPHER FILES Intelligence Server active on http://0.0.0.0:${PORT}`);
  });
}

start();"""
    
    # We replace everything from async function start() to the end!
    start_match = re.search(r"async function start\(\) \{[\s\S]*?start\(\);", content)
    if start_match:
        pass
    
    # Just cut everything from async function start() and replace
    start_index = content.find("async function start() {")
    if start_index != -1:
        # Also remove the rogue app.get that I placed before it? No, wait.
        # Let's just find the rogue app.get and remove it.
        content = content.replace(match.group(0), "")
        
        # Now append the proper end
        # wait, if I remove match.group(0), I removed start()!
        content += proper_end
        
        with open('server.ts', 'w') as f:
            f.write(content)
        print("Fixed ending 2")

