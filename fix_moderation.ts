import fs from 'fs';

const path = 'src/components/ModerationQueueModal.tsx';
let content = fs.readFileSync(path, 'utf8');

// Replace StorageService with ApiService
content = content.replace("import { StorageService } from '../services/storage';", "import { ApiService } from '../services/apiService';");

// Use useEffect to fetch submissions
content = content.replace("const [submissions, setSubmissions] = useState<TheorySubmission[]>(StorageService.getSubmissions());", 
`const [submissions, setSubmissions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  React.useEffect(() => {
    ApiService.getModerationSubmissions().then(data => {
      if (data && data.submissions) {
        setSubmissions(data.submissions);
        setSelectedSub(data.submissions[0] || null);
      }
      setIsLoading(false);
    }).catch(console.error);
  }, []);
`);

// Replace handleApprovePublish
content = content.replace(/const handleApprovePublish = \(sub: TheorySubmission\) => \{[\s\S]*?sound\.playStamp\(\);\n  \};/m, 
`const handleApprovePublish = async (sub: any) => {
    await ApiService.updateSubmissionStatus(sub.id, 'APPROVED', reviewNotes);
    const data = await ApiService.getModerationSubmissions();
    if (data && data.submissions) setSubmissions(data.submissions);
    onReputationEarned(80, \`Approved & declassified community investigation: \${sub.title}\`, true);
    onRefreshCases();
    sound.playStamp();
  };`);

// Replace handleNeedsChanges
content = content.replace(/const handleNeedsChanges = \(sub: TheorySubmission\) => \{[\s\S]*?sound\.playClick\(700\);\n  \};/m, 
`const handleNeedsChanges = async (sub: any) => {
    await ApiService.updateSubmissionStatus(sub.id, 'RETURNED', reviewNotes);
    const data = await ApiService.getModerationSubmissions();
    if (data && data.submissions) setSubmissions(data.submissions);
    sound.playClick(700);
  };`);

// Replace handleReject
content = content.replace(/const handleReject = \(sub: TheorySubmission\) => \{[\s\S]*?sound\.playError\(\);\n  \};/m, 
`const handleReject = async (sub: any) => {
    await ApiService.updateSubmissionStatus(sub.id, 'REJECTED', reviewNotes);
    const data = await ApiService.getModerationSubmissions();
    if (data && data.submissions) setSubmissions(data.submissions);
    sound.playError();
  };`);

// Replace 'SUBMITTED' with 'PENDING_REVIEW' in the view
content = content.replace(/s\.status === 'SUBMITTED'/g, "s.status === 'PENDING_REVIEW'");

fs.writeFileSync(path, content);
console.log("Updated ModerationQueueModal.tsx");
