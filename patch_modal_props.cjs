const fs = require('fs');
const file = 'src/components/InvestigatorProfileModal.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  "onOpenCase: (caseId: string) => void;",
  "onOpenCase: (caseId: string) => void;\n  onOpenEntity?: (type: 'person' | 'organisation' | 'location', id: string) => void;"
);

content = content.replace(
  "onOpenCase,",
  "onOpenCase,\n  onOpenEntity,"
);

// Fix the window.onOpenEntity hacks
content = content.replace(/if\(window.onOpenEntity\) window\.onOpenEntity\(/g, "if(onOpenEntity) onOpenEntity(");
content = content.replace(/if\(window.onOpenCase\) window\.onOpenCase\(/g, "if(onOpenCase) onOpenCase(");

fs.writeFileSync(file, content);
