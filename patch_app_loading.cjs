const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

if (!content.includes('isLoadingCase')) {
  content = content.replace(
    "const [activeCaseId, setActiveCaseId] = useState<string | null>(null);",
    "const [activeCaseId, setActiveCaseId] = useState<string | null>(null);\n  const [isLoadingCase, setIsLoadingCase] = useState(false);"
  );

  const oldHandleOpenCase = `  const handleOpenCase = (caseId: string) => {
    setActiveCaseId(caseId);
    const targetCase = cases.find(c => c.id === caseId) || INITIAL_CASES.find(c => c.id === caseId);
    StorageService.pushTrail(
      targetCase?.title || caseId,
      caseId,
      'CASE'
    );
    setLegacyProfile(StorageService.getProfile());
  };`;

  const newHandleOpenCase = `  const handleOpenCase = (caseId: string) => {
    const targetCase = cases.find(c => c.id === caseId) || INITIAL_CASES.find(c => c.id === caseId);
    if (!targetCase) {
      setIsLoadingCase(true);
      setActiveCaseId(caseId); // set early to show loading state if needed
      import('./services/apiService').then(({ ApiService }) => {
        ApiService.getCase(caseId).then(fetched => {
          if (fetched) {
            setCases(prev => {
              if (!prev.find(c => c.id === fetched.id)) return [...prev, fetched];
              return prev.map(c => c.id === fetched.id ? fetched : c);
            });
            StorageService.pushTrail(fetched.title, caseId, 'CASE');
            setLegacyProfile(StorageService.getProfile());
          }
          setIsLoadingCase(false);
        }).catch(err => {
          console.error(err);
          setIsLoadingCase(false);
        });
      });
    } else {
      setActiveCaseId(caseId);
      StorageService.pushTrail(targetCase.title, caseId, 'CASE');
      setLegacyProfile(StorageService.getProfile());
    }
  };`;

  content = content.replace(oldHandleOpenCase, newHandleOpenCase);
  fs.writeFileSync('src/App.tsx', content);
}
