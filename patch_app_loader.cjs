const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

if (!content.includes('DECRYPTING DOSSIER')) {
  content = content.replace(
    "{activeCaseFile && (",
    "{isLoadingCase && (\n        <div className=\"fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm\">\n          <div className=\"flex flex-col items-center space-y-4\">\n            <div className=\"w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin\" />\n            <div className=\"text-cyan-500 font-mono text-sm tracking-widest\">DECRYPTING DOSSIER...</div>\n          </div>\n        </div>\n      )}\n\n      {activeCaseFile && ("
  );
  fs.writeFileSync('src/App.tsx', content);
}
