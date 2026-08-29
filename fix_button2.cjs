const fs = require('fs');
const file = 'src/components/InvestigatorProfileModal.tsx';
let content = fs.readFileSync(file, 'utf8');

// Replace any occurrence of multiple </button> in a row with a single one where we added it
content = content.replace(/<\/button>\s*<\/button>\s*<\/div>/g, "</button>\n            </div>");

fs.writeFileSync(file, content);
