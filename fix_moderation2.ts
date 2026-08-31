import fs from 'fs';

const path = 'src/components/ModerationQueueModal.tsx';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(/const handleReject = \(sub: TheorySubmission\) => \{[\s\S]*?sound\.playClick\(500\);\n  \};/m, 
`const handleReject = async (sub: any) => {
    await ApiService.updateSubmissionStatus(sub.id, 'REJECTED', reviewNotes);
    const data = await ApiService.getModerationSubmissions();
    if (data && data.submissions) setSubmissions(data.submissions);
    sound.playClick(500);
  };`);

fs.writeFileSync(path, content);
console.log("Updated handleReject in ModerationQueueModal.tsx");
