const fs = require('fs');
let content = fs.readFileSync('src/db/schema.ts', 'utf8');

// The pattern to remove is `}, (t) => [\n  index(...),\n  ...\n]);`
// We can just replace all of them with `});` since we're reverting
content = content.replace(/}, \(t\) => \[\s+index.*?\n\]\);/gs, '});');

fs.writeFileSync('src/db/schema.ts', content);
