const fs = require('fs');
const file = 'src/App.tsx';
let content = fs.readFileSync(file, 'utf8');

// regex to remove duplicate onOpenEntity={handleOpenEntity} inside JSX tags
// A bit risky, let's just do it string by string replacing back to back

content = content.replace(/onOpenEntity=\{handleOpenEntity\}\n\s*onOpenEntity=\{handleOpenEntity\}/g, "onOpenEntity={handleOpenEntity}");
content = content.replace(/onOpenEntity=\{handleOpenEntity\}\n\s*onReputationEarned=\{handleReputationEarned\}\n\s*onOpenEntity=\{handleOpenEntity\}/g, "onReputationEarned={handleReputationEarned}\n                onOpenEntity={handleOpenEntity}");
content = content.replace(/onOpenEntity=\{handleOpenEntity\}\n\s*onOpenCase=\{handleOpenCase\}\n\s*onOpenEntity=\{handleOpenEntity\}/g, "onOpenCase={handleOpenCase}\n              onOpenEntity={handleOpenEntity}");
content = content.replace(/onOpenEntity=\{handleOpenEntity\}\n\s*onOpenEvent=\{handleOpenEvent\}\n\s*onOpenEntity=\{handleOpenEntity\}/g, "onOpenEvent={handleOpenEvent}\n              onOpenEntity={handleOpenEntity}");

fs.writeFileSync(file, content);
