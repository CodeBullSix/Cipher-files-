import fs from 'fs';
const path = 'src/components/CaseDetailModal.tsx';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(
  /const updated = await ApiService\.patch\(\`\/api\/cases\/\$\{currentCase\.id\}\/feature\`\, \{/,
  `// Call custom fetch since ApiService doesn't have patch
      const response = await fetch(\`/api/cases/\${currentCase.id}/feature\`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': \`Bearer \${await import('../services/authService').then(m => m.AuthService.getCurrentToken())}\`
        },
        body: JSON.stringify({`
);

content = content.replace(
  /        featured: \!currentCase\.featured\n      \}\);/,
  `        featured: !currentCase.featured\n      })});\n      if (!response.ok) throw new Error('Failed to feature');\n      const updated = await response.json();`
);

content = content.replace(/sound\.error\(\);/g, 'sound.deny();');

fs.writeFileSync(path, content);
console.log("Fixed API call");
