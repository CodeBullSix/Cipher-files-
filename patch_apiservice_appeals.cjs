const fs = require('fs');
const file = 'src/services/apiService.ts';
let content = fs.readFileSync(file, 'utf8');

if (!content.includes('submitAppeal')) {
  content = content.replace(
    "moderateContent: (targetType: string, targetId: string, action: string, reason?: string) => fetchWithAuth('/api/moderation/action', { method: 'POST', body: JSON.stringify({ targetType, targetId, action, reason }) }),",
    "moderateContent: (targetType: string, targetId: string, action: string, reason?: string) => fetchWithAuth('/api/moderation/action', { method: 'POST', body: JSON.stringify({ targetType, targetId, action, reason }) }),\n  \n  // Appeals\n  submitAppeal: (targetType: string, targetId: string, reason: string) => fetchWithAuth('/api/appeals', { method: 'POST', body: JSON.stringify({ targetType, targetId, reason }) }),\n  getMyAppeals: () => fetchWithAuth('/api/appeals/me'),\n  getAppealsQueue: () => fetchWithAuth('/api/appeals/queue'),\n  resolveAppeal: (appealId: string, status: string, resolutionReason?: string) => fetchWithAuth(`/api/appeals/${appealId}/status`, { method: 'PUT', body: JSON.stringify({ status, resolutionReason }) }),"
  );
  fs.writeFileSync(file, content);
}
