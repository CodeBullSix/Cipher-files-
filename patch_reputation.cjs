const fs = require('fs');

// Patch App.tsx - remove the real backend call for manual rewards
let apiService = fs.readFileSync('src/services/apiService.ts', 'utf8');
apiService = apiService.replace(
  "rewardManualReputation: (amount: number, reason: string) => fetchWithAuth('/api/users/me/reputation/reward', { method: 'POST', body: JSON.stringify({ amount, reason }) }),",
  "rewardManualReputation: (amount: number, reason: string) => Promise.resolve({ success: true, amount, reason }), // Disabled for Phase 5.6 to prevent reputation abuse."
);
fs.writeFileSync('src/services/apiService.ts', apiService);

// Patch server.ts - remove the dangerous endpoint
let serverCode = fs.readFileSync('server.ts', 'utf8');
const rewardCodeStart = serverCode.indexOf("app.post('/api/users/me/reputation/reward'");
if (rewardCodeStart !== -1) {
  const rewardCodeEnd = serverCode.indexOf("});", rewardCodeStart) + 3;
  serverCode = serverCode.slice(0, rewardCodeStart) + serverCode.slice(rewardCodeEnd);
  fs.writeFileSync('server.ts', serverCode);
}
