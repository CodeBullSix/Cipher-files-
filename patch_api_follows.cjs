const fs = require('fs');
const file = 'src/services/apiService.ts';
let content = fs.readFileSync(file, 'utf8');

const newMethods = `  followUser: (id: string) => fetchWithAuth(\`/api/users/\${id}/follow\`, { method: 'POST' }),
  unfollowUser: (id: string) => fetchWithAuth(\`/api/users/\${id}/follow\`, { method: 'DELETE' }),
  getFollowing: (id: string) => fetchWithAuth(\`/api/users/\${id}/following\`),
  getFollowers: (id: string) => fetchWithAuth(\`/api/users/\${id}/followers\`),
  getFollowStatus: (id: string) => fetchWithAuth(\`/api/users/\${id}/follow-status\`),
  getFollowCounts: (id: string) => fetchWithAuth(\`/api/users/\${id}/follow-counts\`),
`;

if (!content.includes('followUser:')) {
  content = content.replace("getUsers:", newMethods + "  getUsers:");
  fs.writeFileSync(file, content);
}
