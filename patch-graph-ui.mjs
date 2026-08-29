import fs from 'fs';
let content = fs.readFileSync('src/components/RabbitHoleGraph.tsx', 'utf8');

// Also fix the error string mapping
content = content.replace(
  'setAiBriefContent(`### ⚠️ NEXUS TRACE FAILED\\n\\n${e.message}`);',
  'setAiBriefContent({ connection: `### ⚠️ NEXUS TRACE FAILED\\n\\n${e.message}` });'
);

content = content.replace(
  'setAiBriefContent(`### ⚠️ AI BRIEF UNAVAILABLE\\n\\n${e.message}`);',
  'setAiBriefContent({ brief: `### ⚠️ AI BRIEF UNAVAILABLE\\n\\n${e.message}` });'
);

fs.writeFileSync('src/components/RabbitHoleGraph.tsx', content);
