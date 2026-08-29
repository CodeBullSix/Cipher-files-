const fs = require('fs');
let content = fs.readFileSync('src/components/CaseDetailModal.tsx', 'utf8');

if (!content.includes("import { DiscussionsView }")) {
  content = content.replace(
    "import { TimelineView } from './TimelineView';",
    "import { TimelineView } from './TimelineView';\nimport { DiscussionsView } from './DiscussionsView';"
  );
}

content = content.replace(
  "  onRandomRabbitHole?: () => void;\n}",
  "  onRandomRabbitHole?: () => void;\n  onOpenEntity?: (type: string, id: string) => void;\n  onOpenEvent?: (id: string) => void;\n  onOpenEvidence?: (id: string) => void;\n}"
);

content = content.replace(
  "  onRandomRabbitHole\n}) => {",
  "  onRandomRabbitHole,\n  onOpenEntity,\n  onOpenEvent,\n  onOpenEvidence\n}) => {"
);

content = content.replace(
  "<DiscussionBoard entityType=\"CASE\" entityId={currentCase.id} currentUser={currentUser} />",
  "<DiscussionsView entityType=\"CASE\" entityId={currentCase.id} />"
);

fs.writeFileSync('src/components/CaseDetailModal.tsx', content);
