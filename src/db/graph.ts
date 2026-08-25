import { db } from './index.js';
import { sql, eq, or, and, inArray } from 'drizzle-orm';
import * as schema from './schema.js';

export async function getGraphForCase(caseId: string) {
  const nodes = new Map<string, any>();
  const edges = new Map<string, any>();

  // Helper to add node
  const addNode = (id: string, label: string, type: string, extra: any = {}) => {
    if (!nodes.has(id)) {
      nodes.set(id, { id, label, type, ...extra });
    }
  };

  // Helper to add edge
  const addEdge = (source: string, target: string, relationship: string, verified: boolean = true, relId?: string) => {
    const id = `${source}-${target}-${relationship}`;
    if (!edges.has(id)) {
      edges.set(id, { id, source, target, relationship, verified });
    }
  };

  // 1. Get the Case File
  const caseFile = await db.query.caseFiles.findFirst({
    where: eq(schema.caseFiles.id, caseId)
  });
  if (caseFile) {
    addNode(`case_files_${caseId}`, caseFile.title, 'case_files', { rating: caseFile.status });
  }

  // 2. Get People connected to case
  const casePeopleList = await db.query.casePeople.findMany({
    where: eq(schema.casePeople.caseFileId, caseId),
    with: { person: true }
  });
  for (const cp of casePeopleList) {
    if (cp.person) {
      addNode(`people_${cp.person.id}`, cp.person.name, 'people', { verificationStatus: cp.person.verificationStatus });
      addEdge(`case_files_${caseId}`, `people_${cp.person.id}`, 'INVOLVES', cp.person.verificationStatus === 'VERIFIED');
    }
  }

  // 3. Get Organisations connected to case
  const caseOrgsList = await db.query.caseOrganisations.findMany({
    where: eq(schema.caseOrganisations.caseFileId, caseId),
    with: { organisation: true }
  });
  for (const co of caseOrgsList) {
    if (co.organisation) {
      addNode(`organisations_${co.organisation.id}`, co.organisation.name, 'organisations', { verificationStatus: co.organisation.verificationStatus });
      addEdge(`case_files_${caseId}`, `organisations_${co.organisation.id}`, 'INVOLVES', co.organisation.verificationStatus === 'VERIFIED');
    }
  }

  // 4. Get Locations connected to case
  const caseLocsList = await db.query.caseLocations.findMany({
    where: eq(schema.caseLocations.caseFileId, caseId),
    with: { location: true }
  });
  for (const cl of caseLocsList) {
    if (cl.location) {
      addNode(`locations_${cl.location.id}`, cl.location.name, 'locations', { verificationStatus: cl.location.verificationStatus });
      addEdge(`case_files_${caseId}`, `locations_${cl.location.id}`, 'LOCATED_AT', cl.location.verificationStatus === 'VERIFIED');
    }
  }

  // 5. Get Events for case
  const caseEventsList = await db.query.eventCaseFiles.findMany({
    where: eq(schema.eventCaseFiles.caseFileId, caseId),
    with: { event: true }
  });
  for (const ce of caseEventsList) {
    if (ce.event) {
      addNode(`events_${ce.event.id}`, ce.event.title, 'events', { verificationStatus: ce.event.verificationStatus, dateString: ce.event.dateString });
      addEdge(`case_files_${caseId}`, `events_${ce.event.id}`, 'CONTAINS_EVENT', ce.event.verificationStatus === 'VERIFIED');
    }
  }

  // Return formatted structure
  return {
    nodes: Array.from(nodes.values()),
    edges: Array.from(edges.values())
  };
}

