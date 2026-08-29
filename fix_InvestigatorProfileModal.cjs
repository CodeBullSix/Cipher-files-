const fs = require('fs');
const file = 'src/components/InvestigatorProfileModal.tsx';
let content = fs.readFileSync(file, 'utf8');

const regex = /<\/div>\s*<div className="flex items-center justify-between text-\[11px\] font-mono text-slate-400">\s*<span>CURRENT RANK: \{activeProfile\.rank \? activeProfile\.rank\.replace\('_', ' '\) : 'RESEARCHER'\}<\/span>\s*<span>CONTRIBUTIONS: \{activeProfile\.contributionsCount \|\| 0\} DOSSIERS VERIFIED<\/span>\s*<\/div>\s*<\/div>/;

content = content.replace(regex, '');

fs.writeFileSync(file, content);
