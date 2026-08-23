import { auth } from './firebase.js';

async function fetchWithAuth(url: string, options: RequestInit = {}) {
  let headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (auth.currentUser) {
    const token = await auth.currentUser.getIdToken();
    headers = { ...headers, Authorization: `Bearer ${token}` };
  }

  const response = await fetch(url, { ...options, headers });
  if (!response.ok) {
    throw new Error(`API error: ${response.statusText} (${response.status}) on ${url}`);
  }
  return response.json();
}

export const ApiService = {
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

  // Users
  getCurrentUser: () => fetchWithAuth('/api/users/me'),
  getUsers: () => fetchWithAuth('/api/users'),
  updateProfile: (data: any) => fetchWithAuth('/api/users/me', { method: 'PUT', body: JSON.stringify(data) }),
  
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
  restoreDiscussion: (discussionId: string) => fetchWithAuth(`/api/discussions/${discussionId}/restore`, { method: 'POST' }),
};

// I'll just append it to the end or patch it. Wait, ApiService is an object exported. Let's patch.
