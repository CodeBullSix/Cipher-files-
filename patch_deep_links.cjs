const fs = require('fs');

let appContent = fs.readFileSync('src/App.tsx', 'utf8');

// We want to add deep-link initialization in a useEffect
const deepLinkEffect = `  // Deep link handler
  useEffect(() => {
    const path = window.location.pathname;
    if (path.startsWith('/cases/')) {
      const id = path.split('/')[2];
      if (id) {
        setCurrentTab('cases');
        setActiveCaseId(id);
      }
    } else if (path.startsWith('/evidence/')) {
      const id = path.split('/')[2];
      if (id) {
        setCurrentTab('evidence');
        setGlobalEvidenceId(id);
      }
    } else if (path.startsWith('/people/') || path.startsWith('/organisations/') || path.startsWith('/locations/')) {
      const parts = path.split('/');
      const id = parts[2];
      const type = parts[1].toUpperCase().replace(/S$/, '');
      if (id) {
        setSelectedEntityType(type);
        setSelectedEntityId(id);
      }
    } else if (path.startsWith('/events/')) {
      const id = path.split('/')[2];
      if (id) {
        setGlobalEventId(id);
      }
    } else if (path.startsWith('/discussions/')) {
       const id = path.split('/')[2];
       if (id) {
         setCurrentTab('discussions');
         setActiveDiscussionId(id);
       }
    }
  }, []);

  // Update URL function
  const updateUrl = (path: string) => {
    window.history.pushState(null, '', path);
  };
`;

appContent = appContent.replace(/  \/\/ Real-time UTC clock string/, deepLinkEffect + '\n  // Real-time UTC clock string');

appContent = appContent.replace(/const handleOpenCase = \(caseId: string\) => \{/, 'const handleOpenCase = (caseId: string) => {\n    updateUrl(`/cases/${caseId}`);');
appContent = appContent.replace(/setActiveCaseId\(null\)/g, 'setActiveCaseId(null); updateUrl("/")');

appContent = appContent.replace(/const handleOpenEvidence = async \(id: string\) => \{/, 'const handleOpenEvidence = async (id: string) => {\n    updateUrl(`/evidence/${id}`);');
appContent = appContent.replace(/setGlobalEvidenceId\(null\)/g, 'setGlobalEvidenceId(null); updateUrl("/")');

appContent = appContent.replace(/const handleOpenEvent = \(id: string\) => \{/, 'const handleOpenEvent = (id: string) => {\n    updateUrl(`/events/${id}`);');
appContent = appContent.replace(/setGlobalEventId\(null\)/g, 'setGlobalEventId(null); updateUrl("/")');

appContent = appContent.replace(/const handleOpenDiscussion = \(id: string\) => \{/, 'const handleOpenDiscussion = (id: string) => {\n    updateUrl(`/discussions/${id}`);');
appContent = appContent.replace(/setActiveDiscussionId\(undefined\)/g, 'setActiveDiscussionId(undefined); updateUrl("/")'); // Need to verify if this exists

appContent = appContent.replace(/const handleOpenEntity = \(type: string, id: string\) => \{/, 'const handleOpenEntity = (type: string, id: string) => {\n    const typePath = type === "PERSON" ? "people" : type === "ORGANISATION" ? "organisations" : type === "LOCATION" ? "locations" : "entities";\n    updateUrl(`/${typePath}/${id}`);');
appContent = appContent.replace(/setSelectedEntityId\(null\)/g, 'setSelectedEntityId(null); updateUrl("/")');

fs.writeFileSync('src/App.tsx', appContent);
