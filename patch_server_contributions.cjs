const fs = require('fs');
const file = 'server.ts';
let content = fs.readFileSync(file, 'utf8');

// Add import
if (!content.includes('getUserContributions')) {
  content = content.replace("import { getUserReputationData, awardReputation } from './src/db/reputation.js';", 
    "import { getUserReputationData, awardReputation } from './src/db/reputation.js';\nimport { getUserContributions } from './src/db/contributions.js';");
}

// Add route
const route = `
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
`;

if (!content.includes('/api/users/:id/contributions')) {
  content = content.replace("app.listen(PORT", route + "\napp.listen(PORT");
  fs.writeFileSync(file, content);
}
