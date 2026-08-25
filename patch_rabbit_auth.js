import fs from 'fs';
let content = fs.readFileSync('src/components/RabbitHoleGraph.tsx', 'utf8');

content = content.replace(
  /<h3 className="text-red-400 font-mono font-bold text-sm mb-2">NEXUS CONNECTION FAILURE<\/h3>\s*<p className="text-red-200\/70 text-xs font-mono">\{error\}<\/p>/s,
  `
            <h3 className="text-red-400 font-mono font-bold text-sm mb-2">
              {error === 'AUTHENTICATION REQUIRED' ? 'AUTHENTICATION REQUIRED' : 'NEXUS CONNECTION FAILURE'}
            </h3>
            <p className="text-red-200/70 text-xs font-mono">
              {error === 'AUTHENTICATION REQUIRED' 
                ? 'Your secure session token is missing or expired. Please login to access the Knowledge Graph.' 
                : error}
            </p>
  `.trim()
);

fs.writeFileSync('src/components/RabbitHoleGraph.tsx', content);
