const fs = require('fs');
const file = 'src/App.tsx';
let content = fs.readFileSync(file, 'utf8');

if (!content.includes('const [selectedInvestigatorProfile')) {
  content = content.replace(
    "const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);",
    "const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);\n  const [selectedInvestigatorProfile, setSelectedInvestigatorProfile] = useState<any | null>(null);"
  );

  const newHandler = `
  const handleOpenEntity = (type: string, id: string) => {
    if (type === 'events' || type === 'EVENT') {
      handleOpenEvent(id);
    } else if (type === 'evidence' || type === 'EVIDENCE') {
      handleOpenEvidence(id);
    } else if (type === 'profile' || type === 'PROFILE') {
      if (id === 'me' || id === currentUser?.uid) {
        setSelectedInvestigatorProfile(legacyProfile);
        setIsProfileModalOpen(true);
      } else {
        ApiService.getUsers().then(users => {
          const user = users.find((u: any) => u.uid === id);
          if (user) {
            setSelectedInvestigatorProfile(user);
            setIsProfileModalOpen(true);
          }
        }).catch(console.error);
      }
    } else {
      setSelectedEntityType(type.toLowerCase());
      setSelectedEntityId(id);
    }
  };
`;

  content = content.replace(
    /const handleOpenEntity = \([\s\S]*?setSelectedEntityId\(id\);\n    \}\n  \};/,
    newHandler
  );
  
  content = content.replace(
    /onOpenProfileModal=\{\(\) => setIsProfileModalOpen\(true\)\}/g,
    "onOpenProfileModal={() => { setSelectedInvestigatorProfile(legacyProfile); setIsProfileModalOpen(true); }}"
  );

  content = content.replace(
    "<InvestigatorProfileModal\n          profile={legacyProfile}",
    "<InvestigatorProfileModal\n          profile={selectedInvestigatorProfile || legacyProfile}"
  );

  fs.writeFileSync(file, content);
}
