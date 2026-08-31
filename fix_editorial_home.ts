import fs from 'fs';
const path = 'src/components/EditorialHome.tsx';
let content = fs.readFileSync(path, 'utf8');

// replace trendingCases logic
content = content.replace(
  /const trendingCases = cases\.filter\(c =>[\s\S]*?\}\);/m,
  `const featuredCases = cases.filter(c => c.featured).sort((a, b) => (a.featuredOrder || 0) - (b.featuredOrder || 0));
  
  // Collections
  const collections = Array.from(new Set(cases.filter(c => c.editorialCollection).map(c => c.editorialCollection as string)));
  
  const recentlyUpdated = [...cases].sort((a, b) => new Date(b.updatedAt || b.createdAt).getTime() - new Date(a.updatedAt || a.createdAt).getTime()).slice(0, 4);`
);

// replace trending mapping
content = content.replace(/trendingCases\.map/g, 'featuredCases.map');

// replace trending title
content = content.replace(
  /TRENDING INVESTIGATIONS/g,
  'FEATURED INVESTIGATIONS'
);
content = content.replace(
  /Top Forensics & Documented Leaks/g,
  'Editorially Curated Cases'
);
content = content.replace(
  /\{\/\* 2\. SECTION: FEATURED INVESTIGATIONS \*\/\}/, // Wait, I need to check if the replace already replaced the TRENDING comment
  '{/* 2. SECTION: FEATURED INVESTIGATIONS */}' // it was probably replaced by the /TRENDING INVESTIGATIONS/g above, so the comment might be {/* 2. SECTION: FEATURED INVESTIGATIONS */}
);

// Instead of duplicating RECENTLY UPDATED, let's inject CURATED COLLECTIONS before SECTION 4
const collectionsHtml = `
      {/* 3.5. SECTION: CURATED COLLECTIONS */}
      {collections.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 border-b border-gray-800/80 bg-cipher-base/50">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2.5">
              <div className="w-2.5 h-2.5 rounded-full bg-purple-500 animate-pulse"></div>
              <h2 className="font-mono text-base sm:text-lg font-bold text-white tracking-[0.15em] uppercase">
                CURATED COLLECTIONS
              </h2>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {collections.map(col => {
               const colCases = cases.filter(c => c.editorialCollection === col);
               return (
                 <div key={col} className="p-5 rounded-2xl border border-gray-800 bg-cipher-surface flex flex-col hover:border-purple-500/50 transition-colors">
                   <h3 className="font-mono text-lg font-bold text-white mb-2 uppercase tracking-wider">{col}</h3>
                   <p className="text-xs text-gray-400 mb-4">{colCases.length} Documented Investigations</p>
                   <div className="space-y-2 mt-auto">
                     {colCases.slice(0,3).map(c => (
                       <div key={c.id} onClick={() => { onOpenCase(c.id); sound.click(); }} className="text-xs font-mono text-cyan-400 hover:text-cyan-300 cursor-pointer truncate">
                         → {c.title}
                       </div>
                     ))}
                   </div>
                 </div>
               )
            })}
          </div>
        </section>
      )}
`;

content = content.replace(
  /\{\/\* 4\. SECTION: THE RABBIT HOLE \(One Visually Distinctive Section\) \*\/\}/,
  `${collectionsHtml}\n      {/* 4. SECTION: THE RABBIT HOLE (One Visually Distinctive Section) */}`
);

fs.writeFileSync(path, content);
console.log("Updated EditorialHome.tsx carefully");
