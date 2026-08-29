const fs = require('fs');
const file = 'src/App.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  "const [isDirectMessageModalOpen, setIsDirectMessageModalOpen] = useState<boolean>(false);",
  "const [isDirectMessageModalOpen, setIsDirectMessageModalOpen] = useState<boolean>(false);\n  const [isNotificationsOpen, setIsNotificationsOpen] = useState<boolean>(false);\n  const [unreadNotificationCount, setUnreadNotificationCount] = useState<number>(0);"
);

fs.writeFileSync(file, content);
