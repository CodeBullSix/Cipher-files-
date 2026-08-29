const fs = require('fs');
const file = 'src/components/DiscussionsView.tsx';
let content = fs.readFileSync(file, 'utf8');

if (!content.includes('Trash2')) {
  content = content.replace(
    /import \{([^{}]*)\} from 'lucide-react';/,
    "import { $1, Trash2 } from 'lucide-react';"
  );
  fs.writeFileSync(file, content);
}
