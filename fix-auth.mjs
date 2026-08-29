import fs from 'fs';
let content = fs.readFileSync('src/services/authService.ts', 'utf8');

content = content.replace(
  "import { \n  signInWithPopup,\n  signInWithRedirect,",
  "import { \n  signInWithPopup,"
);

const oldLoginCode = `      let result;
      try {
        result = await signInWithPopup(auth, googleProvider);
      } catch (err: any) {
        if (err?.code === 'auth/popup-blocked') {
          console.warn('Popup blocked, falling back to redirect...');
          await signInWithRedirect(auth, googleProvider);
          return null;
        }
        throw err;
      }`;
      
const newLoginCode = `      const result = await signInWithPopup(auth, googleProvider);`;

content = content.replace(oldLoginCode, newLoginCode);

fs.writeFileSync('src/services/authService.ts', content);
