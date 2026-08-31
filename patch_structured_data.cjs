const fs = require('fs');

let appContent = fs.readFileSync('src/App.tsx', 'utf8');

appContent = appContent.replace(/let metaDesc = document\.querySelector\('meta\[name="description"\]'\);/, `
    // Structured Data JSON-LD
    let scriptTag = document.querySelector('#structured-data');
    if (!scriptTag) {
        scriptTag = document.createElement('script');
        scriptTag.id = 'structured-data';
        scriptTag.setAttribute('type', 'application/ld+json');
        document.head.appendChild(scriptTag);
    }
    
    let schemaObj = {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "Cipher Files",
      "url": "https://cipherfiles.com/"
    };
    
    if (activeCaseId && cases) {
       const c = cases.find(c => c.id === activeCaseId);
       if (c) {
           schemaObj = {
             "@context": "https://schema.org",
             "@type": "Article",
             "headline": c.title,
             "description": c.description || "Cipher Files Case Dossier",
             "url": \`https://cipherfiles.com/cases/\${c.id}\`,
             "author": { "@type": "Organization", "name": "Cipher Files" }
           };
       }
    }
    scriptTag.textContent = JSON.stringify(schemaObj);

    let metaDesc = document.querySelector('meta[name="description"]');
`);

fs.writeFileSync('src/App.tsx', appContent);
