import fs from 'fs';
let content = fs.readFileSync('src/db/graph.ts', 'utf8');

// Also update expandGraphNode target logic for evidence
content = content.replace(
  /if \(type === 'events'\) \{ const e = await db.query.events.findFirst\(\{where: eq\(schema.events.id, id\)\}\); return e \? e.title : 'Unknown'; \}/,
  `if (type === 'events') { const e = await db.query.events.findFirst({where: eq(schema.events.id, id)}); return e ? e.title : 'Unknown'; }
  if (type === 'evidence') { const ev = await db.query.evidenceItems.findFirst({where: eq(schema.evidenceItems.id, id)}); return ev ? ev.title : 'Unknown'; }`
);

content = content.replace(
  /  if \(entityType === 'events'\) \{/,
  `  if (entityType === 'evidence') {
    const ec = await db.query.evidenceCaseFiles.findMany({ where: eq(schema.evidenceCaseFiles.evidenceId, id), with: { caseFile: true } });
    for (const r of ec) {
      if (r.caseFile) {
        addNode(\`case_files_\${r.caseFile.id}\`, r.caseFile.title, 'case_files');
        addEdge(\`case_files_\${r.caseFile.id}\`, \`evidence_\${id}\`, 'SUPPORTED_BY');
      }
    }
  }

  if (entityType === 'events') {`
);

fs.writeFileSync('src/db/graph.ts', content);
