import fs from 'fs';
let content = fs.readFileSync('src/db/graph.ts', 'utf8');

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

// We need to pass relId in expandGraphNode for entityRelationships
content = content.replace(
  "addEdge(`people_${id}`, `${rel.targetType}_${rel.targetId}`, rel.relationshipType, rel.verificationStatus === 'VERIFIED');",
  "addEdge(`people_${id}`, `${rel.targetType}_${rel.targetId}`, rel.relationshipType, rel.verificationStatus === 'VERIFIED', rel.id);"
);
content = content.replace(
  "addEdge(`${rel.sourceType}_${rel.sourceId}`, `people_${id}`, rel.relationshipType, rel.verificationStatus === 'VERIFIED');",
  "addEdge(`${rel.sourceType}_${rel.sourceId}`, `people_${id}`, rel.relationshipType, rel.verificationStatus === 'VERIFIED', rel.id);"
);
content = content.replace(
  "addEdge(`organisations_${id}`, `${rel.targetType}_${rel.targetId}`, rel.relationshipType, rel.verificationStatus === 'VERIFIED');",
  "addEdge(`organisations_${id}`, `${rel.targetType}_${rel.targetId}`, rel.relationshipType, rel.verificationStatus === 'VERIFIED', rel.id);"
);
content = content.replace(
  "addEdge(`${rel.sourceType}_${rel.sourceId}`, `organisations_${id}`, rel.relationshipType, rel.verificationStatus === 'VERIFIED');",
  "addEdge(`${rel.sourceType}_${rel.sourceId}`, `organisations_${id}`, rel.relationshipType, rel.verificationStatus === 'VERIFIED', rel.id);"
);
content = content.replace(
  "addEdge(`locations_${id}`, `${rel.targetType}_${rel.targetId}`, rel.relationshipType, rel.verificationStatus === 'VERIFIED');",
  "addEdge(`locations_${id}`, `${rel.targetType}_${rel.targetId}`, rel.relationshipType, rel.verificationStatus === 'VERIFIED', rel.id);"
);
content = content.replace(
  "addEdge(`${rel.sourceType}_${rel.sourceId}`, `locations_${id}`, rel.relationshipType, rel.verificationStatus === 'VERIFIED');",
  "addEdge(`${rel.sourceType}_${rel.sourceId}`, `locations_${id}`, rel.relationshipType, rel.verificationStatus === 'VERIFIED', rel.id);"
);

fs.writeFileSync('src/db/graph.ts', content);
