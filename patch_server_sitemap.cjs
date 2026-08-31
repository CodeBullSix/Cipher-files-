const fs = require('fs');

let serverContent = fs.readFileSync('server.ts', 'utf8');

const sitemapCode = `
app.get('/sitemap.xml', async (req, res) => {
  try {
    const cases = await db.select({ id: schema.cases.id }).from(schema.cases).where(eq(schema.cases.deleted, false));
    const evidence = await db.select({ id: schema.evidence.id }).from(schema.evidence).where(eq(schema.evidence.deleted, false));
    const entities = await db.select({ id: schema.entities.id, type: schema.entities.type }).from(schema.entities);

    let xml = \`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\`;

    xml += \`
  <url>
    <loc>https://cipherfiles.com/</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>\`;

    for (const c of cases) {
      xml += \`
  <url>
    <loc>https://cipherfiles.com/cases/\${c.id}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>\`;
    }

    for (const ev of evidence) {
      xml += \`
  <url>
    <loc>https://cipherfiles.com/evidence/\${ev.id}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>\`;
    }

    for (const ent of entities) {
      const typePath = ent.type === "PERSON" ? "people" : ent.type === "ORGANISATION" ? "organisations" : ent.type === "LOCATION" ? "locations" : "entities";
      xml += \`
  <url>
    <loc>https://cipherfiles.com/\${typePath}/\${ent.id}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>\`;
    }

    xml += \`
</urlset>\`;

    res.header('Content-Type', 'application/xml');
    res.send(xml);
  } catch (err) {
    console.error('Sitemap generation error:', err);
    res.status(500).send('Internal Server Error');
  }
});
`;

serverContent = serverContent.replace(/app\.get\('\/api\/health'/, sitemapCode + '\n// Health check endpoint\napp.get(\'/api/health\'');

fs.writeFileSync('server.ts', serverContent);
