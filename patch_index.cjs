const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

// Replace everything inside head
html = html.replace(/<head>[\s\S]*?<\/head>/, `
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Cipher Files</title>
    <meta name="description" content="A community-driven investigative platform to decode evidence, connect rabbit holes, and examine declassified dossiers." />
    
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <link rel="manifest" href="/manifest.json" />
    
    <meta property="og:title" content="Cipher Files" />
    <meta property="og:description" content="A community-driven investigative platform to decode evidence, connect rabbit holes, and examine declassified dossiers." />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="Cipher Files" />
    
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="Cipher Files" />
    <meta name="twitter:description" content="Investigative Intelligence Platform" />
  </head>
`);

fs.writeFileSync('index.html', html);
