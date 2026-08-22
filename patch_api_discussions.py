with open('src/services/apiService.ts', 'r') as f:
    content = f.read()

endpoint = """
  getDiscussionEvidence: (discussionId: string) => fetchWithAuth(`/api/discussions/${discussionId}/evidence`),
"""

if "getDiscussionEvidence" not in content:
    content = content.replace("  getDiscussions: (caseFileId?: string) => {", endpoint + "  getDiscussions: (caseFileId?: string) => {")

with open('src/services/apiService.ts', 'w') as f:
    f.write(content)
