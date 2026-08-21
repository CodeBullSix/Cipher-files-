import { db } from './index.js';
import { users, caseFiles, discussions, discussionReplies } from './schema.js';
import { INITIAL_CASES } from '../data/initialData.js';

export async function seed() {
  console.log('Starting DB seed...');
  
  // Seed demo users
  const adminUid = 'seed-admin-uid';
  await db.insert(users).values({
    uid: adminUid,
    username: 'archivist',
    displayName: 'The Archivist',
    email: 'archivist@cipherfiles.com',
    role: 'ADMIN',
    reputation: 9999,
  }).onConflictDoNothing();

  const userUid = 'seed-user-uid';
  await db.insert(users).values({
    uid: userUid,
    username: 'truthseeker01',
    displayName: 'Truth Seeker',
    email: 'truth@cipherfiles.com',
    role: 'USER',
    reputation: 150,
  }).onConflictDoNothing();

  // Seed cases
  for (const c of INITIAL_CASES) {
    try {
      await db.insert(caseFiles).values({
        id: c.id,
        title: c.title,
        slug: c.id,
        summary: c.summary,
        description: c.claim || '',
        category: c.category,
        status: c.status,
        featured: c.id === 'mkultra' || c.id === 'roswell',
        createdBy: adminUid
      }).onConflictDoNothing();
    } catch (e) {
      console.error(`Failed to seed case ${c.id}:`, e);
    }
  }

  // Seed discussions
  const discId = 'seed-disc-1';
  await db.insert(discussions).values({
    id: discId,
    title: 'How extensive was the program?',
    content: 'The official records say it was halted, but considering the destruction of documents by Richard Helms in 1973, what are the chances it just continued under a different codename?',
    authorId: userUid,
    caseFileId: 'aatip-pentagon-uap'
  }).onConflictDoNothing();

  await db.insert(discussionReplies).values({
    id: 'seed-reply-1',
    discussionId: discId,
    authorId: adminUid,
    content: 'We only have access to financial records that escaped the purge. The true extent will likely never be known.'
  }).onConflictDoNothing();

  console.log('Seed complete.');
}

if (import.meta.url === `file://${process.argv[1]}`) {
  seed().then(() => process.exit(0)).catch((e) => {
    console.error(e);
    process.exit(1);
  });
}
