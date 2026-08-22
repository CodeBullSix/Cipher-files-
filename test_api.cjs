const http = require('http');

const endpoints = [
  '/api/cases',
  '/api/discussions',
  '/api/users/me',
  '/api/evidence',
  '/api/evidence/sources'
];

async function check() {
  for (const endpoint of endpoints) {
    try {
      const res = await fetch(`http://localhost:3000${endpoint}`);
      if (!res.ok) {
         console.log(`${endpoint} returned ${res.status} ${res.statusText}`);
      } else {
         console.log(`${endpoint} OK`);
      }
    } catch (e) {
      console.log(`Failed to fetch ${endpoint}:`, e.message);
    }
  }
}
check();
