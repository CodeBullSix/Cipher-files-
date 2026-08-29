const fs = require('fs');
let content = fs.readFileSync('src/components/RabbitHoleGraph.tsx', 'utf8');

// 1. Change useState to const
content = content.replace(
  /const \[filterType, setFilterType\] = useState\('ALL'\);/g,
  `const filterType = 'ALL';`
);

// 2. Remove setFilterType from handleReset
content = content.replace(
  /    setFilterType\('ALL'\);\n/g,
  ''
);

// 3. Remove the <select> block
content = content.replace(
  /        <select [\s\S]*?<\/select>\n/g,
  ''
);

// 4. Remove the NO MATCHING NODES block
content = content.replace(
  /      \{\!loading && \!error && filterType !== 'ALL'[\s\S]*?<\/div>\n        <\/div>\n      \)\}\n/g,
  ''
);

fs.writeFileSync('src/components/RabbitHoleGraph.tsx', content);
