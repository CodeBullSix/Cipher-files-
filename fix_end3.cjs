const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf8');

const startIndex = content.indexOf('async function start() {');

if (startIndex !== -1) {
    const newEnd = `
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
    console.log(\`CIPHER FILES Intelligence Server active on http://0.0.0.0:\${PORT}\`);
  });
}

start();
`;
    content = content.slice(0, startIndex) + newEnd;
    fs.writeFileSync('server.ts', content);
}

