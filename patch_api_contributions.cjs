const fs = require('fs');
const file = 'src/services/apiService.ts';
let content = fs.readFileSync(file, 'utf8');

const newMethod = `  getUserContributions: (id: string, filter?: string, limit?: number) => {
    const params = new URLSearchParams();
    if (filter) params.append('filter', filter);
    if (limit) params.append('limit', limit.toString());
    return fetchWithAuth(\`/api/users/\${id}/contributions?\${params.toString()}\`);
  },
`;

if (!content.includes('getUserContributions:')) {
  content = content.replace("getUserReputation:", newMethod + "  getUserReputation:");
  fs.writeFileSync(file, content);
}
