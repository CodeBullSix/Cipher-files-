const fs = require('fs');
const file = 'src/components/InvestigatorProfileModal.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  "const activeProfile = currentUser || profile;",
  "const activeProfile = profile;\n  const isOwnProfile = currentUser?.uid === profile.uid;"
);

// We should also fix where `activeTab` type is defined to include followers and following.
content = content.replace(
  "const [activeTab, setActiveTab] = useState<'dossier' | 'contributions' | 'customize'>('dossier');",
  "const [activeTab, setActiveTab] = useState<'dossier' | 'contributions' | 'customize' | 'followers' | 'following'>('dossier');"
);

fs.writeFileSync(file, content);
