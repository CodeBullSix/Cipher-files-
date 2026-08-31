const fs = require('fs');
let content = fs.readFileSync('src/db/cases.ts', 'utf8');

const replacement = `export async function getCases(query?: string, category?: string, statusFilter?: any) {
  let conditions = [];
  if (category) {
    conditions.push(eq(caseFiles.category, category));
  }
  if (statusFilter) {
    conditions.push(eq(caseFiles.status, statusFilter));
  }
  if (query) {
    conditions.push(ilike(caseFiles.title, \`%\${query}%\`));
  }

  let results = await db.query.caseFiles.findMany({
    where: conditions.length > 0 ? and(...conditions) : undefined,
    orderBy: [desc(caseFiles.createdAt)]
  });
  
  return results.map(result => {
    return { ...result, entities: [] };
  });
}`;

// I need to replace the `export async function getCases` up to the closing brace.
// Let's use a simple split/replace or regex.
content = content.replace(/export async function getCases[\s\S]*?return \{ \.\.\.result, entities \};\n  \}\);\n\}/, replacement);

fs.writeFileSync('src/db/cases.ts', content);