export async function expandGraphNode(nodeIdStr: string) {
  const parts = nodeIdStr.split('_');
  const id = parts.pop()!;
  const entityType = parts.join('_');

  const nodes = new Map<string, any>();
  const edges = new Map<string, any>();

  const addNode = (id: string, label: string, type: string, extra: any = {}) => {
    if (!nodes.has(id)) nodes.set(id, { id, label, type, ...extra });
  };
  const addEdge = (source: string, target: string, relationship: string, verified: boolean = true, relId?: string) => {
    const eid = relId || `${source}-${target}-${relationship}`;
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
     addEdge(`${entityType}_${id}`, `${rel.targetType}_${rel.targetId}`, rel.relationshipType, rel.verificationStatus === 'VERIFIED', rel.id);
     const targetLabel = await getEntityLabel(rel.targetType, rel.targetId);
     addNode(`${rel.targetType}_${rel.targetId}`, targetLabel, rel.targetType);
  }

  const targetRels = await db.query.entityRelationships.findMany({
    where: and(eq(schema.entityRelationships.targetType, entityType), eq(schema.entityRelationships.targetId, id))
  });
  for (const rel of targetRels) {
     addEdge(`${rel.sourceType}_${rel.sourceId}`, `${entityType}_${id}`, rel.relationshipType, rel.verificationStatus === 'VERIFIED', rel.id);
     const sourceLabel = await getEntityLabel(rel.sourceType, rel.sourceId);
     addNode(`${rel.sourceType}_${rel.sourceId}`, sourceLabel, rel.sourceType);
  }

  // 2. Case Connections
  if (entityType === 'people') {
    const cp = await db.query.casePeople.findMany({ where: eq(schema.casePeople.personId, id), with: { caseFile: true } });
    for (const r of cp) {
      if (r.caseFile) {
        addNode(`case_files_${r.caseFile.id}`, r.caseFile.title, 'case_files');
        addEdge(`case_files_${r.caseFile.id}`, `people_${id}`, 'INVOLVES');
      }
    }
    const ep = await db.query.eventPeople.findMany({ where: eq(schema.eventPeople.personId, id), with: { event: true } });
    for (const r of ep) {
      if (r.event) {
        addNode(`events_${r.event.id}`, r.event.title, 'events');
        addEdge(`events_${r.event.id}`, `people_${id}`, 'INVOLVES');
      }
    }
  }

  if (entityType === 'organisations') {
    const co = await db.query.caseOrganisations.findMany({ where: eq(schema.caseOrganisations.organisationId, id), with: { caseFile: true } });
    for (const r of co) {
      if (r.caseFile) {
        addNode(`case_files_${r.caseFile.id}`, r.caseFile.title, 'case_files');
        addEdge(`case_files_${r.caseFile.id}`, `organisations_${id}`, 'INVOLVES');
      }
    }
    const eo = await db.query.eventOrganisations.findMany({ where: eq(schema.eventOrganisations.organisationId, id), with: { event: true } });
    for (const r of eo) {
      if (r.event) {
        addNode(`events_${r.event.id}`, r.event.title, 'events');
        addEdge(`events_${r.event.id}`, `organisations_${id}`, 'INVOLVES');
      }
    }
  }

  if (entityType === 'locations') {
    const cl = await db.query.caseLocations.findMany({ where: eq(schema.caseLocations.locationId, id), with: { caseFile: true } });
    for (const r of cl) {
      if (r.caseFile) {
        addNode(`case_files_${r.caseFile.id}`, r.caseFile.title, 'case_files');
        addEdge(`case_files_${r.caseFile.id}`, `locations_${id}`, 'LOCATED_AT');
      }
    }
    const el = await db.query.eventLocations.findMany({ where: eq(schema.eventLocations.locationId, id), with: { event: true } });
    for (const r of el) {
      if (r.event) {
        addNode(`events_${r.event.id}`, r.event.title, 'events');
        addEdge(`events_${r.event.id}`, `locations_${id}`, 'OCCURRED_AT');
      }
    }
  }

  if (entityType === 'events') {
    const ec = await db.query.eventCaseFiles.findMany({ where: eq(schema.eventCaseFiles.eventId, id), with: { caseFile: true } });
    for (const r of ec) {
      if (r.caseFile) {
        addNode(`case_files_${r.caseFile.id}`, r.caseFile.title, 'case_files');
        addEdge(`case_files_${r.caseFile.id}`, `events_${id}`, 'CONTAINS_EVENT');
      }
    }
    const ep = await db.query.eventPeople.findMany({ where: eq(schema.eventPeople.eventId, id), with: { person: true } });
    for (const r of ep) {
      if (r.person) {
        addNode(`people_${r.person.id}`, r.person.name, 'people');
        addEdge(`events_${id}`, `people_${r.person.id}`, 'INVOLVES');
      }
    }
    const eo = await db.query.eventOrganisations.findMany({ where: eq(schema.eventOrganisations.eventId, id), with: { organisation: true } });
    for (const r of eo) {
      if (r.organisation) {
        addNode(`organisations_${r.organisation.id}`, r.organisation.name, 'organisations');
        addEdge(`events_${id}`, `organisations_${r.organisation.id}`, 'INVOLVES');
      }
    }
    const el = await db.query.eventLocations.findMany({ where: eq(schema.eventLocations.eventId, id), with: { location: true } });
    for (const r of el) {
      if (r.location) {
        addNode(`locations_${r.location.id}`, r.location.name, 'locations');
        addEdge(`events_${id}`, `locations_${r.location.id}`, 'OCCURRED_AT');
      }
    }
  }

  return {
    nodes: Array.from(nodes.values()),
    edges: Array.from(edges.values())
  };
}

async function getEntityLabel(type: string, id: string): Promise<string> {
  if (type === 'people') {
    const e = await db.query.people.findFirst({ where: eq(schema.people.id, id) });
    return e ? e.name : id;
  }
  if (type === 'organisations') {
    const e = await db.query.organisations.findFirst({ where: eq(schema.organisations.id, id) });
    return e ? e.name : id;
  }
  if (type === 'locations') {
    const e = await db.query.locations.findFirst({ where: eq(schema.locations.id, id) });
    return e ? e.name : id;
  }
  if (type === 'events') {
    const e = await db.query.events.findFirst({ where: eq(schema.events.id, id) });
    return e ? e.title : id;
  }
  if (type === 'case_files') {
    const e = await db.query.caseFiles.findFirst({ where: eq(schema.caseFiles.id, id) });
    return e ? e.title : id;
  }
  return id;
}

export async function getInitialGraphNodes() {
  const cases = await db.query.caseFiles.findMany();
  const nodes = cases.map(c => ({
    id: `case_files_${c.id}`,
    label: c.title,
    type: 'case_files',
    rating: c.status
  }));
  return { nodes, edges: [] };
}
