const fs = require('fs');
const file = 'src/components/InvestigatorProfileModal.tsx';
let content = fs.readFileSync(file, 'utf8');

if (!content.includes('const isOwnProfile =')) {
  content = content.replace(
    "const activeProfile = currentUser?.uid === profile.uid ? currentUser : profile;",
    "const activeProfile = currentUser?.uid === profile.uid ? currentUser : profile;\n  const isOwnProfile = currentUser?.uid === activeProfile.uid;"
  );
}

// Fix photoURL to avatar
content = content.replace(/f\.photoURL/g, "f.avatar");

fs.writeFileSync(file, content);
