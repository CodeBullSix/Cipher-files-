import fs from 'fs';
let content = fs.readFileSync('src/services/authService.ts', 'utf8');
content = content.replace(
  "import { \n  signInWithPopup,",
  "import { \n  signInWithPopup,\n  signInWithRedirect,"
);
content = content.replace(
  "      const result = await signInWithPopup(auth, googleProvider);",
  `      let result;
      try {
        result = await signInWithPopup(auth, googleProvider);
      } catch (err: any) {
        if (err?.code === 'auth/popup-blocked') {
          console.warn('Popup blocked, falling back to redirect...');
          await signInWithRedirect(auth, googleProvider);
          return null;
        }
        throw err;
      }`
);
fs.writeFileSync('src/services/authService.ts', content);
