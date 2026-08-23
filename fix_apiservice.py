import re

with open('src/services/apiService.ts', 'r') as f:
    content = f.read()

download_method = """  downloadDocument: async (storageKey: string, fileName: string, fileType: string) => {
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
  // Users"""

content = content.replace("  // Users", download_method)

with open('src/services/apiService.ts', 'w') as f:
    f.write(content)
