import { db } from './src/db/index.js';
import { users, events, eventCaseFiles } from './src/db/schema.js';
import { eq } from 'drizzle-orm';
import { INITIAL_CASES } from './src/data/initialData.js';
import { v4 as uuidv4 } from 'uuid';

async function run() {
  console.log("Starting event restoration...");
  
  let adminUid = '';
  const existingUsers = await db.select().from(users);
  if (existingUsers.length === 0) {
    adminUid = 'system_admin_' + uuidv4();
    await db.insert(users).values({
      uid: adminUid,
      username: 'sysadmin',
      displayName: 'System Admin',
      email: 'admin@cipherfiles.org',
      role: 'ADMIN'
    });
  } else {
    adminUid = existingUsers[0].uid;
  }
  
  let restoredEventsCount = 0;
  let restoredRelationsCount = 0;
  
  for (const caseFile of INITIAL_CASES) {
    if (!caseFile.timeline || caseFile.timeline.length === 0) {
      continue;
    }
    
    for (const tlEvent of caseFile.timeline) {
      let verificationStatus: 'UNVERIFIED' | 'VERIFIED' | 'DISPUTED' = 'UNVERIFIED';
      if (tlEvent.rating === 'VERIFIED' || tlEvent.rating === 'DOCUMENTED' || tlEvent.rating === 'CONFIRMED') verificationStatus = 'VERIFIED';
      if (tlEvent.rating === 'DISPROVEN' || tlEvent.rating === 'DEBUNKED') verificationStatus = 'DISPUTED';
      
      let description = tlEvent.description || '';
      if (tlEvent.time) {
        description = `Time: ${tlEvent.time}\n\n${description}`;
      }
      if (tlEvent.sourceReference) {
        description = `${description}\n\nSource: ${tlEvent.sourceReference}`;
      }
      
      let startDate: Date | null = null;
      try {
        if (tlEvent.date) {
          const parsed = new Date(tlEvent.date);
          if (!isNaN(parsed.getTime())) {
            startDate = parsed;
          }
        }
      } catch (e) {}

      await db.insert(events).values({
        id: tlEvent.id,
        title: tlEvent.title || 'Unknown Event',
        description,
        type: 'INCIDENT',
        dateString: tlEvent.date || 'Unknown',
        startDate,
        datePrecision: 'EXACT',
        location: tlEvent.location || null,
        verificationStatus,
        createdBy: adminUid
      }).onConflictDoUpdate({
        target: events.id,
        set: {
          title: tlEvent.title || 'Unknown Event',
          description,
          dateString: tlEvent.date || 'Unknown',
          startDate,
          location: tlEvent.location || null,
          verificationStatus
        }
      });
      restoredEventsCount++;
      
      await db.insert(eventCaseFiles).values({
        eventId: tlEvent.id,
        caseFileId: caseFile.id
      }).onConflictDoNothing();
      restoredRelationsCount++;
    }
  }
  
  console.log(`Restored ${restoredEventsCount} events.`);
  console.log(`Restored ${restoredRelationsCount} case relationships.`);
  process.exit(0);
}
run().catch(console.error);
