import fs from 'fs';
let content = fs.readFileSync('src/db/graph.ts', 'utf8');

// In getGraphForCase
content = content.replace(
  /\/\/ Return formatted structure/,
  `// 6. Get Evidence for case
  const caseEvidenceList = await db.query.evidenceCaseFiles.findMany({
    where: eq(schema.evidenceCaseFiles.caseFileId, caseId),
    with: { evidenceItem: true }
  });
  for (const ce of caseEvidenceList) {
    if (ce.evidenceItem) {
      addNode(\`evidence_\${ce.evidenceItem.id}\`, ce.evidenceItem.title, 'evidence', { verificationStatus: ce.evidenceItem.status });
      addEdge(\`case_files_\${caseId}\`, \`evidence_\${ce.evidenceItem.id}\`, 'SUPPORTED_BY', ce.evidenceItem.status === 'VERIFIED');
    }
  }

  // Return formatted structure`
);

fs.writeFileSync('src/db/graph.ts', content);
