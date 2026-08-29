const fs = require('fs');
const file = 'src/services/apiService.ts';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  "  deleteDiscussion: (discussionId: string) => fetchWithAuth(`/api/discussions/${discussionId}`,\n  moderateContent: (targetType: string, targetId: string, action: string, reason?: string) => fetchWithAuth('/api/moderation/action', { method: 'POST', body: JSON.stringify({ targetType, targetId, action, reason }) }), { method: 'DELETE' }),",
  "  deleteDiscussion: (discussionId: string) => fetchWithAuth(`/api/discussions/${discussionId}`, { method: 'DELETE' }),\n  moderateContent: (targetType: string, targetId: string, action: string, reason?: string) => fetchWithAuth('/api/moderation/action', { method: 'POST', body: JSON.stringify({ targetType, targetId, action, reason }) }),"
);

fs.writeFileSync(file, content);
