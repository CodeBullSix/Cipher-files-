const fs = require('fs');

let serverContent = fs.readFileSync('server.ts', 'utf8');

serverContent = serverContent.replace(/const cases = await db\.select[\s\S]*?const entities = await db\.select.*?;/, `
    const cases = await getCases();
`);

serverContent = serverContent.replace(/for \(const ev of evidence\) \{[\s\S]*?\}/, '');
serverContent = serverContent.replace(/for \(const ent of entities\) \{[\s\S]*?\}/, '');

fs.writeFileSync('server.ts', serverContent);
