const fs = require('fs');
const file = 'src/App.tsx';
const content = fs.readFileSync(file, 'utf8');

const lines = content.split('\n');
const newLines = [];
let prev = '';
for (let i = 0; i < lines.length; i++) {
  const line = lines[i].trim();
  if (line === 'onOpenEntity={handleOpenEntity}') {
    if (prev === line) {
       // duplicate, skip
       continue;
    }
  }
  newLines.push(lines[i]);
  if (line === 'onOpenEntity={handleOpenEntity}') {
    prev = line;
  } else if (line !== '') {
    prev = '';
  }
}

fs.writeFileSync(file, newLines.join('\n'));
