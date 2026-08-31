import fs from 'fs';

const apiPath = 'src/services/apiService.ts';
let apiStr = fs.readFileSync(apiPath, 'utf8');

apiStr = apiStr.replace(/async updateSubmissionStatus\(id: string, status: 'PENDING_REVIEW' \| 'IN_REVIEW' \| 'RETURNED' \| 'APPROVED' \| 'REJECTED', reviewNotes\?: string\) \{[\s\S]*?body: JSON.stringify\(\{ status, reviewNotes \}\),\n    \}\);/g, `
  async updateSubmissionStatus(id: string, status: 'PENDING_REVIEW' | 'IN_REVIEW' | 'RETURNED' | 'APPROVED' | 'REJECTED', reviewNotes?: string, approvedComponents?: Record<string, boolean>) {
    return fetchWithAuth(\`/api/submissions/\${id}/status\`, {
      method: 'PATCH',
      body: JSON.stringify({ status, reviewNotes, approvedComponents }),
    });`);

fs.writeFileSync(apiPath, apiStr);
console.log("Fixed apiService.ts to support approvedComponents");
