const fs = require('fs');
const file = 'src/components/ModerationDashboardView.tsx';
let content = fs.readFileSync(file, 'utf8');

// Replace handleAction('EVIDENCE', item.targetId, 'VERIFIED')
content = content.replace(
  "handleAction('EVIDENCE', item.targetId, 'VERIFIED')",
  "handleAction('EVIDENCE', item.targetId, 'APPROVE')"
);

// Replace handleAction('EVIDENCE', item.targetId, 'REJECTED')
content = content.replace(
  "handleAction('EVIDENCE', item.targetId, 'REJECTED')",
  "handleAction('EVIDENCE', item.targetId, 'REJECT')"
);

fs.writeFileSync(file, content);
