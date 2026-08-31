const fs = require('fs');
let content = fs.readFileSync('src/components/AdminConsoleModal.tsx', 'utf8');

content = content.replace(
  'className="border border-gray-800 rounded-xl overflow-hidden bg-gray-950/60"',
  'className="border border-gray-800 rounded-xl overflow-x-auto bg-gray-950/60 scrollbar-hide"'
);
fs.writeFileSync('src/components/AdminConsoleModal.tsx', content);
