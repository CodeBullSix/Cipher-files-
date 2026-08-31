const fs = require('fs');
let content = fs.readFileSync('src/components/QuickSearchModal.tsx', 'utf8');

content = content.replace(
  `placeholder="GLOBAL DATABASE SEARCH`,
  `aria-label="Global Database Search"\n            placeholder="GLOBAL DATABASE SEARCH`
);

fs.writeFileSync('src/components/QuickSearchModal.tsx', content);
