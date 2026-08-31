const fs = require('fs');
const file = 'src/components/ModerationDashboardView.tsx';
let content = fs.readFileSync(file, 'utf8');

// I will just use sed to do the heavy lifting later, or rewrite the file.
