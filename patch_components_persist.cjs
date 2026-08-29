const fs = require('fs');
const glob = require('glob'); // Note: we can just manually process the files since we know which ones

const files = [
  'src/components/CaseDetailModal.tsx',
  'src/components/ModerationQueueModal.tsx',
  'src/components/RabbitHoleGraph.tsx',
];

for (const file of files) {
  if (!fs.existsSync(file)) continue;
  let content = fs.readFileSync(file, 'utf8');
  
  // Replace instances of onReputationEarned(amount, 'reason') with onReputationEarned(amount, 'reason', true)
  // Be careful not to replace the prop declaration
  content = content.replace(/onReputationEarned\((\d+),\s*([^)]+)\)/g, (match, amount, reason) => {
    // Check if it already has 3 args
    if (reason.includes(',')) return match;
    return `onReputationEarned(${amount}, ${reason}, true)`;
  });
  
  // also change the prop interface:
  content = content.replace(
    /onReputationEarned: \(amount: number, reason: string\) => void;/,
    `onReputationEarned: (amount: number, reason: string, persist?: boolean) => void;`
  );
  
  fs.writeFileSync(file, content);
}
