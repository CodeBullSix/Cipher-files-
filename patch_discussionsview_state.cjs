const fs = require('fs');
const file = 'src/components/DiscussionsView.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  "const [reportingTarget, setReportingTarget] = useState<{type: 'DISCUSSION' | 'REPLY', id: string} | null>(null);",
  "const [reportingTarget, setReportingTarget] = useState<{type: 'DISCUSSION' | 'REPLY', id: string} | null>(null);\n  const [appealingTarget, setAppealingTarget] = useState<{id: string, type: string, title: string} | null>(null);"
);

fs.writeFileSync(file, content);
