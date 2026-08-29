const fs = require('fs');
const file = 'src/components/DiscussionsView.tsx';
let content = fs.readFileSync(file, 'utf8');

// Fix getDiscussionReplies -> getReplies
content = content.replace(/ApiService\.getDiscussionReplies/g, 'ApiService.getReplies');

// Fix Trash2 import
if (!content.includes('Trash2,')) {
  content = content.replace(
    /import \{\s*([^}]*?)\s*\}\s*from\s*'lucide-react';/s,
    (match, p1) => `import { ${p1}, Trash2 } from 'lucide-react';`
  );
}

fs.writeFileSync(file, content);
