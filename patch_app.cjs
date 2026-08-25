const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');
content = content.replace(
  /ApiService\.getCases\(\)\.then\(\(loadedCases\) => \{([\s\S]*?)\}\);/g,
  `ApiService.getCases().then((loadedCases) => {$1}).catch(console.error);`
);
fs.writeFileSync('src/App.tsx', content);
