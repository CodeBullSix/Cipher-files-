import re

with open('src/routes/evidence.ts', 'r') as f:
    content = f.read()

# Add evidenceItems to imports
content = content.replace("import { sources, documents } from '../db/schema.js';", "import { sources, documents, evidenceItems } from '../db/schema.js';")

# Replace the GET /documents/:key route
old_route = r"router\.get\('/documents/:key', \(req, res\) => \{\s*const safeKey = path\.basename\(req\.params\.key\);\s*const filePath = path\.join\(uploadDir, safeKey\);\s*if \(!fs\.existsSync\(filePath\)\) \{\s*return res\.status\(404\)\.json\(\{ error: 'Document not found' \}\);\s*\}\s*res\.sendFile\(filePath\);\s*\}\);"

new_route = """router.get('/documents/:key', requireAuth, async (req: AuthRequest, res) => {
  try {
    const safeKey = path.basename(req.params.key);
    
    const docRecords = await db.select().from(documents).where(eq(documents.storageKey, safeKey));
    if (!docRecords.length) {
      return res.status(404).json({ error: 'Document not found' });
    }
    const document = docRecords[0];

    const evidenceList = await db.select().from(evidenceItems).where(eq(evidenceItems.documentId, document.id));
    
    let authorized = false;
    
    if (evidenceList.length > 0) {
      authorized = true;
    } else {
      if (document.uploadedById === req.dbUser!.uid || req.dbUser!.role === 'ADMIN' || req.dbUser!.role === 'MODERATOR') {
        authorized = true;
      }
    }

    if (!authorized) {
      return res.status(403).json({ error: 'Access denied: You are not authorized to view this document.' });
    }

    const filePath = path.join(uploadDir, safeKey);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'File missing from storage' });
    }

    res.setHeader('Content-Type', document.fileType || 'application/octet-stream');
    res.setHeader('Content-Disposition', `inline; filename="${document.fileName || 'document'}"`);
    
    res.sendFile(filePath);
  } catch (err: any) {
    res.status(500).json({ error: 'Internal server error' });
  }
});"""

content = re.sub(old_route, new_route, content)

with open('src/routes/evidence.ts', 'w') as f:
    f.write(content)
