const fs = require('fs');
const file = 'src/services/storage.ts';
let content = fs.readFileSync(file, 'utf8');

// Replace addXp method body to do nothing, but keep signature so we don't break types just in case
content = content.replace(
  /public static addXp\(amount: number, reason: string\): { newXp: number, leveledUp: boolean, newRank\?: InvestigatorRank } \{[\s\S]*?    return { newXp: profile.xp, leveledUp, newRank: profile.rank };\n  \}/,
  `public static addXp(amount: number, reason: string): { newXp: number, leveledUp: boolean, newRank?: InvestigatorRank } {
    return { newXp: 0, leveledUp: false };
  }`
);

fs.writeFileSync(file, content);
