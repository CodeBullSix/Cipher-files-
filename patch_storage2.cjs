const fs = require('fs');
const file = 'src/services/storage.ts';
const content = fs.readFileSync(file, 'utf8');

const lines = content.split('\n');
let newLines = [];
let insideAddXp = false;

for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('public static addXp(amount: number, reason: string)')) {
    insideAddXp = true;
    newLines.push(lines[i]);
    newLines.push('    return { newXp: 0, leveledUp: false };');
    newLines.push('  }');
  } else if (insideAddXp) {
    if (lines[i].trim() === '}' && lines[i-1].includes('return { newXp: profile.xp')) {
      insideAddXp = false;
    }
  } else {
    newLines.push(lines[i]);
  }
}

fs.writeFileSync(file, newLines.join('\n'));
