const fs = require('fs');
const file = 'src/components/ModerationDashboardView.tsx';
let content = fs.readFileSync(file, 'utf8');

// Add appeals queue state
content = content.replace(
  "const [queueItems, setQueueItems] = useState<any[]>([]);",
  "const [queueItems, setQueueItems] = useState<any[]>([]);\n  const [appealsQueue, setAppealsQueue] = useState<any[]>([]);"
);

// Fetch appeals queue
content = content.replace(
  "const [queueRes, logsRes] = await Promise.all([",
  "const [queueRes, logsRes, appealsRes] = await Promise.all(["
);

content = content.replace(
  "fetch('/api/moderation/logs', { headers: { 'Authorization': `Bearer ${token}` } })",
  "fetch('/api/moderation/logs', { headers: { 'Authorization': `Bearer ${token}` } }),\n        fetch('/api/appeals/queue', { headers: { 'Authorization': `Bearer ${token}` } })"
);

content = content.replace(
  "if (!queueRes.ok || !logsRes.ok) {",
  "if (!queueRes.ok || !logsRes.ok || !appealsRes.ok) {"
);

content = content.replace(
  "const lData = await logsRes.json();",
  "const lData = await logsRes.json();\n      const aData = await appealsRes.json();"
);

content = content.replace(
  "setLogs(lData);",
  "setLogs(lData);\n      setAppealsQueue(aData);"
);

// Add Appeals active tab type
content = content.replace(
  "const [activeTab, setActiveTab] = useState<'queue' | 'logs'>('queue');",
  "const [activeTab, setActiveTab] = useState<'queue' | 'appeals' | 'logs'>('queue');"
);

fs.writeFileSync(file, content);
