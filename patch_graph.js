import fs from 'fs';
let content = fs.readFileSync('src/db/graph.ts', 'utf8');

const additional = `
export async function getInitialGraphNodes() {
  const cases = await db.query.caseFiles.findMany();
  const nodes = cases.map(c => ({
    id: \`case_files_\${c.id}\`,
    label: c.title,
    type: 'case_files',
    rating: c.status
  }));
  return { nodes, edges: [] };
}
`;

content += additional;
fs.writeFileSync('src/db/graph.ts', content);

// Add to API
let apiContent = fs.readFileSync('src/routes/graph.ts', 'utf8');
apiContent = apiContent.replace(
  "import { getGraphForCase, expandGraphNode } from '../db/graph.js';",
  "import { getGraphForCase, expandGraphNode, getInitialGraphNodes } from '../db/graph.js';"
);
const initialRoute = `
graphRouter.get('/initial', requireAuth, async (req, res) => {
  try {
    const data = await getInitialGraphNodes();
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});
`;
apiContent = apiContent.replace(
  "export const graphRouter = Router();",
  "export const graphRouter = Router();\n" + initialRoute
);
fs.writeFileSync('src/routes/graph.ts', apiContent);

let apiService = fs.readFileSync('src/services/apiService.ts', 'utf8');
apiService = apiService.replace(
  "getGraphForCase: (caseId: string) => fetchWithAuth(`/api/graph/case/${caseId}`),",
  "getInitialGraphNodes: () => fetchWithAuth('/api/graph/initial'),\n  getGraphForCase: (caseId: string) => fetchWithAuth(`/api/graph/case/${caseId}`),"
);
fs.writeFileSync('src/services/apiService.ts', apiService);
