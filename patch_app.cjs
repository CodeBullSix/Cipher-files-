const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

content = content.replace(
  '<main className="flex-1 flex flex-col">',
  '<main className="flex-1 flex flex-col min-w-0 overflow-x-hidden w-full">'
);

fs.writeFileSync('src/App.tsx', content);
