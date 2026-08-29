import fs from 'fs';
let content = fs.readFileSync('src/services/apiService.ts', 'utf8');

if (!content.includes('getWorkspaces:')) {
  content = content.replace(
    /export const ApiService = \{/,
    `export const ApiService = {
  // WORKSPACES
  getWorkspaces: () => fetchWithAuth('/api/workspaces'),
  getWorkspace: (id: string) => fetchWithAuth(\`/api/workspaces/\${id}\`),
  createWorkspace: (data: any) => fetchWithAuth('/api/workspaces', { method: 'POST', body: JSON.stringify(data) }),
  updateWorkspace: (id: string, data: any) => fetchWithAuth(\`/api/workspaces/\${id}\`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteWorkspace: (id: string) => fetchWithAuth(\`/api/workspaces/\${id}\`, { method: 'DELETE' }),
  updateWorkspaceNote: (wsId: string, noteId: string, content: string) => fetchWithAuth(\`/api/workspaces/\${wsId}/notes/\${noteId}\`, { method: 'PUT', body: JSON.stringify({ content }) }),
  addWorkspaceReference: (wsId: string, data: { entityType: string, entityId: string }) => fetchWithAuth(\`/api/workspaces/\${wsId}/references\`, { method: 'POST', body: JSON.stringify(data) }),
  removeWorkspaceReference: (wsId: string, refId: string) => fetchWithAuth(\`/api/workspaces/\${wsId}/references/\${refId}\`, { method: 'DELETE' }),
  addWorkspaceConnection: (wsId: string, data: { sourceRefId: string, targetRefId: string, label: string, notes?: string }) => fetchWithAuth(\`/api/workspaces/\${wsId}/connections\`, { method: 'POST', body: JSON.stringify(data) }),
  updateWorkspaceConnection: (wsId: string, connId: string, data: { label: string, notes: string }) => fetchWithAuth(\`/api/workspaces/\${wsId}/connections/\${connId}\`, { method: 'PUT', body: JSON.stringify(data) }),
  removeWorkspaceConnection: (wsId: string, connId: string) => fetchWithAuth(\`/api/workspaces/\${wsId}/connections/\${connId}\`, { method: 'DELETE' }),
`
  );
  fs.writeFileSync('src/services/apiService.ts', content);
}
