const fs = require('fs');

let appContent = fs.readFileSync('src/App.tsx', 'utf8');

const deepLinkSync = `
  // 1. On Mount: Parse URL
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
    } else if (path.startsWith('/workspaces')) {
       setCurrentTab('workspaces');
    } else if (path.startsWith('/moderation')) {
       setCurrentTab('moderation');
    }
  }, []);

  // 2. State to URL & SEO Sync
  useEffect(() => {
    let newPath = '/';
    
    // We do NOT expose private/restricted views via deep links that bypass state,
    // but updating the URL is fine. However, we should explicitly prevent indexing of /workspace etc. (handled in robots.txt)
    
    if (selectedEntityId && selectedEntityType) {
       const typePath = selectedEntityType === "PERSON" ? "people" : selectedEntityType === "ORGANISATION" ? "organisations" : selectedEntityType === "LOCATION" ? "locations" : "entities";
       newPath = \`/\${typePath}/\${selectedEntityId}\`;
    } else if (globalEvidenceId) {
       newPath = \`/evidence/\${globalEvidenceId}\`;
    } else if (globalEventId) {
       newPath = \`/events/\${globalEventId}\`;
    } else if (activeCaseId) {
       newPath = \`/cases/\${activeCaseId}\`;
    } else if (activeDiscussionId) {
       newPath = \`/discussions/\${activeDiscussionId}\`;
    } else {
       if (currentTab !== 'cases') {
          newPath = \`/\${currentTab}\`;
       }
    }

    if (window.location.pathname !== newPath) {
       window.history.pushState(null, '', newPath);
    }
    
    let title = 'Cipher Files';
    if (activeCaseId) {
       const c = cases.find(c => c.id === activeCaseId);
       if (c) title = \`Cipher Files — \${c.title}\`;
    } else if (selectedEntityId) {
       title = \`Cipher Files — Entity Record\`;
    } else if (globalEvidenceId) {
       title = \`Cipher Files — Evidence Record\`;
    } else if (globalEventId) {
       title = \`Cipher Files — Event Record\`;
    } else if (currentTab === 'workspaces') {
       title = \`Cipher Files — Private Workspace\`;
    } else if (currentTab === 'moderation') {
       title = \`Cipher Files — Moderation\`;
    } else if (currentTab === 'evidence') {
       title = \`Cipher Files — Evidence Archive\`;
    } else if (currentTab === 'discussions') {
       title = \`Cipher Files — Community Forums\`;
    } else if (currentTab === 'graph') {
       title = \`Cipher Files — The Rabbit Hole\`;
    }

    if (document.title !== title) {
        document.title = title;
    }
  }, [currentTab, activeCaseId, selectedEntityId, selectedEntityType, globalEvidenceId, globalEventId, activeDiscussionId, cases]);
`;

appContent = appContent.replace(/  \/\/ Real-time UTC clock string/, deepLinkSync + '\n  // Real-time UTC clock string');

fs.writeFileSync('src/App.tsx', appContent);
