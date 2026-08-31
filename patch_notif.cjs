const fs = require('fs');
const file = 'src/routes/reports.ts';
let content = fs.readFileSync(file, 'utf8');

if (!content.includes('import { createNotification }')) {
  content = content.replace("import { db } from '../db/index.js';", "import { db } from '../db/index.js';\nimport { createNotification } from '../db/notifications.js';");
}

const resolveStr = `        resolvedById: ['RESOLVED', 'DISMISSED'].includes(status) ? req.user!.uid : null
      })
      .where(eq(reports.id, req.params.id))
      .returning();`;

const resolveStrReplacement = `        resolvedById: ['RESOLVED', 'DISMISSED'].includes(status) ? req.user!.uid : null
      })
      .where(eq(reports.id, req.params.id))
      .returning();

    if (updated && ['RESOLVED', 'DISMISSED'].includes(status) && updated.reporterId) {
      await createNotification(
        updated.reporterId,
        'SYSTEM_ALERT',
        \`Your report regarding a \${updated.targetType.toLowerCase()} has been \${status.toLowerCase()}.\`,
        updated.id
      ).catch(console.error);
    }`;

content = content.replace(resolveStr, resolveStrReplacement);

fs.writeFileSync(file, content);
