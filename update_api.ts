import fs from 'fs';

const apiPath = 'src/services/apiService.ts';
let apiStr = fs.readFileSync(apiPath, 'utf8');

if (!apiStr.includes('createSubmission(')) {
  const submissionApi = `
  // Community Submissions
  async createSubmission(payload: { title: string, summary?: string, type: 'CASE' | 'EVIDENCE' | 'ENTITY' | 'RELATIONSHIP' | 'EVENT' | 'OTHER', content: any }) {
    const res = await fetch(\`\${API_BASE_URL}/submissions\`, {
      method: 'POST',
      headers: await getHeaders(),
      body: JSON.stringify(payload),
    });
    return handleResponse(res);
  },
  async getModerationSubmissions() {
    const res = await fetch(\`\${API_BASE_URL}/submissions\`, { headers: await getHeaders() });
    return handleResponse(res);
  },
  async updateSubmissionStatus(id: string, status: 'PENDING_REVIEW' | 'IN_REVIEW' | 'RETURNED' | 'APPROVED' | 'REJECTED', reviewNotes?: string) {
    const res = await fetch(\`\${API_BASE_URL}/submissions/\${id}/status\`, {
      method: 'PATCH',
      headers: await getHeaders(),
      body: JSON.stringify({ status, reviewNotes }),
    });
    return handleResponse(res);
  },
`;
  apiStr = apiStr.replace('export const ApiService = {', 'export const ApiService = {' + submissionApi);
  fs.writeFileSync(apiPath, apiStr);
  console.log("Updated apiService.ts with submission endpoints.");
} else {
  console.log("apiService.ts already updated.");
}
