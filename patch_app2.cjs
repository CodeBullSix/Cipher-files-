const fs = require('fs');
const file = 'src/App.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace("handleReputationEarned(25, `Fell down rabbit hole: ${chosen.title}`);", `import('./services/apiService').then(({ ApiService }) => {
      ApiService.rewardManualReputation(25, \`Fell down rabbit hole: \${chosen.title}\`).then(() => {
        handleReputationEarned(25, \`Fell down rabbit hole: \${chosen.title}\`);
      });
    });`);

fs.writeFileSync(file, content);
