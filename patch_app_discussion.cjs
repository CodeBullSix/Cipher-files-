const fs = require('fs');
const file = 'src/App.tsx';
let content = fs.readFileSync(file, 'utf8');

// Add activeDiscussionId state
content = content.replace(
  "const [currentTab, setCurrentTab] = useState<'cases' | 'graph' | 'discussions' | 'supporters' | 'evidence' | 'workspaces'>('cases');",
  "const [currentTab, setCurrentTab] = useState<'cases' | 'graph' | 'discussions' | 'supporters' | 'evidence' | 'workspaces'>('cases');\n  const [activeDiscussionId, setActiveDiscussionId] = useState<string | undefined>();"
);

// Add handleOpenDiscussion
const handleFn = `
  const handleOpenDiscussion = (id: string) => {
    setActiveDiscussionId(id);
    setCurrentTab('discussions');
  };
`;

if (!content.includes('handleOpenDiscussion')) {
  content = content.replace("const handleOpenEntity = ", handleFn + "\n  const handleOpenEntity = ");
}

// Pass initialThreadId to DiscussionsView
content = content.replace(
  "<DiscussionsView",
  "<DiscussionsView initialThreadId={activeDiscussionId}"
);

// Pass onOpenDiscussion to InvestigatorProfileModal
content = content.replace(
  "onOpenEntity={handleOpenEntity}",
  "onOpenEntity={handleOpenEntity}\n          onOpenDiscussion={handleOpenDiscussion}"
);

fs.writeFileSync(file, content);
