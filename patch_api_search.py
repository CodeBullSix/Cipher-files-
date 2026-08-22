with open('src/services/apiService.ts', 'r') as f:
    content = f.read()

new_get_evidence = """
  getEvidence: (params: { caseFileId?: string, query?: string, status?: string, page?: number, limit?: number } = {}) => {
    const queryStr = new URLSearchParams(params as any).toString();
    return fetchWithAuth(`/api/evidence?${queryStr}`);
  },
"""

import re
content = re.sub(r"  getEvidence: \(caseFileId\?: string\) => \{.*?\n  \},", new_get_evidence.strip(), content, flags=re.DOTALL)

with open('src/services/apiService.ts', 'w') as f:
    f.write(content)
