import re

with open('src/services/apiService.ts', 'r') as f:
    content = f.read()

content = content.replace("updateProfile: (data: any) => fetchWithAuth('/api/users/me', { method: 'PUT', body: JSON.stringify(data) }),", "updateProfile: (data: any) => fetchWithAuth('/api/users/me', { method: 'PUT', body: JSON.stringify(data) }),\n  setUserRole: (userId: string, role: string) => fetchWithAuth('/api/users/' + userId + '/role', { method: 'PUT', body: JSON.stringify({ role }) }),")

with open('src/services/apiService.ts', 'w') as f:
    f.write(content)

with open('src/components/AdminConsoleModal.tsx', 'r') as f:
    content = f.read()

content = content.replace("await AuthService.setUserRole(targetUser.uid, targetUser.email, newRole);", "await ApiService.setUserRole(targetUser.uid, newRole);")

with open('src/components/AdminConsoleModal.tsx', 'w') as f:
    f.write(content)

with open('server.ts', 'r') as f:
    content = f.read()

new_api = """app.put('/api/users/:id/role', requireModerator, async (req: AuthRequest, res) => {
  try {
    const updated = await updateUser(req.params.id, { role: req.body.role.toUpperCase() });
    res.json(updated);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to update user role' });
  }
});
"""

# Append it below PUT /api/users/me
content = content.replace("app.put('/api/users/me'", new_api + "\napp.put('/api/users/me'")

with open('server.ts', 'w') as f:
    f.write(content)
