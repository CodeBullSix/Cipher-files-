const fs = require('fs');
const file = 'src/components/InvestigatorProfileModal.tsx';
let content = fs.readFileSync(file, 'utf8');

const regex = /<\/div>\s*\{\/\* 3-Column Info Matrix: Badges, Saved Binders, Investigative Trail \*\/\}/;

content = content.replace(regex, '</div>\n            </div>\n            {/* 3-Column Info Matrix: Badges, Saved Binders, Investigative Trail */}');

fs.writeFileSync(file, content);
