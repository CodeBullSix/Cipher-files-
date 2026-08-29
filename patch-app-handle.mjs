import fs from 'fs';
let content = fs.readFileSync('src/App.tsx', 'utf8');

content = content.replace(
  /const handleOpenEntity = \(type: string, id: string\) => \{\n    setSelectedEntityType\(type\);\n    setSelectedEntityId\(id\);\n  \};/,
  `const handleOpenEntity = (type: string, id: string) => {
    if (type === 'events' || type === 'EVENT') {
      handleOpenEvent(id);
    } else if (type === 'evidence' || type === 'EVIDENCE') {
      handleOpenEvidence(id);
    } else {
      setSelectedEntityType(type.toLowerCase());
      setSelectedEntityId(id);
    }
  };`
);

fs.writeFileSync('src/App.tsx', content);
