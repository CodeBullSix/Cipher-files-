const fs = require('fs');
const file = 'src/components/ModerationDashboardView.tsx';
let content = fs.readFileSync(file, 'utf8');

// I'll rewrite the entire file since the queue structure changed radically
