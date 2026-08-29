const fs = require('fs');
const file = 'src/App.tsx';
let content = fs.readFileSync(file, 'utf8');

// We need to import calculateLevel
if (!content.includes("import { calculateLevel }")) {
  content = content.replace("import { sound } from './utils/audio';", "import { sound } from './utils/audio';\nimport { calculateLevel } from './lib/levels';");
}

const oldReputationEarned = `const handleReputationEarned = (amount: number, reason: string, persist: boolean = false) => {
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
    }
    showToast(\`+\${amount} REP: \${reason}\`);
    if (currentUser) {
      import('./services/apiService').then(({ ApiService }) => {
        ApiService.getUserReputation(currentUser.uid).then((data: any) => {
          if (typeof data.totalReputation === 'number') {
            setCurrentUser(prev => prev ? { ...prev, reputation: data.totalReputation } : prev);
          }
        }).catch(console.error);
      });
    }
  };`;

const newReputationEarned = `const handleReputationEarned = (amount: number, reason: string, persist: boolean = false) => {
    const updateProfileAndCheckLevel = (newTotal: number) => {
      setCurrentUser(prev => {
        if (!prev) return prev;
        const oldLevel = calculateLevel(prev.reputation || 0).level;
        const newLevelInfo = calculateLevel(newTotal);
        if (newLevelInfo.level > oldLevel) {
          showToast(\`🎖️ PROMOTION! Security Clearance Elevated to \${newLevelInfo.title.toUpperCase()}\`);
          sound.blip();
        } else {
          showToast(\`+\${amount} REP: \${reason}\`);
        }
        return { ...prev, reputation: newTotal };
      });
    };

    if (persist && currentUser) {
      import('./services/apiService').then(({ ApiService }) => {
        ApiService.rewardManualReputation(amount, reason).then(() => {
          ApiService.getUserReputation(currentUser.uid).then((data: any) => {
            if (typeof data.totalReputation === 'number') {
              updateProfileAndCheckLevel(data.totalReputation);
            }
          });
        });
      });
      return;
    }
    
    if (currentUser) {
      import('./services/apiService').then(({ ApiService }) => {
        ApiService.getUserReputation(currentUser.uid).then((data: any) => {
          if (typeof data.totalReputation === 'number') {
            updateProfileAndCheckLevel(data.totalReputation);
          }
        }).catch(console.error);
      });
    }
  };`;

content = content.replace(oldReputationEarned, newReputationEarned);

fs.writeFileSync(file, content);
