import { globalSearch } from './src/db/search.js';
(async () => {
  try {
    const res = await globalSearch({ query: 'test' });
    console.log(res.length);
  } catch (err) {
    console.error("SEARCH BACKEND ERROR:", err);
  }
  process.exit(0);
})();
