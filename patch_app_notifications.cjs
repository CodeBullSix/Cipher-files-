const fs = require('fs');
const file = 'src/App.tsx';
let content = fs.readFileSync(file, 'utf8');

// Import NotificationsPanel
if (!content.includes('import { NotificationsPanel }')) {
  content = content.replace(
    "import { QuickSearchModal } from './components/QuickSearchModal';",
    "import { QuickSearchModal } from './components/QuickSearchModal';\nimport { NotificationsPanel } from './components/NotificationsPanel';"
  );
}

// Add state
if (!content.includes('const [isNotificationsOpen')) {
  content = content.replace(
    "const [isDirectMessagesOpen, setIsDirectMessagesOpen] = useState(false);",
    "const [isDirectMessagesOpen, setIsDirectMessagesOpen] = useState(false);\n  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);\n  const [unreadNotificationCount, setUnreadNotificationCount] = useState(0);"
  );
}

// Add effect for unread notifications
const unreadEffect = `
  useEffect(() => {
    let mounted = true;
    if (currentUser) {
      ApiService.getUnreadNotificationCount()
        .then(data => {
          if (mounted && data && typeof data.unreadCount === 'number') {
            setUnreadNotificationCount(data.unreadCount);
          }
        })
        .catch(console.error);
        
      const interval = setInterval(() => {
        ApiService.getUnreadNotificationCount()
          .then(data => {
            if (mounted && data && typeof data.unreadCount === 'number') {
              setUnreadNotificationCount(data.unreadCount);
            }
          })
          .catch(console.error);
      }, 60000);
      return () => clearInterval(interval);
    }
  }, [currentUser]);
`;

if (!content.includes('getUnreadNotificationCount')) {
  content = content.replace(
    "// Data loading logic",
    unreadEffect + "\n  // Data loading logic"
  );
}

// Update Navbar
content = content.replace(
  "<Navbar\n        currentTab={currentTab}",
  `<Navbar
        currentTab={currentTab}
        unreadNotificationCount={unreadNotificationCount}
        onOpenNotifications={() => setIsNotificationsOpen(true)}`
);

// Add panel to rendering
const panelComponent = `
      <NotificationsPanel 
        isOpen={isNotificationsOpen}
        onClose={() => { setIsNotificationsOpen(false); ApiService.getUnreadNotificationCount().then(d => setUnreadNotificationCount(d.unreadCount)).catch(console.error); }}
        onOpenCase={handleOpenCase}
        onOpenEntity={handleOpenEntity}
        onOpenDiscussion={handleOpenDiscussion}
      />
`;

content = content.replace(
  "{/* 3. Direct Messaging Drawer */}",
  panelComponent + "\n      {/* 3. Direct Messaging Drawer */}"
);

fs.writeFileSync(file, content);
