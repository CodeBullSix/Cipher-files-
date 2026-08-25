import fs from 'fs';
let content = fs.readFileSync('src/services/apiService.ts', 'utf8');

const correctTop = `import { auth } from './firebase.js';

async function fetchWithAuth(url: string, options: RequestInit = {}) {
  let headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (auth.currentUser) {
    const token = await auth.currentUser.getIdToken();
    headers = { ...headers, Authorization: \`Bearer \${token}\` };
  }

  const response = await fetch(url, { ...options, headers });
  if (!response.ok) {
    throw new Error(\`API error: \${response.statusText} (\${response.status}) on \${url}\`);
  }
  return response.json();
}

export const ApiService = {`;

content = content.replace(/import \{ auth \}.*?export const ApiService = \{/s, correctTop);

const newBottom = `
  // GRAPH
  getInitialGraphNodes: () => fetchWithAuth('/api/graph/initial'),
  getGraphForCase: (caseId: string) => fetchWithAuth(\`/api/graph/case/\${caseId}\`),
  expandGraphNode: (nodeId: string) => fetchWithAuth(\`/api/graph/expand/\${nodeId}\`)
};`;

content = content.replace(/\};\s*$/, newBottom);

fs.writeFileSync('src/services/apiService.ts', content);
