import { db } from './index.js';
import { INITIAL_CASES } from '../data/initialData.js';
import { events, eventCaseFiles } from './schema.js';

async function seedEvents() {
  const adminUid = 'seed-admin-uid';
  for (const c of INITIAL_CASES) {
    if (!c.timeline) continue;
    
    for (const tm of c.timeline) {
      try {
        let sd = new Date();
        if (tm.date) {
           const parsed = new Date(tm.date);
           if (!isNaN(parsed.getTime())) {
              sd = parsed;
           }
        }

        await db.insert(events).values({
          id: tm.id,
          title: tm.title,
          description: tm.description,
          type: 'INCIDENT',
          dateString: tm.date,
          startDate: sd,
          verificationStatus: tm.rating === 'CONFIRMED' ? 'VERIFIED' : 'UNVERIFIED',
          createdBy: adminUid
        }).onConflictDoNothing();
        
        await db.insert(eventCaseFiles).values({
          eventId: tm.id,
          caseFileId: c.id
        }).onConflictDoNothing();
      } catch (err) {
        console.error(`Error inserting event ${tm.id}:`, err);
      }
    }
  }
  console.log("Events seeded successfully.");
}

seedEvents().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
