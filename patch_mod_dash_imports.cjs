const fs = require('fs');
const file = 'src/components/ModerationDashboardView.tsx';
let content = fs.readFileSync(file, 'utf8');

if (!content.includes('History,')) {
  content = content.replace("Eye", "Eye,\n  History,\n  ShieldCheck");
}

fs.writeFileSync(file, content);
