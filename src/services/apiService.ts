import { auth } from './firebase.js';

async function fetchWithAuth(url: string, options: RequestInit = {}) {
  let headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (auth.authStateReady) {
    await auth.authStateReady();
  }

  if (auth.currentUser) {
    const token = await auth.currentUser.getIdToken();
    headers = { ...headers, Authorization: `Bearer ${token}` };
  }

  const response = await fetch(url, { ...options, headers });
  if (!response.ok) {
    if (response.status === 401) {
      throw new Error("AUTHENTICATION REQUIRED");
    }
    throw new Error(`API error: ${response.statusText} (${response.status}) on ${url}`);
  }
  return response.json();
}

export const ApiService = {
  // WORKSPACES
  getWorkspaces: () => fetchWithAuth('/api/workspaces'),
  getWorkspace: (id: string) => fetchWithAuth(`/api/workspaces/${id}`),
  createWorkspace: (data: any) => fetchWithAuth('/api/workspaces', { method: 'POST', body: JSON.stringify(data) }),
  updateWorkspace: (id: string, data: any) => fetchWithAuth(`/api/workspaces/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteWorkspace: (id: string) => fetchWithAuth(`/api/workspaces/${id}`, { method: 'DELETE' }),
  updateWorkspaceNote: (wsId: string, noteId: string, content: string) => fetchWithAuth(`/api/workspaces/${wsId}/notes/${noteId}`, { method: 'PUT', body: JSON.stringify({ content }) }),
  addWorkspaceReference: (wsId: string, data: { entityType: string, entityId: string }) => fetchWithAuth(`/api/workspaces/${wsId}/references`, { method: 'POST', body: JSON.stringify(data) }),
  removeWorkspaceReference: (wsId: string, refId: string) => fetchWithAuth(`/api/workspaces/${wsId}/references/${refId}`, { method: 'DELETE' }),
  addWorkspaceConnection: (wsId: string, data: { sourceRefId: string, targetRefId: string, label: string, notes?: string }) => fetchWithAuth(`/api/workspaces/${wsId}/connections`, { method: 'POST', body: JSON.stringify(data) }),
  updateWorkspaceConnection: (wsId: string, connId: string, data: { label: string, notes: string }) => fetchWithAuth(`/api/workspaces/${wsId}/connections/${connId}`, { method: 'PUT', body: JSON.stringify(data) }),
  removeWorkspaceConnection: (wsId: string, connId: string) => fetchWithAuth(`/api/workspaces/${wsId}/connections/${connId}`, { method: 'DELETE' }),

  // Global Search
  search: (query: string, types?: string[]) => {
    let url = `/api/search?q=${encodeURIComponent(query)}`;
    if (types && types.length > 0) {
      url += `&types=${types.join(',')}`;
    }
    return fetchWithAuth(url);
  },
  // Investigation Entities
  getPeople: (query?: string, caseFileId?: string) => {
    const params = new URLSearchParams();
    if (query) params.append('query', query);
    if (caseFileId) params.append('caseFileId', caseFileId);
    return fetchWithAuth(`/api/investigation/people?${params.toString()}`);
  },
  getPersonById: (id: string) => fetchWithAuth(`/api/investigation/people/${id}`),
  createPerson: (data: any) => fetchWithAuth('/api/investigation/people', { method: 'POST', body: JSON.stringify(data) }),
  updatePerson: (id: string, data: any) => fetchWithAuth(`/api/investigation/people/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  getOrganisations: (query?: string, caseFileId?: string) => {
    const params = new URLSearchParams();
    if (query) params.append('query', query);
    if (caseFileId) params.append('caseFileId', caseFileId);
    return fetchWithAuth(`/api/investigation/organisations?${params.toString()}`);
  },
  getOrganisationById: (id: string) => fetchWithAuth(`/api/investigation/organisations/${id}`),
  createOrganisation: (data: any) => fetchWithAuth('/api/investigation/organisations', { method: 'POST', body: JSON.stringify(data) }),
  updateOrganisation: (id: string, data: any) => fetchWithAuth(`/api/investigation/organisations/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  getLocations: (query?: string, caseFileId?: string) => {
    const params = new URLSearchParams();
    if (query) params.append('query', query);
    if (caseFileId) params.append('caseFileId', caseFileId);
    return fetchWithAuth(`/api/investigation/locations?${params.toString()}`);
  },
  getLocationById: (id: string) => fetchWithAuth(`/api/investigation/locations/${id}`),
  createLocation: (data: any) => fetchWithAuth('/api/investigation/locations', { method: 'POST', body: JSON.stringify(data) }),
  updateLocation: (id: string, data: any) => fetchWithAuth(`/api/investigation/locations/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  // Evidence Archive (Phase 2)
getEvidence: (params: { caseFileId?: string, query?: string, status?: string, page?: number, limit?: number } = {}) => {
    const queryStr = new URLSearchParams(params as any).toString();
    return fetchWithAuth(`/api/evidence?${queryStr}`);
  },
  getEvidenceById: (id: string) => fetchWithAuth(`/api/evidence/${id}`),
  submitEvidence: (data: any) => fetchWithAuth('/api/evidence', { method: 'POST', body: JSON.stringify(data) }),
  verifyEvidence: (id: string, status: string, notes: string) => fetchWithAuth(`/api/evidence/${id}/verify`, { method: 'POST', body: JSON.stringify({ status, notes }) }),
  getSources: () => fetchWithAuth('/api/evidence/sources'),
  getSourceById: (id: string) => fetchWithAuth(`/api/evidence/sources/${id}`),
  createSource: (data: any) => fetchWithAuth('/api/evidence/sources', { method: 'POST', body: JSON.stringify(data) }),
  uploadDocument: async (file: File) => {
    
    const token = await auth.currentUser?.getIdToken();
    const formData = new FormData();
    formData.append('file', file);
    
    const res = await fetch('/api/evidence/upload', {
      method: 'POST',
      headers: token ? { 'Authorization': `Bearer ${token}` } : {},
      body: formData
    });
    if (!res.ok) {
      const error = await res.json().catch(() => ({ error: 'Request failed' }));
      throw new Error(error.error || 'Failed to upload document');
    }
    return res.json();
  },

  downloadDocument: async (storageKey: string, fileName: string, fileType: string) => {
    const token = await auth.currentUser?.getIdToken();
    const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
    const res = await fetch(`/api/evidence/documents/${storageKey}`, { headers });
    if (!res.ok) {
      throw new Error(`Failed to download document: ${res.status}`);
    }
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  },
  // Users
  getCurrentUser: () => fetchWithAuth('/api/users/me'),
    followUser: (id: string) => fetchWithAuth(`/api/users/${id}/follow`, { method: 'POST' }),
  unfollowUser: (id: string) => fetchWithAuth(`/api/users/${id}/follow`, { method: 'DELETE' }),
  getFollowing: (id: string) => fetchWithAuth(`/api/users/${id}/following`),
  getFollowers: (id: string) => fetchWithAuth(`/api/users/${id}/followers`),
  getFollowStatus: (id: string) => fetchWithAuth(`/api/users/${id}/follow-status`),
  getFollowCounts: (id: string) => fetchWithAuth(`/api/users/${id}/follow-counts`),
  getUsers: () => fetchWithAuth('/api/users'),
      getNotifications: (limit?: number) => {
    return fetchWithAuth(`/api/notifications${limit ? '?limit=' + limit : ''}`);
  },
  getUnreadNotificationCount: () => {
    return fetchWithAuth('/api/notifications/unread-count');
  },
  markNotificationRead: (id: string) => {
    return fetchWithAuth(`/api/notifications/${id}/read`, { method: 'PUT' });
  },
  markAllNotificationsRead: () => {
    return fetchWithAuth('/api/notifications/read-all', { method: 'PUT' });
  },
  getUserContributions: (id: string, filter?: string, limit?: number) => {
    const params = new URLSearchParams();
    if (filter) params.append('filter', filter);
    if (limit) params.append('limit', limit.toString());
    return fetchWithAuth(`/api/users/${id}/contributions?${params.toString()}`);
  },
  getUserReputation: (id: string) => fetchWithAuth(`/api/users/${id}/reputation`),
  rewardManualReputation: (amount: number, reason: string) => fetchWithAuth('/api/users/me/reputation/reward', { method: 'POST', body: JSON.stringify({ amount, reason }) }),

  updateProfile: (data: any) => fetchWithAuth('/api/users/me', { method: 'PUT', body: JSON.stringify(data) }),
  setUserRole: (userId: string, role: string) => fetchWithAuth('/api/users/' + userId + '/role', { method: 'PUT', body: JSON.stringify({ role }) }),
  
  // Cases
  getCases: () => fetchWithAuth('/api/cases'),
  getCase: (id: string) => fetchWithAuth(`/api/cases/${id}`),

  // Discussions

  getDiscussionEvidence: (discussionId: string) => fetchWithAuth(`/api/discussions/${discussionId}/evidence`),
  getDiscussions: (caseFileId?: string) => {
    const url = caseFileId ? `/api/discussions?caseFileId=${caseFileId}` : '/api/discussions';
    return fetchWithAuth(url);
  },
  createDiscussion: (data: any) => fetchWithAuth('/api/discussions', { method: 'POST', body: JSON.stringify(data) }),
  getReplies: (discussionId: string) => fetchWithAuth(`/api/discussions/${discussionId}/replies`),
  createReply: (discussionId: string, content: string) => fetchWithAuth(`/api/discussions/${discussionId}/replies`, { method: 'POST', body: JSON.stringify({ content }) }),
  voteDiscussion: (discussionId: string, value: number) => fetchWithAuth(`/api/discussions/${discussionId}/vote`, { method: 'POST', body: JSON.stringify({ value }) }),

  // Moderation
  lockDiscussion: (discussionId: string) => fetchWithAuth(`/api/discussions/${discussionId}/lock`, { method: 'POST' }),
  unlockDiscussion: (discussionId: string) => fetchWithAuth(`/api/discussions/${discussionId}/unlock`, { method: 'POST' }),
  deleteDiscussion: (discussionId: string) => fetchWithAuth(`/api/discussions/${discussionId}`, { method: 'DELETE' }),
  moderateContent: (targetType: string, targetId: string, action: string, reason?: string) => fetchWithAuth('/api/moderation/action', { method: 'POST', body: JSON.stringify({ targetType, targetId, action, reason }) }),
  restoreDiscussion: (discussionId: string) => fetchWithAuth(`/api/discussions/${discussionId}/restore`, { method: 'POST' }),

  // Relationships
  getRelationshipsForEntity: (type: string, id: string) => fetchWithAuth(`/api/relationships/entity/${type}/${id}`),
  createRelationship: (data: any) => fetchWithAuth('/api/relationships', { method: 'POST', body: JSON.stringify(data) }),
  updateRelationship: (id: string, data: any) => fetchWithAuth(`/api/relationships/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteRelationship: (id: string) => fetchWithAuth(`/api/relationships/${id}`, { method: 'DELETE' }),

  // EVIDENCE ASSOCIATIONS
  getEvidenceForEntity: (entityType: string, entityId: string) => fetchWithAuth(`/api/investigation/${entityType}/${entityId}/evidence`),
  attachEvidenceToEntity: (entityType: string, entityId: string, evidenceId: string) => fetchWithAuth(`/api/investigation/${entityType}/${entityId}/evidence`, { method: 'POST', body: JSON.stringify({ evidenceId }) }),
  removeEvidenceFromEntity: (entityType: string, entityId: string, evidenceId: string) => fetchWithAuth(`/api/investigation/${entityType}/${entityId}/evidence/${evidenceId}`, { method: 'DELETE' }),

  getEvidenceForRelationship: (relationshipId: string) => fetchWithAuth(`/api/relationships/${relationshipId}/evidence`),
  attachEvidenceToRelationship: (relationshipId: string, evidenceId: string) => fetchWithAuth(`/api/relationships/${relationshipId}/evidence`, { method: 'POST', body: JSON.stringify({ evidenceId }) }),
  removeEvidenceFromRelationship: (relationshipId: string, evidenceId: string) => fetchWithAuth(`/api/relationships/${relationshipId}/evidence/${evidenceId}`, { method: 'DELETE' }),


  // GRAPH
  getInitialGraphNodes: () => fetchWithAuth('/api/graph/initial'),
  getGraphForCase: (caseId: string) => fetchWithAuth(`/api/graph/case/${caseId}`),
  expandGraphNode: (nodeId: string) => fetchWithAuth(`/api/graph/expand/${nodeId}`)
};