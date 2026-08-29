const fs = require('fs');
const file = 'src/services/apiService.ts';
let content = fs.readFileSync(file, 'utf8');

const newMethods = `  getNotifications: (limit?: number) => {
    return fetchWithAuth(\`/api/notifications\${limit ? '?limit=' + limit : ''}\`);
  },
  getUnreadNotificationCount: () => {
    return fetchWithAuth('/api/notifications/unread-count');
  },
  markNotificationRead: (id: string) => {
    return fetchWithAuth(\`/api/notifications/\${id}/read\`, { method: 'PUT' });
  },
  markAllNotificationsRead: () => {
    return fetchWithAuth('/api/notifications/read-all', { method: 'PUT' });
  },
`;

if (!content.includes('getNotifications:')) {
  content = content.replace("getUserContributions:", newMethods + "  getUserContributions:");
  fs.writeFileSync(file, content);
}
