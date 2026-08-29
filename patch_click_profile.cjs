const fs = require('fs');
const file = 'src/components/InvestigatorProfileModal.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  /className="flex items-center gap-3 p-3 rounded-xl border border-gray-800 bg-\[#0A0E1A\]"/g,
  'className="flex items-center gap-3 p-3 rounded-xl border border-gray-800 bg-[#0A0E1A] hover:border-cyan-500/50 cursor-pointer transition-colors" onClick={() => onOpenEntity && onOpenEntity(\'profile\', f.uid)}'
);

fs.writeFileSync(file, content);
