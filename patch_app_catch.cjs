const fs = require('fs');
const file = 'src/App.tsx';
let content = fs.readFileSync(file, 'utf8');

const newTryCatch = `
        try {
          const data = await ApiService.getCurrentUser();
          if (data && data.deletedAt) {
            setIsSuspended(true);
          } else {
            setIsSuspended(false);
          }
        } catch (err: any) {
          if (err.message && err.message.includes('403')) {
            setIsSuspended(true);
          } else {
            setIsSuspended(false);
          }
        }
`;

content = content.replace(
  /try \{\n          const res = await ApiService\.getCurrentUser\(\);\n          const data = await res\.json\(\);\n          if \(res\.status === 403 && data\.error\?\.includes\('suspended'\)\) \{\n            setIsSuspended\(true\);\n          \} else if \(res\.ok && data\.deletedAt\) \{\n            setIsSuspended\(true\);\n          \} else \{\n            setIsSuspended\(false\);\n          \}\n        \} catch \(err\) \{\n          \/\/ Fallback if needed\n        \}/,
  newTryCatch
);

fs.writeFileSync(file, content);
