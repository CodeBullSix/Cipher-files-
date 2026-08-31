const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf8');

content = content.replace(
  `app.get('/api/cases', async (req, res) => {
  try {
    const cases = await getCases();
    res.json(cases);
  } catch (error: any) {`,
  `app.get('/api/cases', async (req, res) => {
  try {
    const query = req.query.query as string;
    const category = req.query.category as string;
    const status = req.query.status as string;
    const cases = await getCases(query, category, status);
    res.json(cases);
  } catch (error: any) {`
);

fs.writeFileSync('server.ts', content);
