import fs from 'fs';
let content = fs.readFileSync('src/db/graph.ts', 'utf8');

// fix caseId -> caseFileId
content = content.replace(/eq\(schema\.casePeople\.caseId/g, 'eq(schema.casePeople.caseFileId');
content = content.replace(/eq\(schema\.caseOrganisations\.caseId/g, 'eq(schema.caseOrganisations.caseFileId');
content = content.replace(/eq\(schema\.caseLocations\.caseId/g, 'eq(schema.caseLocations.caseFileId');
content = content.replace(/eq\(schema\.eventCaseFiles\.caseId/g, 'eq(schema.eventCaseFiles.caseFileId');

// fix role -> constant
content = content.replace(/cp\.role \|\| 'INVOLVES'/g, "'INVOLVES'");
content = content.replace(/co\.role \|\| 'INVOLVES'/g, "'INVOLVES'");
content = content.replace(/cl\.role \|\| 'LOCATED_AT'/g, "'LOCATED_AT'");

// fix addEdge in expandGraphNode to accept relId
content = content.replace(
  "const addEdge = (source: string, target: string, relationship: string, verified: boolean = true) => {",
  "const addEdge = (source: string, target: string, relationship: string, verified: boolean = true, relId?: string) => {"
);
content = content.replace(
  "const eid = `${source}-${target}-${relationship}`;",
  "const eid = relId || `${source}-${target}-${relationship}`;"
);
content = content.replace(
  "edges.set(eid, { id: eid, source, target, relationship, verified });",
  "edges.set(eid, { id: eid, source, target, relationship, verified, relId });"
);

fs.writeFileSync('src/db/graph.ts', content);

let componentContent = fs.readFileSync('src/components/RabbitHoleGraph.tsx', 'utf8');
componentContent = componentContent.replace(/\(d: any\)/g, "(d: GraphNode)");
componentContent = componentContent.replace(/\.attr\('stroke-dasharray', d => d\.verified \? 'none' : '4,4'\)/g, ".attr('stroke-dasharray', (d: any) => d.verified ? 'none' : '4,4')");
componentContent = componentContent.replace(/\.attr\('stroke', d => d\.verified \? '#10B981' : '#4B5563'\)/g, ".attr('stroke', (d: any) => d.verified ? '#10B981' : '#4B5563')");
componentContent = componentContent.replace(/\.attr\('r', d => d\.type === 'case_files' \? 14 : 10\)/g, ".attr('r', (d: any) => d.type === 'case_files' ? 14 : 10)");
componentContent = componentContent.replace(/\.attr\('fill', d => getNodeColor\(d\.type, d\.rating\)\)/g, ".attr('fill', (d: any) => getNodeColor(d.type, d.rating))");
componentContent = componentContent.replace(/\.text\(d => d\.label\)/g, ".text((d: any) => d.label)");
componentContent = componentContent.replace(/\.attr\('x1', d => \(d\.source as GraphNode\)\.x!\)/g, ".attr('x1', (d: any) => (d.source as GraphNode).x!)");
componentContent = componentContent.replace(/\.attr\('y1', d => \(d\.source as GraphNode\)\.y!\)/g, ".attr('y1', (d: any) => (d.source as GraphNode).y!)");
componentContent = componentContent.replace(/\.attr\('x2', d => \(d\.target as GraphNode\)\.x!\)/g, ".attr('x2', (d: any) => (d.target as GraphNode).x!)");
componentContent = componentContent.replace(/\.attr\('y2', d => \(d\.target as GraphNode\)\.y!\)/g, ".attr('y2', (d: any) => (d.target as GraphNode).y!)");
componentContent = componentContent.replace(/\.attr\('transform', d => \`translate\(\$\{d\.x\},\$\{d\.y\}\)\`\)/g, ".attr('transform', (d: any) => `translate(${d.x},${d.y})`)");

fs.writeFileSync('src/components/RabbitHoleGraph.tsx', componentContent);

