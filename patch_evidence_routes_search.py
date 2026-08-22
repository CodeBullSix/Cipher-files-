with open('src/routes/evidence.ts', 'r') as f:
    content = f.read()

new_route = """
// GET all evidence
router.get('/', async (req, res) => {
  try {
    const caseFileId = req.query.caseFileId as string;
    const query = req.query.query as string;
    const status = req.query.status as string;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    
    const evidence = await getEvidenceItems({ caseFileId, query, status, page, limit });
    res.json(evidence);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});
"""

import re
content = re.sub(r"// GET all evidence\nrouter\.get\('/', async \(req, res\) => \{.*?\n\}\);", new_route.strip(), content, flags=re.DOTALL)

with open('src/routes/evidence.ts', 'w') as f:
    f.write(content)
