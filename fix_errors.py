import re

with open('server.ts', 'r') as f:
    content = f.read()
if "import { relationshipsRoutes }" not in content:
    content = content.replace("import { investigationRoutes } from './src/routes/investigation.js';",
        "import { investigationRoutes } from './src/routes/investigation.js';\nimport { relationshipsRoutes } from './src/routes/relationships.js';")
with open('server.ts', 'w') as f:
    f.write(content)

with open('src/services/apiService.ts', 'r') as f:
    content = f.read()

new_methods = """
  // Relationships
  getRelationshipsForEntity: (type: string, id: string) => fetchWithAuth(`/api/relationships/entity/${type}/${id}`),
  createRelationship: (data: any) => fetchWithAuth('/api/relationships', { method: 'POST', body: JSON.stringify(data) }),
  updateRelationship: (id: string, data: any) => fetchWithAuth(`/api/relationships/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteRelationship: (id: string) => fetchWithAuth(`/api/relationships/${id}`, { method: 'DELETE' }),
"""

if "getRelationshipsForEntity:" not in content:
    content = re.sub(r'restoreDiscussion.*?\},?\s*\n', r'restoreDiscussion: (discussionId: string) => fetchWithAuth(`/api/discussions/${discussionId}/restore`, { method: \'POST\' }),' + '\n' + new_methods, content)
    with open('src/services/apiService.ts', 'w') as f:
        f.write(content)


with open('src/components/RelationshipModal.tsx', 'r') as f:
    content = f.read()
content = content.replace("sound.error();", "sound.blip();")
with open('src/components/RelationshipModal.tsx', 'w') as f:
    f.write(content)

