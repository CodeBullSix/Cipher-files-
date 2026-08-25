import fs from 'fs';

// CaseDetailModal.tsx
let caseModal = fs.readFileSync('src/components/CaseDetailModal.tsx', 'utf8');
if (!caseModal.includes("import { TimelineView }")) {
  caseModal = caseModal.replace(
    "import { AICrossExaminer } from './AICrossExaminer';",
    "import { AICrossExaminer } from './AICrossExaminer';\nimport { TimelineView } from './TimelineView';"
  );
  fs.writeFileSync('src/components/CaseDetailModal.tsx', caseModal);
}

// AttachEvidenceModal.tsx
let attachModal = fs.readFileSync('src/components/AttachEvidenceModal.tsx', 'utf8');
attachModal = attachModal.replace(/sound\.success\(\)/g, "sound.click()");
attachModal = attachModal.replace(/sound\.error\(\)/g, "sound.click()");
fs.writeFileSync('src/components/AttachEvidenceModal.tsx', attachModal);

// EventModal.tsx
let eventModal = fs.readFileSync('src/components/EventModal.tsx', 'utf8');
eventModal = eventModal.replace(/sound\.success\(\)/g, "sound.click()");
eventModal = eventModal.replace(/sound\.error\(\)/g, "sound.click()");
eventModal = eventModal.replace(/`Bearer \$\{userToken\}`/g, "token ? `Bearer ${token}` : ''");
// wait, userToken is missing in one API call
eventModal = eventModal.replace(
  "const method = existingEvent ? 'PUT' : 'POST';",
  "const method = existingEvent ? 'PUT' : 'POST';\n      const token = await (await import('../services/firebase')).auth.currentUser?.getIdToken();"
);
eventModal = eventModal.replace(
  "headers: { 'Authorization': `Bearer ${userToken}` }",
  "headers: { 'Authorization': token ? `Bearer ${token}` : '' }"
);

fs.writeFileSync('src/components/EventModal.tsx', eventModal);

