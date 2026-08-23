with open('src/services/apiService.ts', 'r') as f:
    content = f.read()

content = content.replace("getCurrentUser: () => fetchWithAuth('/api/users/me'),", "getCurrentUser: () => fetchWithAuth('/api/users/me'),\n  getUsers: () => fetchWithAuth('/api/users'),")

with open('src/services/apiService.ts', 'w') as f:
    f.write(content)
