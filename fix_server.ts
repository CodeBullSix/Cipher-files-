import fs from 'fs';
const serverPath = 'server.ts';
let content = fs.readFileSync(serverPath, 'utf8');

const featureRoute = `
app.patch('/api/cases/:id/feature', requireAuth, requireModerator, async (req: AuthRequest, res) => {
  try {
    const { featured, featuredOrder, editorialCollection, editorialDescription } = req.body;
    const { updateCase } = await import('./src/db/cases.js');
    const updated = await updateCase(req.params.id, { 
      featured, 
      featuredOrder: featuredOrder !== undefined ? featuredOrder : null, 
      editorialCollection: editorialCollection !== undefined ? editorialCollection : null,
      editorialDescription: editorialDescription !== undefined ? editorialDescription : null
    });
    // Log the audit
    const { createAuditLog } = await import('./src/db/audit.js');
    await createAuditLog({
      action: featured ? 'SUBMITTED' : 'EDITED', // Using existing enum values as fallback, though it's technically a feature toggle
      entityType: 'case_files',
      entityId: req.params.id,
      userId: req.user!.uid,
      details: JSON.stringify({ featured, featuredOrder, editorialCollection })
    });
    res.json(updated);
  } catch (error: any) {
    console.error('Failed to feature case:', error);
    res.status(500).json({ error: 'Failed to feature case' });
  }
});
`;

if (!content.includes("/api/cases/:id/feature")) {
  content = content.replace(
    /app\.get\('\/api\/cases\/:id', async \(req, res\) => \{[\s\S]*?\}\);\n/,
    `app.get('/api/cases/:id', async (req, res) => {
  try {
    const c = await getCaseById(req.params.id);
    res.json(c);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch case' });
  }
});\n${featureRoute}`
  );
  fs.writeFileSync(serverPath, content);
  console.log("Added /api/cases/:id/feature route");
} else {
  console.log("Route already exists");
}
