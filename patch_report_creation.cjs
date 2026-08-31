const fs = require('fs');
const file = 'src/routes/reports.ts';
let content = fs.readFileSync(file, 'utf8');

const reportCreation = `    // 4. Create report
    const newReport = await db.insert(reports).values({
      id: uuidv4(),
      reporterId,
      targetType,
      targetId,
      targetAuthorId,
      reason,
      description: description || null
    }).returning();`;

const reportCreationNew = `    // 4. Create report
    const newReport = await db.insert(reports).values({
      id: uuidv4(),
      reporterId,
      targetType,
      targetId,
      targetAuthorId,
      reason,
      description: description || null
    }).returning();
    
    // Audit Log
    await db.insert(moderationLogs).values({
      id: uuidv4(),
      actorId: reporterId,
      action: 'REPORT',
      targetType: 'REPORT',
      targetId: newReport[0].id,
      reason: reason,
      newStatus: 'OPEN'
    }).catch(console.error);`;

content = content.replace(reportCreation, reportCreationNew);

fs.writeFileSync(file, content);
