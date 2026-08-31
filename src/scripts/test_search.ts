import { globalSearch } from '../db/search.js';
async function run() {
  const r = await globalSearch({ query: 'Oswald' });
  console.log(r);
  process.exit(0);
}
run().catch(console.error);
