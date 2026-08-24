import { db } from './src/db/index.js';
import { getPeople } from './src/db/investigation.js';

async function main() {
  try {
    const res = await getPeople(undefined, "some-id");
    console.log("Success, returned length:", res.length);
  } catch (e) {
    console.error("FAIL:", e);
  }
}
main();
