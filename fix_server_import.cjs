const fs = require('fs');
const file = 'server.ts';
let content = fs.readFileSync(file, 'utf8');

if (!content.includes("import { getUserContributions }")) {
  content = content.replace("import { getUserReputationData, awardReputation }", "import { getUserReputationData, awardReputation } from './src/db/reputation.js';\nimport { getUserContributions }");
  // Oh wait, `import { getUserReputationData, awardReputation } from './src/db/reputation.js';` was already there.
  // The first patch did: content = content.replace("import { getUserReputationData, awardReputation } from './src/db/reputation.js';", ... )
}

fs.writeFileSync(file, content);
