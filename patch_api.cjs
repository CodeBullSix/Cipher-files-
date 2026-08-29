const fs = require('fs');
const file = 'src/services/apiService.ts';
let content = fs.readFileSync(file, 'utf8');

const newMethod = `  rewardManualReputation: (amount: number, reason: string) => fetchWithAuth('/api/users/me/reputation/reward', { method: 'POST', body: JSON.stringify({ amount, reason }) }),\n`;

content = content.replace("getUserReputation: (id: string) => fetchWithAuth(`/api/users/${id}/reputation`),", "getUserReputation: (id: string) => fetchWithAuth(`/api/users/${id}/reputation`)," + "\n" + newMethod);

fs.writeFileSync(file, content);
