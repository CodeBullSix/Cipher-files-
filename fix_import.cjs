const fs = require('fs');
const file = 'src/components/DiscussionsView.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace("import { EvidenceDetailModal }\nimport { ReportModal } from './ReportModal'; from './EvidenceDetailModal';", "import { EvidenceDetailModal } from './EvidenceDetailModal';\nimport { ReportModal } from './ReportModal';");
fs.writeFileSync(file, content);
