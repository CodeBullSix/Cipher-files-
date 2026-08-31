const fs = require('fs');
let content = fs.readFileSync('src/components/RabbitHoleGraph.tsx', 'utf8');

// 1. Remove selectedNode and searchQuery from the node rendering in the main useEffect
content = content.replace(
  `    node.selectAll('circle')
      .attr('stroke', (d: any) => {
        if (selectedNode?.id === d.id) return '#fff';
        if (searchQuery && (d.label || '').toLowerCase().includes(searchQuery.toLowerCase())) return '#fff';
        return getNodeColor(d.type);
      })
      .attr('stroke-width', (d: any) => {
        if (selectedNode?.id === d.id) return 4;
        if (searchQuery && (d.label || '').toLowerCase().includes(searchQuery.toLowerCase())) return 4;
        return 2;
      });`,
  `    node.selectAll('circle')
      .attr('stroke', (d: any) => getNodeColor(d.type))
      .attr('stroke-width', 2);`
);

// 2. Remove selectedNode and searchQuery from the main useEffect dependency array
content = content.replace(
  `  }, [nodes, links, filterType, searchQuery, selectedNode]);`,
  `  }, [nodes, links, filterType]);`
);

// 3. Add a new useEffect below the main one to handle purely visual updates
const visualUpdateHook = `
  // Purely visual updates for selection and search (avoiding simulation restart)
  useEffect(() => {
    if (!nodeGroupRef.current) return;
    const node = d3.select(nodeGroupRef.current).selectAll('.node');
    if (node.empty()) return;

    node.selectAll('circle')
      .attr('stroke', (d: any) => {
        if (selectedNode?.id === d.id) return '#fff';
        if (searchQuery && (d.label || '').toLowerCase().includes(searchQuery.toLowerCase())) return '#fff';
        return getNodeColor(d.type);
      })
      .attr('stroke-width', (d: any) => {
        if (selectedNode?.id === d.id) return 4;
        if (searchQuery && (d.label || '').toLowerCase().includes(searchQuery.toLowerCase())) return 4;
        return 2;
      });
  }, [selectedNode, searchQuery]);
`;

content = content.replace(
  `  const handleOpenEntity = () => {`,
  `${visualUpdateHook}\n  const handleOpenEntity = () => {`
);

fs.writeFileSync('src/components/RabbitHoleGraph.tsx', content);
