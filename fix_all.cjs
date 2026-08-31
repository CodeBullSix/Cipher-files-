const fs = require('fs');

// Fix EvidenceDetailModal.tsx
let file = 'src/components/EvidenceDetailModal.tsx';
let content = fs.readFileSync(file, 'utf8');
if (!content.includes('import { ReportModal }')) {
  content = content.replace("import { EvidenceItem } from '../types';", "import { EvidenceItem } from '../types';\nimport { ReportModal } from './ReportModal';");
}
fs.writeFileSync(file, content);

// Fix ModerationDashboardView.tsx duplicated X
file = 'src/components/ModerationDashboardView.tsx';
content = fs.readFileSync(file, 'utf8');
content = content.replace("import { X,   ShieldAlert,", "import { ShieldAlert,");
content = content.replace("import { X, ApiService } from '../services/apiService';", "import { ApiService } from '../services/apiService';");
content = content.replace("import { X, sound } from '../utils/audio';", "import { sound } from '../utils/audio';");
fs.writeFileSync(file, content);

