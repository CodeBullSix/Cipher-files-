const fs = require('fs');
let content = fs.readFileSync('src/services/geminiService.ts', 'utf8');

// We need to import auth from firebase to get the token
content = "import { auth } from './firebase';\n" + content;

// Replace fetch with fetchWithAuth style inside GeminiService
content = content.replace(/await fetch\(\'/g, "await fetchWithAuth('");

// Add fetchWithAuth helper at the bottom
const helper = `

async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const user = auth.currentUser;
  const headers = new Headers(options.headers || {});
  
  if (user) {
    const token = await user.getIdToken();
    headers.set('Authorization', \`Bearer \${token}\`);
  }
  
  headers.set('Content-Type', 'application/json');
  
  const response = await fetch(url, {
    ...options,
    headers
  });
  
  return response;
}
`;
fs.writeFileSync('src/services/geminiService.ts', content + helper);
