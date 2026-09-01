import fs from 'fs';
const path = 'src/components/CaseDetailModal.tsx';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(
  /await import\(\'\.\.\/services\/authService\'\)\.then\(m => m\.AuthService\.getCurrentToken\(\)\)/,
  `await import('../services/firebase').then(m => m.auth.currentUser?.getIdToken())`
);

content = content.replace(/sound\.deny\(\)\;/g, '');

fs.writeFileSync(path, content);
console.log("Fixed API call 2");
