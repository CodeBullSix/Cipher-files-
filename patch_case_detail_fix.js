import fs from 'fs';
let content = fs.readFileSync('src/components/CaseDetailModal.tsx', 'utf8');
content = content.replace("entityId={caseId}", "entityId={currentCase.id}");
fs.writeFileSync('src/components/CaseDetailModal.tsx', content);
