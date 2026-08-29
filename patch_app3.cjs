const fs = require('fs');
const file = 'src/App.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  `showToast('✅ Conspiracy theory published to live community archive (+150 REP)');`,
  `import('./services/apiService').then(({ ApiService }) => {
              ApiService.rewardManualReputation(150, 'Published formal case dossier').then(() => {
                handleReputationEarned(150, 'Published formal case dossier');
                showToast('✅ Conspiracy theory published to live community archive');
              });
            });`
);

fs.writeFileSync(file, content);
