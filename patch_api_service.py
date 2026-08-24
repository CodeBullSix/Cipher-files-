import re

with open('src/services/apiService.ts', 'r') as f:
    content = f.read()

investigation_methods = """
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
"""

content = content.replace("export const ApiService = {", "export const ApiService = {" + investigation_methods)

with open('src/services/apiService.ts', 'w') as f:
    f.write(content)
