const fs = require('fs');
const file = 'src/db/evidence.ts';
let content = fs.readFileSync(file, 'utf8');

if (!content.includes('import { createNotification }')) {
  content = content.replace(
    "import { awardReputation } from './reputation.js';",
    "import { awardReputation } from './reputation.js';\nimport { createNotification } from './notifications.js';"
  );
}

const triggerStatusBlock = `
  const actionMap: Record<string, any> = {
    'VERIFIED': 'VERIFIED',
    'DISPUTED': 'DISPUTED',
    'REJECTED': 'REJECTED'
  };

  const updatedEv = await getEvidenceById(id);
  if (updatedEv && updatedEv.submittedById !== userId) {
    await createNotification(
      updatedEv.submittedById,
      'CONTRIBUTION_STATUS',
      'Evidence Status Updated',
      \`Your evidence "\${updatedEv.title.substring(0, 30)}" was marked as \${status}.\`,
      id,
      'EVIDENCE'
    ).catch(console.error);
  }

  await db.insert(evidenceAuditLogs)
`;

content = content.replace(
  `  const actionMap: Record<string, any> = {
    'VERIFIED': 'VERIFIED',
    'DISPUTED': 'DISPUTED',
    'REJECTED': 'REJECTED'
  };

  await db.insert(evidenceAuditLogs)`,
  triggerStatusBlock
);

fs.writeFileSync(file, content);
