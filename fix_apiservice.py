import re

with open('src/services/apiService.ts', 'r') as f:
    content = f.read()

# Remove the junk inside the fetchWithAuth function
content = re.sub(r'  static async createRelationship.*?\}\n', '', content, flags=re.DOTALL)
content = re.sub(r'  static async updateRelationship.*?\}\n', '', content, flags=re.DOTALL)
content = re.sub(r'  static async deleteRelationship.*?\}\n', '', content, flags=re.DOTALL)

# Also remove from the end of ApiService object if it was added with "static async"
content = re.sub(r'  static async .*?\n', '', content)
content = re.sub(r'\}// I\'ll just append it to the end or patch it. Wait, ApiService is an object exported. Let\'s patch.', '}', content)


new_methods = """  // Relationships
  getRelationshipsForEntity: (type: string, id: string) => fetchWithAuth(`/api/relationships/entity/${type}/${id}`),
  createRelationship: (data: any) => fetchWithAuth('/api/relationships', { method: 'POST', body: JSON.stringify(data) }),
  updateRelationship: (id: string, data: any) => fetchWithAuth(`/api/relationships/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteRelationship: (id: string) => fetchWithAuth(`/api/relationships/${id}`, { method: 'DELETE' }),
"""

content = re.sub(r'\};?$', new_methods + '};', content.strip())

with open('src/services/apiService.ts', 'w') as f:
    f.write(content)
