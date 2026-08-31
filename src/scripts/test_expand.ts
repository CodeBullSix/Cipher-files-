import { expandGraphNode } from '../db/graph.js';
async function run() {
  const data = await expandGraphNode('organisations_node-cia');
  console.log(`Nodes: ${data.nodes.length}`);
  console.log(`Edges: ${data.edges.length}`);
  console.log("Edges:", data.edges.map(e => `${e.source} -> ${e.target} [${e.relationship}]`).join('\n'));
  process.exit(0);
}
run().catch(console.error);
