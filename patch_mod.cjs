const fs = require('fs');
const file = 'src/components/ModerationDashboardView.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  "const [queue, setQueue] = useState<{evidence: any[], discussions: any[], replies: any[]}>({",
  "const [queue, setQueue] = useState<{evidence: any[], discussions: any[], replies: any[], reports: any[]}>({"
);

content = content.replace(
  "evidence: [], discussions: [], replies: []",
  "evidence: [], discussions: [], replies: [], reports: []"
);

content = content.replace(
  "const [activeTab, setActiveTab] = useState<'evidence' | 'discussions' | 'replies'>('evidence');",
  "const [activeTab, setActiveTab] = useState<'evidence' | 'discussions' | 'replies' | 'reports'>('reports');"
);

// We need to fetch reports as well.
const fetchQueueOld = `      const res = await fetch('/api/moderation/queue', {
        headers: {
          'Authorization': \`Bearer \${token}\`
        }
      });
      if (!res.ok) {
        if (res.status === 403) throw new Error('MODERATION DATA UNAVAILABLE: Unauthorized');
        throw new Error('MODERATION DATA UNAVAILABLE');
      }
      const data = await res.json();
      setQueue(data);`;

const fetchQueueNew = `      const [res, reportsRes] = await Promise.all([
        fetch('/api/moderation/queue', {
          headers: { 'Authorization': \`Bearer \${token}\` }
        }),
        fetch('/api/reports', {
          headers: { 'Authorization': \`Bearer \${token}\` }
        })
      ]);
      if (!res.ok || !reportsRes.ok) {
        if (res.status === 403 || reportsRes.status === 403) throw new Error('MODERATION DATA UNAVAILABLE: Unauthorized');
        throw new Error('MODERATION DATA UNAVAILABLE');
      }
      const data = await res.json();
      const reportsData = await reportsRes.json();
      setQueue({ ...data, reports: reportsData });`;

content = content.replace(fetchQueueOld, fetchQueueNew);

fs.writeFileSync(file, content);
