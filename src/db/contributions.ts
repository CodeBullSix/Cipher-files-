import { db } from './index.js';
import { 
  reputationEvents, discussions, discussionReplies, caseFiles, 
  evidenceItems, people, organisations, locations, entityRelationships 
} from './schema.js';
import { eq, inArray, desc, and } from 'drizzle-orm';

export async function getUserContributions(userId: string, filter?: string, limit: number = 50) {
  let conditions = [eq(reputationEvents.userId, userId)];
  
  if (filter && filter !== 'ALL') {
    if (filter === 'DISCUSSIONS') {
      conditions.push(inArray(reputationEvents.type, ['CREATED_DISCUSSION', 'DISCUSSION_REPLY']));
    } else if (filter === 'EVIDENCE') {
      conditions.push(inArray(reputationEvents.type, ['CONTRIBUTED_EVIDENCE', 'EVIDENCE_VERIFIED']));
    } else if (filter === 'ENTITIES') {
      conditions.push(eq(reputationEvents.type, 'FACT_CHECKED'));
    } else if (filter === 'CASES') {
      conditions.push(eq(reputationEvents.type, 'CREATED_CASE'));
    }
  }

  const events = await db.query.reputationEvents.findMany({
    where: and(...conditions),
    orderBy: [desc(reputationEvents.createdAt)],
    limit: limit
  });

  const enrichedEvents = [];

  // Group by type for batch lookups
  const discussionIds = events.filter(e => e.type === 'CREATED_DISCUSSION' && e.relatedRecordId).map(e => e.relatedRecordId!);
  const replyIds = events.filter(e => e.type === 'DISCUSSION_REPLY' && e.relatedRecordId).map(e => e.relatedRecordId!);
  const caseIds = events.filter(e => e.type === 'CREATED_CASE' && e.relatedRecordId).map(e => e.relatedRecordId!);
  const evidenceIds = events.filter(e => e.type === 'CONTRIBUTED_EVIDENCE' && e.relatedRecordId).map(e => e.relatedRecordId!);
  const factCheckedIds = events.filter(e => e.type === 'FACT_CHECKED' && e.relatedRecordId).map(e => e.relatedRecordId!);

  let fetchedDiscussions: any[] = [];
  if (discussionIds.length > 0) fetchedDiscussions = await db.select().from(discussions).where(inArray(discussions.id, discussionIds));

  let fetchedReplies: any[] = [];
  if (replyIds.length > 0) fetchedReplies = await db.select().from(discussionReplies).where(inArray(discussionReplies.id, replyIds));

  let fetchedCases: any[] = [];
  if (caseIds.length > 0) fetchedCases = await db.select().from(caseFiles).where(inArray(caseFiles.id, caseIds));

  let fetchedEvidence: any[] = [];
  if (evidenceIds.length > 0) fetchedEvidence = await db.select().from(evidenceItems).where(inArray(evidenceItems.id, evidenceIds));

  let fetchedPeople: any[] = [];
  let fetchedOrgs: any[] = [];
  let fetchedLocs: any[] = [];
  let fetchedRels: any[] = [];
  if (factCheckedIds.length > 0) {
    [fetchedPeople, fetchedOrgs, fetchedLocs, fetchedRels] = await Promise.all([
      db.select().from(people).where(inArray(people.id, factCheckedIds)),
      db.select().from(organisations).where(inArray(organisations.id, factCheckedIds)),
      db.select().from(locations).where(inArray(locations.id, factCheckedIds)),
      db.select().from(entityRelationships).where(inArray(entityRelationships.id, factCheckedIds))
    ]);
  }

  for (const event of events) {
    let title = event.reason || '';
    let status = 'ACTIVE';
    let recordType = 'UNKNOWN';
    let recordId = event.relatedRecordId || '';

    if (event.type === 'CREATED_DISCUSSION') {
      const disc = fetchedDiscussions.find(d => d.id === event.relatedRecordId);
      if (disc) {
        title = disc.title;
        status = 'ACTIVE';
        recordType = 'DISCUSSION';
      } else {
        status = 'REMOVED';
      }
    } else if (event.type === 'DISCUSSION_REPLY') {
      const reply = fetchedReplies.find(r => r.id === event.relatedRecordId);
      if (reply) {
        title = `Reply: ${reply.content.substring(0, 50)}...`;
        status = 'ACTIVE';
        recordType = 'DISCUSSION';
        recordId = reply.threadId; // Navigate to the parent thread
      } else {
        status = 'REMOVED';
      }
    } else if (event.type === 'CREATED_CASE') {
      const caseFile = fetchedCases.find(c => c.id === event.relatedRecordId);
      if (caseFile) {
        title = caseFile.title;
        status = caseFile.status;
        recordType = 'CASE';
      } else {
        status = 'REMOVED';
      }
    } else if (event.type === 'CONTRIBUTED_EVIDENCE') {
      const evidence = fetchedEvidence.find(e => e.id === event.relatedRecordId);
      if (evidence) {
        title = evidence.title;
        status = evidence.status;
        recordType = 'EVIDENCE';
      } else {
        status = 'REMOVED';
      }
    } else if (event.type === 'FACT_CHECKED') {
      const person = fetchedPeople.find(p => p.id === event.relatedRecordId);
      const org = fetchedOrgs.find(o => o.id === event.relatedRecordId);
      const loc = fetchedLocs.find(l => l.id === event.relatedRecordId);
      const rel = fetchedRels.find(r => r.id === event.relatedRecordId);
      
      if (person) {
        title = person.name;
        status = person.verificationStatus || 'ACTIVE';
        recordType = 'PERSON';
      } else if (org) {
        title = org.name;
        status = org.verificationStatus || 'ACTIVE';
        recordType = 'ORGANISATION';
      } else if (loc) {
        title = loc.name;
        status = loc.verificationStatus || 'ACTIVE';
        recordType = 'LOCATION';
      } else if (rel) {
        // we might want to get the names of the entities, but that requires more joining.
        // for now, just fallback to reason
        title = event.reason || 'Relationship mapped';
        status = rel.verificationStatus || 'ACTIVE';
        recordType = 'RELATIONSHIP';
      } else {
        status = 'REMOVED';
      }
    }

    enrichedEvents.push({
      id: event.id,
      type: event.type,
      points: event.points,
      reason: event.reason,
      createdAt: event.createdAt,
      recordId,
      title,
      status,
      recordType
    });
  }

  return enrichedEvents;
}
