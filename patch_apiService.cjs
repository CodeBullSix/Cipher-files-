const fs = require('fs');
const file = 'src/services/apiService.ts';
let content = fs.readFileSync(file, 'utf8');

if (!content.includes('moderateContent:')) {
  content = content.replace(
    /deleteDiscussion:.*?,/,
    "$&" + "\n  moderateContent: (targetType: string, targetId: string, action: string, reason?: string) => fetchWithAuth('/api/moderation/action', { method: 'POST', body: JSON.stringify({ targetType, targetId, action, reason }) }),"
  );
  fs.writeFileSync(file, content);
}
