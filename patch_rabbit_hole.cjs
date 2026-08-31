const fs = require('fs');
let content = fs.readFileSync('src/components/RabbitHoleGraph.tsx', 'utf8');

const getNodeColorStr = `    const getNodeColor = (type: string) => {
      switch (type) {
        case 'case_files': return '#10B981';
        case 'people': return '#00E5FF';
        case 'organisations': return '#F59E0B';
        case 'locations': return '#38BDF8';
        case 'events': return '#A855F7';
        default: return '#6B7280';
      }
    };`;

content = content.replace(getNodeColorStr, '');

// insert it before the first useEffect
content = content.replace(
  `  useEffect(() => {`,
  `  const getNodeColor = (type: string) => {
    switch (type) {
      case 'case_files': return '#10B981';
      case 'people': return '#00E5FF';
      case 'organisations': return '#F59E0B';
      case 'locations': return '#38BDF8';
      case 'events': return '#A855F7';
      default: return '#6B7280';
    }
  };

  useEffect(() => {`
);

fs.writeFileSync('src/components/RabbitHoleGraph.tsx', content);
