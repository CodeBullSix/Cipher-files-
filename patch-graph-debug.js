const fs = require('fs');
let content = fs.readFileSync('src/components/RabbitHoleGraph.tsx', 'utf8');

content = content.replace(
  /const filteredNodes = filterType === 'ALL' \? nodes : nodes.filter\(n => n.type === filterType \|\| n.type === 'case_files'\);/,
  `const filteredNodes = filterType === 'ALL' ? nodes : nodes.filter(n => n.type === filterType || n.type === 'case_files');
    console.log("DEBUG FILTER:", filterType, "Total Nodes:", nodes.length, "Matches:", nodes.filter(n => n.type === filterType).length, nodes.map(n => n.type));`
);

fs.writeFileSync('src/components/RabbitHoleGraph.tsx', content);
