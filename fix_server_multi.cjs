const fs = require('fs');

let content = fs.readFileSync('server.ts', 'utf8');

// Strip all app.get('/sitemap.xml') blocks.
// I will just use a regex to remove everything from the first app.get('/sitemap.xml') to the LAST 'res.status(500).send('Internal Server Error');\n  }\n});\n'

const firstIndex = content.indexOf("app.get('/sitemap.xml'");
const endStr = "// Health check endpoint";
const healthIndex = content.indexOf(endStr);

if (firstIndex !== -1 && healthIndex !== -1) {
    const sitemapCode = `app.get('/sitemap.xml', async (req, res) => {
  try {
    const cases = await getCases();
    let xml = \`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
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
    content = content.slice(0, firstIndex) + sitemapCode + content.slice(healthIndex);
    fs.writeFileSync('server.ts', content);
}

