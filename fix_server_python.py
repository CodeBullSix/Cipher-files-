import re

with open('server.ts', 'r') as f:
    content = f.read()

# Find the first app.get('/sitemap.xml'
# and the LAST 'app.get('/api/health''

sitemap_start = content.find("app.get('/sitemap.xml'")
health_start = content.rfind("// Health check endpoint")

if sitemap_start != -1 and health_start != -1:
    sitemapCode = """app.get('/sitemap.xml', async (req, res) => {
  try {
    const cases = await getCases();
    let xml = `<?xml version="1.0" encoding="UTF-8"?>\\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\\n  <url>\\n    <loc>https://cipherfiles.com/</loc>\\n    <changefreq>daily</changefreq>\\n    <priority>1.0</priority>\\n  </url>`;

    for (const c of cases) {
      xml += `\\n  <url>\\n    <loc>https://cipherfiles.com/cases/${c.id}</loc>\\n    <changefreq>weekly</changefreq>\\n    <priority>0.8</priority>\\n  </url>`;
    }

    xml += `\\n</urlset>`;

    res.header('Content-Type', 'application/xml');
    res.send(xml);
  } catch (err) {
    console.error('Sitemap generation error:', err);
    res.status(500).send('Internal Server Error');
  }
});

"""
    new_content = content[:sitemap_start] + sitemapCode + content[health_start:]
    with open('server.ts', 'w') as f:
        f.write(new_content)
    print("Fixed server.ts successfully")
else:
    print("Could not find bounds")
