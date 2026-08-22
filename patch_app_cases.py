with open('src/App.tsx', 'r') as f:
    content = f.read()

import re

merge_logic = """
    import('./services/apiService').then(({ ApiService }) => {
      ApiService.getCases().then((loadedCases) => {
        const localCases = StorageService.getCases();
        const merged = localCases.map(local => {
          const remote = loadedCases.find((r: any) => r.id === local.id);
          if (remote) {
            return { ...local, ...remote };
          }
          return local;
        });
        loadedCases.forEach((remote: any) => {
          if (!merged.find(m => m.id === remote.id)) {
            merged.push({
              ...remote,
              whatWeKnow: remote.whatWeKnow || [],
              speculations: remote.speculations || [],
              evidenceList: remote.evidenceList || [],
              timeline: remote.timeline || [],
              documents: remote.documents || [],
              entities: remote.entities || [],
              connectedCaseIds: remote.connectedCaseIds || []
            });
          }
        });
        setCases(merged);
      }).catch(console.error);
    });
"""

content = re.sub(r"    import\('\./services/apiService'\)\.then\(\(\{ ApiService \}\) => \{\n\s*ApiService\.getCases\(\)\.then\(\(loadedCases\) => \{\n\s*setCases\(loadedCases\);\n\s*\}\)\.catch\(console\.error\);\n\s*\}\);", merge_logic.strip(), content, flags=re.DOTALL)

with open('src/App.tsx', 'w') as f:
    f.write(content)
