const fs = require('fs');

let appContent = fs.readFileSync('src/App.tsx', 'utf8');

appContent = appContent.replace(/document\.title = title;\n    \}/, `document.title = title;
    }
    
    // Canonical link update
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
        canonical = document.createElement('link');
        canonical.setAttribute('rel', 'canonical');
        document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', \`https://cipherfiles.com\${newPath}\`);
    
    // Dynamic meta description (basic syncing)
    let metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
        if (activeCaseId && cases) {
             const c = cases.find(c => c.id === activeCaseId);
             if (c) metaDesc.setAttribute('content', \`Case Dossier: \${c.title}. \${c.category}\`);
        } else if (currentTab === 'cases') {
             metaDesc.setAttribute('content', 'Explore declassified dossiers and official case files.');
        } else if (currentTab === 'discussions') {
             metaDesc.setAttribute('content', 'Community forums for investigating the unexplained.');
        } else {
             metaDesc.setAttribute('content', 'A community-driven investigative platform.');
        }
    }
`);

fs.writeFileSync('src/App.tsx', appContent);
