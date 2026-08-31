const fs = require('fs');

let appContent = fs.readFileSync('src/App.tsx', 'utf8');

// We remove the deep link effect
appContent = appContent.replace(/  \/\/ Deep link handler[\s\S]*?const updateUrl = \(path: string\) => \{\n    window\.history\.pushState\(null, '', path\);\n  \};\n/, '');

appContent = appContent.replace(/const handleOpenCase = \(caseId: string\) => \{\n    updateUrl\(`\/cases\/\$\{caseId\}`\);/g, 'const handleOpenCase = (caseId: string) => {');
appContent = appContent.replace(/setActiveCaseId\(null\); updateUrl\("\/"\)/g, 'setActiveCaseId(null)');

appContent = appContent.replace(/const handleOpenEvidence = async \(id: string\) => \{\n    updateUrl\(`\/evidence\/\$\{id\}`\);/g, 'const handleOpenEvidence = async (id: string) => {');
appContent = appContent.replace(/setGlobalEvidenceId\(null\); updateUrl\("\/"\)/g, 'setGlobalEvidenceId(null)');

appContent = appContent.replace(/const handleOpenEvent = \(id: string\) => \{\n    updateUrl\(`\/events\/\$\{id\}`\);/g, 'const handleOpenEvent = (id: string) => {');
appContent = appContent.replace(/setGlobalEventId\(null\); updateUrl\("\/"\)/g, 'setGlobalEventId(null)');

appContent = appContent.replace(/const handleOpenDiscussion = \(id: string\) => \{\n    updateUrl\(`\/discussions\/\$\{id\}`\);/g, 'const handleOpenDiscussion = (id: string) => {');
appContent = appContent.replace(/setActiveDiscussionId\(undefined\); updateUrl\("\/"\)/g, 'setActiveDiscussionId(undefined)');

appContent = appContent.replace(/const handleOpenEntity = \(type: string, id: string\) => \{\n    const typePath = type === "PERSON" \? "people" : type === "ORGANISATION" \? "organisations" : type === "LOCATION" \? "locations" : "entities";\n    updateUrl\(`\/\$\{typePath\}\/\$\{id\}`\);/g, 'const handleOpenEntity = (type: string, id: string) => {');
appContent = appContent.replace(/setSelectedEntityId\(null\); updateUrl\("\/"\)/g, 'setSelectedEntityId(null)');

fs.writeFileSync('src/App.tsx', appContent);
