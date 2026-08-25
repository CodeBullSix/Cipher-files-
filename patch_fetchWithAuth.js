import fs from 'fs';
let content = fs.readFileSync('src/services/apiService.ts', 'utf8');

const replacement = `async function fetchWithAuth(url: string, options: RequestInit = {}) {
  let headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (auth.authStateReady) {
    await auth.authStateReady();
  }

  if (auth.currentUser) {
    const token = await auth.currentUser.getIdToken();
    headers = { ...headers, Authorization: \`Bearer \${token}\` };
  }

  const response = await fetch(url, { ...options, headers });
  if (!response.ok) {
    if (response.status === 401) {
      throw new Error("AUTHENTICATION REQUIRED");
    }
    throw new Error(\`API error: \${response.statusText} (\${response.status}) on \${url}\`);
  }
  return response.json();
}`;

content = content.replace(/async function fetchWithAuth.*?return response\.json\(\);\s*\}/s, replacement);

fs.writeFileSync('src/services/apiService.ts', content);
