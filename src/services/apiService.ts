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
    throw new Error(`API error: ${response.statusText}`);
  }
  return response.json();
}

export const ApiService = {
  // Users
  getCurrentUser: () => fetchWithAuth('/api/users/me'),
  updateProfile: (data: any) => fetchWithAuth('/api/users/me', { method: 'PUT', body: JSON.stringify(data) }),
  
  // Cases
  getCases: () => fetchWithAuth('/api/cases'),
  getCase: (id: string) => fetchWithAuth(`/api/cases/${id}`),

  // Discussions
  getDiscussions: (caseFileId?: string) => {
    const url = caseFileId ? `/api/discussions?caseFileId=${caseFileId}` : '/api/discussions';
    return fetchWithAuth(url);
  },
  createDiscussion: (data: any) => fetchWithAuth('/api/discussions', { method: 'POST', body: JSON.stringify(data) }),
  getReplies: (discussionId: string) => fetchWithAuth(`/api/discussions/${discussionId}/replies`),
  createReply: (discussionId: string, content: string) => fetchWithAuth(`/api/discussions/${discussionId}/replies`, { method: 'POST', body: JSON.stringify({ content }) }),
  voteDiscussion: (discussionId: string, value: number) => fetchWithAuth(`/api/discussions/${discussionId}/vote`, { method: 'POST', body: JSON.stringify({ value }) }),
};
