const fs = require('fs');
const file = 'src/db/evidence.ts';
let content = fs.readFileSync(file, 'utf8');

if (!content.includes('moderationLogs')) {
  content = content.replace("evidenceAuditLogs, users", "evidenceAuditLogs, moderationLogs, users");
}

const auditLogInsert = `  await db.insert(evidenceAuditLogs).values({
    id: uuidv4(),
    evidenceId: id,
    userId: userId,
    action: actionMap[status] || 'EDITED',
    notes: notes
  });`;

const newAuditLogInsert = `  await db.insert(evidenceAuditLogs).values({
    id: uuidv4(),
    evidenceId: id,
    userId: userId,
    action: actionMap[status] || 'EDITED',
    notes: notes
  });

  // Authoritative Audit Log
  const modAction = status === 'VERIFIED' ? 'APPROVE' : (status === 'REJECTED' ? 'REJECT' : (status === 'DISPUTED' ? 'DISPUTE' : 'APPROVE'));
  await db.insert(moderationLogs).values({
    id: uuidv4(),
    actorId: userId,
    action: modAction as any,
    targetType: 'EVIDENCE',
    targetId: id,
    reason: notes || 'Evidence verification status updated',
    newStatus: status
  }).catch(console.error);`;

content = content.replace(auditLogInsert, newAuditLogInsert);

fs.writeFileSync(file, content);
