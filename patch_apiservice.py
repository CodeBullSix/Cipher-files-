import re

with open('src/services/apiService.ts', 'r') as f:
    content = f.read()

new_methods = """
  // Relationships
  static async getRelationshipsForEntity(type: string, id: string): Promise<any[]> {
    return this.fetchWithAuth(`/api/relationships/entity/${type}/${id}`);
  }

  static async createRelationship(data: any): Promise<any> {
    return this.fetchWithAuth('/api/relationships', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  static async updateRelationship(id: string, data: any): Promise<any> {
    return this.fetchWithAuth(`/api/relationships/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  static async deleteRelationship(id: string): Promise<void> {
    return this.fetchWithAuth(`/api/relationships/${id}`, {
      method: 'DELETE',
    });
  }
}"""

content = content.replace("\n}", new_methods)

with open('src/services/apiService.ts', 'w') as f:
    f.write(content)
