import fs from 'fs';

// CaseDetailModal
let content = fs.readFileSync('src/components/CaseDetailModal.tsx', 'utf8');
content = content.replace(
  '<TimelineView entityType="case_files" entityId={currentCase.id} />',
  '<TimelineView entityType="case_files" entityId={currentCase.id} currentUser={currentUser} />'
);
fs.writeFileSync('src/components/CaseDetailModal.tsx', content);

// EntityProfileModal
let entityContent = fs.readFileSync('src/components/EntityProfileModal.tsx', 'utf8');
// wait, EntityProfileModal might already pass currentUser? Wait, I didn't add it when I initially created TimelineView.
// let's check what it has.
entityContent = entityContent.replace(
  '<TimelineView entityType={type} entityId={entityId} />',
  '<TimelineView entityType={type} entityId={entityId} currentUser={currentUser} />'
);
fs.writeFileSync('src/components/EntityProfileModal.tsx', entityContent);

