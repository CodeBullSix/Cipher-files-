import { db } from './index.js';
import * as schema from './schema.js';
import { ilike, or, and, eq, desc, asc, inArray, sql } from 'drizzle-orm';

export type SearchFilter = {
  query?: string;
  types?: string[]; // CASE, PERSON, ORGANISATION, LOCATION, EVENT, EVIDENCE
  status?: string[]; // VERIFIED, UNVERIFIED, DISPUTED
  caseId?: string; // Filter by associated case ID
  dateFrom?: string; // For events/evidence
  dateTo?: string;
};

export async function globalSearch(filter: SearchFilter) {
  const q = filter.query ? `%${filter.query}%` : '%';
  const results: any[] = [];
  
  const allowedTypes = filter.types && filter.types.length > 0 ? filter.types : ['CASE', 'PERSON', 'ORGANISATION', 'LOCATION', 'EVENT', 'EVIDENCE'];
  const statusFilter = filter.status && filter.status.length > 0 ? filter.status : null;

  // Search Cases
  if (allowedTypes.includes('CASE')) {
    const caseWhere = [
      or(
        ilike(schema.caseFiles.title, q),
        ilike(schema.caseFiles.description, q),
        ilike(schema.caseFiles.summary, q),
        ilike(schema.caseFiles.caseNumber, q)
      )
    ];
    if (filter.caseId) {
      caseWhere.push(eq(schema.caseFiles.id, filter.caseId));
    }
    const cases = await db.query.caseFiles.findMany({
      where: and(...caseWhere),
      limit: 20
    });
    results.push(...cases.map(c => ({
      resultType: 'CASE',
      id: c.id,
      title: c.title,
      description: c.summary,
      status: c.status,
      timestamp: c.createdAt,
      metadata: { caseNumber: c.caseNumber, category: c.category }
    })));
  }

  // Search People
  if (allowedTypes.includes('PERSON')) {
    const personWhere: any[] = [
      or(
        ilike(schema.people.name, q),
        ilike(schema.people.aliases, q),
        ilike(schema.people.description, q)
      )
    ];
    if (statusFilter) {
      personWhere.push(inArray(schema.people.verificationStatus, statusFilter as any));
    }
    if (filter.caseId) {
      const casePeople = await db.query.casePeople.findMany({
        where: eq(schema.casePeople.caseFileId, filter.caseId)
      });
      const pIds = casePeople.map(cp => cp.personId);
      if (pIds.length > 0) personWhere.push(inArray(schema.people.id, pIds));
      else personWhere.push(eq(schema.people.id, 'NO_MATCH'));
    }
    const people = await db.query.people.findMany({
      where: and(...personWhere),
      limit: 20
    });
    results.push(...people.map(p => ({
      resultType: 'PERSON',
      id: p.id,
      title: p.name,
      description: p.description || p.aliases,
      status: p.verificationStatus,
      timestamp: p.createdAt
    })));
  }

  // Search Organisations
  if (allowedTypes.includes('ORGANISATION')) {
    const orgWhere: any[] = [
      or(
        ilike(schema.organisations.name, q),
        ilike(schema.organisations.aliases, q),
        ilike(schema.organisations.description, q)
      )
    ];
    if (statusFilter) {
      orgWhere.push(inArray(schema.organisations.verificationStatus, statusFilter as any));
    }
    if (filter.caseId) {
      const caseOrgs = await db.query.caseOrganisations.findMany({
        where: eq(schema.caseOrganisations.caseFileId, filter.caseId)
      });
      const oIds = caseOrgs.map(co => co.organisationId);
      if (oIds.length > 0) orgWhere.push(inArray(schema.organisations.id, oIds));
      else orgWhere.push(eq(schema.organisations.id, 'NO_MATCH'));
    }
    const orgs = await db.query.organisations.findMany({
      where: and(...orgWhere),
      limit: 20
    });
    results.push(...orgs.map(o => ({
      resultType: 'ORGANISATION',
      id: o.id,
      title: o.name,
      description: o.description,
      status: o.verificationStatus,
      timestamp: o.createdAt
    })));
  }

  // Search Locations
  if (allowedTypes.includes('LOCATION')) {
    const locWhere: any[] = [
      or(
        ilike(schema.locations.name, q),
        ilike(schema.locations.description, q),
        ilike(schema.locations.country, q)
      )
    ];
    if (statusFilter) {
      locWhere.push(inArray(schema.locations.verificationStatus, statusFilter as any));
    }
    if (filter.caseId) {
      const caseLocs = await db.query.caseLocations.findMany({
        where: eq(schema.caseLocations.caseFileId, filter.caseId)
      });
      const lIds = caseLocs.map(cl => cl.locationId);
      if (lIds.length > 0) locWhere.push(inArray(schema.locations.id, lIds));
      else locWhere.push(eq(schema.locations.id, 'NO_MATCH'));
    }
    const locs = await db.query.locations.findMany({
      where: and(...locWhere),
      limit: 20
    });
    results.push(...locs.map(l => ({
      resultType: 'LOCATION',
      id: l.id,
      title: l.name,
      description: l.description,
      status: l.verificationStatus,
      timestamp: l.createdAt
    })));
  }

  // Search Events
  if (allowedTypes.includes('EVENT')) {
    const eventWhere: any[] = [
      or(
        ilike(schema.events.title, q),
        ilike(schema.events.description, q)
      )
    ];
    if (statusFilter) {
      eventWhere.push(inArray(schema.events.verificationStatus, statusFilter as any));
    }
    if (filter.caseId) {
      const caseEvents = await db.query.eventCaseFiles.findMany({
        where: eq(schema.eventCaseFiles.caseFileId, filter.caseId)
      });
      const eIds = caseEvents.map(ce => ce.eventId);
      if (eIds.length > 0) eventWhere.push(inArray(schema.events.id, eIds));
      else eventWhere.push(eq(schema.events.id, 'NO_MATCH'));
    }
    const evs = await db.query.events.findMany({
      where: and(...eventWhere),
      limit: 20
    });
    results.push(...evs.map(e => ({
      resultType: 'EVENT',
      id: e.id,
      title: e.title,
      description: e.description,
      status: e.verificationStatus,
      timestamp: e.startDate || e.createdAt,
      metadata: { dateString: e.dateString }
    })));
  }

  // Search Evidence
  if (allowedTypes.includes('EVIDENCE')) {
    const evWhere: any[] = [
      or(
        ilike(schema.evidenceItems.title, q),
        ilike(schema.evidenceItems.description, q)
      )
    ];
    if (statusFilter) {
      evWhere.push(inArray(schema.evidenceItems.status, statusFilter as any));
    }
    if (filter.caseId) {
      const caseEvs = await db.query.evidenceCaseFiles.findMany({
        where: eq(schema.evidenceCaseFiles.caseFileId, filter.caseId)
      });
      const evIds = caseEvs.map(ce => ce.evidenceId);
      if (evIds.length > 0) evWhere.push(inArray(schema.evidenceItems.id, evIds));
      else evWhere.push(eq(schema.evidenceItems.id, 'NO_MATCH'));
    }
    const evs = await db.query.evidenceItems.findMany({
      where: and(...evWhere),
      limit: 20
    });
    results.push(...evs.map(e => ({
      resultType: 'EVIDENCE',
      id: e.id,
      title: e.title,
      description: e.description,
      status: e.status,
      timestamp: e.createdAt,
      metadata: { evidenceType: e.type }
    })));
  }

  // Sort by some heuristic (e.g. relevance or timestamp)
  results.sort((a, b) => {
    const timeA = a.timestamp ? new Date(a.timestamp).getTime() : 0;
    const timeB = b.timestamp ? new Date(b.timestamp).getTime() : 0;
    return (isNaN(timeB) ? 0 : timeB) - (isNaN(timeA) ? 0 : timeA);
  });

  return results.slice(0, 50); // Limit overall results
}
