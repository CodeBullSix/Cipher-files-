const fs = require('fs');
const file = 'src/routes/reports.ts';
let content = fs.readFileSync(file, 'utf8');

const checkCode = `
    // 3.5 Prevent Duplicate Active Reports
    const [existingReport] = await db.select().from(reports).where(and(
      eq(reports.reporterId, reporterId),
      eq(reports.targetId, targetId)
    ));
    if (existingReport) {
      return res.status(400).json({ error: 'You have already reported this content.' });
    }

    // 4. Create report
`;

content = content.replace(
  "    // 4. Create report",
  checkCode
);

fs.writeFileSync(file, content);
