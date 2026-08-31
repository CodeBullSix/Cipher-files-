import fs from 'fs';
const path = 'src/components/ModerationQueueModal.tsx';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(/sub\.caseNumber/g, "sub.content?.caseNumber || 'NEW'");
content = content.replace(/sub\.submitterName/g, "sub.submittedById");
content = content.replace(/sub\.submittedAt/g, "new Date(sub.createdAt).toLocaleDateString()");
content = content.replace(/sub\.suggestedRating/g, "sub.content?.status || 'UNVERIFIED'");

fs.writeFileSync(path, content);
console.log("Fixed left column UI in ModerationQueueModal.tsx");
