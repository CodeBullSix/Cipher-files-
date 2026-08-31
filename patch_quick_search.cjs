const fs = require('fs');
let content = fs.readFileSync('src/components/QuickSearchModal.tsx', 'utf8');

// Remove the early return
content = content.replace(
  `      if (!query.trim() && selectedTypes.length === 0) {
        setResults([]);
        return;
      }`,
  `      // Allow empty query to fetch recent items for discovery`
);

// Add 'RECENT INTELLIGENCE' header
content = content.replace(
  `<div className="space-y-1">
              {results.map(r => (`,
  `<div className="space-y-1">
              {!query.trim() && selectedTypes.length === 0 && (
                <div className="px-3 py-2 text-[10px] font-mono text-cyan-500/70 font-bold tracking-widest border-b border-white/5 mb-2">
                  RECENT INTELLIGENCE
                </div>
              )}
              {results.map(r => (`
);

// Make the no results message clearer
content = content.replace(
  `<p className="font-mono text-sm">No intelligence matches found.</p>`,
  `<p className="font-mono text-sm">NO MATCHING RECORDS</p>`
);

fs.writeFileSync('src/components/QuickSearchModal.tsx', content);
