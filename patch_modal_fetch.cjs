const fs = require('fs');
let content = fs.readFileSync('src/components/CaseDetailModal.tsx', 'utf8');

const useEffectBlock = `  // Sync when caseFile changes
  useEffect(() => {
    setCurrentCase(caseFile);
    setSelectedDocId(caseFile.documents?.[0]?.id || '');
    setLocalBeliefScore(caseFile.beliefScore ?? 65);
    setHasVotedBelief(false);
    
    // Fetch full case details including evidenceList and connectedCaseIds
    import('../services/apiService').then(({ ApiService }) => {
      ApiService.getCase(caseFile.id)
        .then(fullCase => {
          if (fullCase) {
            setCurrentCase(fullCase);
          }
        })
        .catch(err => console.error("Failed to load full case dossier", err));
    });
  }, [caseFile]);`;

content = content.replace(/  \/\/ Sync when caseFile changes[\s\S]*?\}, \[caseFile\]\);/, useEffectBlock);

fs.writeFileSync('src/components/CaseDetailModal.tsx', content);
