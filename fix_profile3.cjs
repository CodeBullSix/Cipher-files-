const fs = require('fs');
const file = 'src/components/InvestigatorProfileModal.tsx';
let content = fs.readFileSync(file, 'utf8');

if (!content.includes('AlertTriangle')) {
  content = content.replace("  Check,\n  MapPin", "  Check,\n  MapPin,\n  AlertTriangle");
}

fs.writeFileSync(file, content);
