const fs = require('fs');
const file = 'src/routes/moderation.ts';
let content = fs.readFileSync(file, 'utf8');

content = content.replace("finalStatus = updates.deletedAt ? 'DELETED' : 'ACTIVE';\\n    \\n    else if", "finalStatus = updates.deletedAt ? 'DELETED' : 'ACTIVE';\\n    }\\n    else if");

// Also change let updates = {}; to let updates: any = {};
content = content.replace("let updates = {};", "let updates: any = {};");

// also fix require to import since it's ES module probably or typescript
content = content.replace("const { users } = require('../db/schema.js');", "");
// instead import at top

if (!content.includes('import { evidenceItems, discussions, discussionReplies, moderationLogs, users } from')) {
  content = content.replace("import { evidenceItems, discussions, discussionReplies, moderationLogs } from '../db/schema.js';", "import { evidenceItems, discussions, discussionReplies, moderationLogs, users } from '../db/schema.js';");
}


fs.writeFileSync(file, content);
