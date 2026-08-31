const fs = require('fs');
const file = 'src/components/ModerationDashboardView.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace("import { X, ApiService }", "import { ApiService }");
content = content.replace("import { X, sound }", "import { sound }");

fs.writeFileSync(file, content);
