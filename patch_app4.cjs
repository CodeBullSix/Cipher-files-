const fs = require('fs');
const file = 'src/App.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  /const handleReputationEarned = \(amount: number, reason: string\) => \{/g,
  `const handleReputationEarned = (amount: number, reason: string, persist: boolean = false) => {
    if (persist && currentUser) {
      import('./services/apiService').then(({ ApiService }) => {
        ApiService.rewardManualReputation(amount, reason).then(() => {
          showToast(\`+\${amount} REP: \${reason}\`);
          ApiService.getUserReputation(currentUser.uid).then((data: any) => {
            if (typeof data.totalReputation === 'number') {
              setCurrentUser(prev => prev ? { ...prev, reputation: data.totalReputation } : prev);
            }
          });
        });
      });
      return;
    }`
);

// We should also revert the manual block we added for "Published formal case dossier"
content = content.replace(
  `import('./services/apiService').then(({ ApiService }) => {
              ApiService.rewardManualReputation(150, 'Published formal case dossier').then(() => {
                handleReputationEarned(150, 'Published formal case dossier');
                showToast('✅ Conspiracy theory published to live community archive');
              });
            });`,
  `handleReputationEarned(150, 'Published formal case dossier', true);
            showToast('✅ Conspiracy theory published to live community archive');`
);

content = content.replace(
  `import('./services/apiService').then(({ ApiService }) => {
      ApiService.rewardManualReputation(25, \`Fell down rabbit hole: \${chosen.title}\`).then(() => {
        handleReputationEarned(25, \`Fell down rabbit hole: \${chosen.title}\`);
      });
    });`,
  `handleReputationEarned(25, \`Fell down rabbit hole: \${chosen.title}\`, true);`
);

fs.writeFileSync(file, content);
