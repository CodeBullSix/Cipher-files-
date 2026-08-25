const fs = require('fs');

let graphTs = fs.readFileSync('src/db/graph.ts', 'utf8');

// Replace the entire expandGraphNode function
const expandGraphNodeCode = `export async function expandGraphNode(nodeIdStr: string) {
  const parts = nodeIdStr.split('_');
  const id = parts.pop()!;
  const entityType = parts.join('_');

  const nodes = new Map<string, any>();
  const edges = new Map<string, any>();

  const addNode = (id: string, label: string, type: string, extra: any = {}) => {
    if (!nodes.has(id)) nodes.set(id, { id, label, type, ...extra });
  };
  const addEdge = (source: string, target: string, relationship: string, verified: boolean = true, relId?: string) => {
    const eid = relId || \`\${source}-\${target}-\${relationship}\`;
    if (!edges.has(eid)) edges.set(eid, { id: eid, source, target, relationship, verified, relId });
  };

  if (entityType === 'case_files') {
    // Re-use getGraphForCase logic
    const caseData = await getGraphForCase(id);
    return caseData;
  }

  // Handle standard entities
  // 1. Generic Relationships
  const sourceRels = await db.query.entityRelationships.findMany({
    where: and(eq(schema.entityRelationships.sourceType, entityType), eq(schema.entityRelationships.sourceId, id))
  });
  for (const rel of sourceRels) {
     addEdge(\`\${entityType}_\${id}\`, \`\${rel.targetType}_\${rel.targetId}\`, rel.relationshipType, rel.verificationStatus === 'VERIFIED', rel.id);
     const targetLabel = await getEntityLabel(rel.targetType, rel.targetId);
     addNode(\`\${rel.targetType}_\${rel.targetId}\`, targetLabel, rel.targetType);
  }

  const targetRels = await db.query.entityRelationships.findMany({
    where: and(eq(schema.entityRelationships.targetType, entityType), eq(schema.entityRelationships.targetId, id))
  });
  for (const rel of targetRels) {
     addEdge(\`\${rel.sourceType}_\${rel.sourceId}\`, \`\${entityType}_\${id}\`, rel.relationshipType, rel.verificationStatus === 'VERIFIED', rel.id);
     const sourceLabel = await getEntityLabel(rel.sourceType, rel.sourceId);
     addNode(\`\${rel.sourceType}_\${rel.sourceId}\`, sourceLabel, rel.sourceType);
  }

  // 2. Case Connections
  if (entityType === 'people') {
    const cp = await db.query.casePeople.findMany({ where: eq(schema.casePeople.personId, id), with: { caseFile: true } });
    for (const r of cp) {
      if (r.caseFile) {
        addNode(\`case_files_\${r.caseFile.id}\`, r.caseFile.title, 'case_files');
        addEdge(\`case_files_\${r.caseFile.id}\`, \`people_\${id}\`, 'INVOLVES');
      }
    }
    const ep = await db.query.eventPeople.findMany({ where: eq(schema.eventPeople.personId, id), with: { event: true } });
    for (const r of ep) {
      if (r.event) {
        addNode(\`events_\${r.event.id}\`, r.event.title, 'events');
        addEdge(\`events_\${r.event.id}\`, \`people_\${id}\`, 'INVOLVES');
      }
    }
  }

  if (entityType === 'organisations') {
    const co = await db.query.caseOrganisations.findMany({ where: eq(schema.caseOrganisations.organisationId, id), with: { caseFile: true } });
    for (const r of co) {
      if (r.caseFile) {
        addNode(\`case_files_\${r.caseFile.id}\`, r.caseFile.title, 'case_files');
        addEdge(\`case_files_\${r.caseFile.id}\`, \`organisations_\${id}\`, 'INVOLVES');
      }
    }
    const eo = await db.query.eventOrganisations.findMany({ where: eq(schema.eventOrganisations.organisationId, id), with: { event: true } });
    for (const r of eo) {
      if (r.event) {
        addNode(\`events_\${r.event.id}\`, r.event.title, 'events');
        addEdge(\`events_\${r.event.id}\`, \`organisations_\${id}\`, 'INVOLVES');
      }
    }
  }

  if (entityType === 'locations') {
    const cl = await db.query.caseLocations.findMany({ where: eq(schema.caseLocations.locationId, id), with: { caseFile: true } });
    for (const r of cl) {
      if (r.caseFile) {
        addNode(\`case_files_\${r.caseFile.id}\`, r.caseFile.title, 'case_files');
        addEdge(\`case_files_\${r.caseFile.id}\`, \`locations_\${id}\`, 'LOCATED_AT');
      }
    }
    const el = await db.query.eventLocations.findMany({ where: eq(schema.eventLocations.locationId, id), with: { event: true } });
    for (const r of el) {
      if (r.event) {
        addNode(\`events_\${r.event.id}\`, r.event.title, 'events');
        addEdge(\`events_\${r.event.id}\`, \`locations_\${id}\`, 'OCCURRED_AT');
      }
    }
  }

  if (entityType === 'events') {
    const ec = await db.query.eventCaseFiles.findMany({ where: eq(schema.eventCaseFiles.eventId, id), with: { caseFile: true } });
    for (const r of ec) {
      if (r.caseFile) {
        addNode(\`case_files_\${r.caseFile.id}\`, r.caseFile.title, 'case_files');
        addEdge(\`case_files_\${r.caseFile.id}\`, \`events_\${id}\`, 'CONTAINS_EVENT');
      }
    }
    const ep = await db.query.eventPeople.findMany({ where: eq(schema.eventPeople.eventId, id), with: { person: true } });
    for (const r of ep) {
      if (r.person) {
        addNode(\`people_\${r.person.id}\`, r.person.name, 'people');
        addEdge(\`events_\${id}\`, \`people_\${r.person.id}\`, 'INVOLVES');
      }
    }
    const eo = await db.query.eventOrganisations.findMany({ where: eq(schema.eventOrganisations.eventId, id), with: { organisation: true } });
    for (const r of eo) {
      if (r.organisation) {
        addNode(\`organisations_\${r.organisation.id}\`, r.organisation.name, 'organisations');
        addEdge(\`events_\${id}\`, \`organisations_\${r.organisation.id}\`, 'INVOLVES');
      }
    }
    const el = await db.query.eventLocations.findMany({ where: eq(schema.eventLocations.eventId, id), with: { location: true } });
    for (const r of el) {
      if (r.location) {
        addNode(\`locations_\${r.location.id}\`, r.location.name, 'locations');
        addEdge(\`events_\${id}\`, \`locations_\${r.location.id}\`, 'OCCURRED_AT');
      }
    }
  }

  return {
    nodes: Array.from(nodes.values()),
    edges: Array.from(edges.values())
  };
}`;

const expandGraphRegex = /export async function expandGraphNode[\s\S]*?return \{\n\s*nodes: Array\.from\(nodes\.values\(\)\),\n\s*edges: Array\.from\(edges\.values\(\)\)\n\s*\};\n\}/;
if (expandGraphRegex.test(graphTs)) {
  graphTs = graphTs.replace(expandGraphRegex, expandGraphNodeCode);
  fs.writeFileSync('src/db/graph.ts', graphTs);
  console.log('Graph replaced');
} else {
  console.log('Regex did not match');
}
