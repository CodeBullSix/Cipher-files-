const endpoints = [
  '/api/evidence',
  '/api/evidence?status=UNDER_REVIEW',
  '/api/evidence?caseFileId=aatip-pentagon-uap'
];
async function check() {
  for (const endpoint of endpoints) {
    const res = await fetch(`http://localhost:3000${endpoint}`);
    console.log(endpoint, res.status, res.statusText);
  }
}
check();
