const fs = require('fs');
let content = fs.readFileSync('src/db/search.ts', 'utf8');

const replacement = `
  // Sort by relevance, then timestamp
  results.sort((a, b) => {
    let scoreA = 0;
    let scoreB = 0;
    
    if (filter.query) {
      const qLower = filter.query.toLowerCase();
      const aTitleLower = (a.title || '').toLowerCase();
      const bTitleLower = (b.title || '').toLowerCase();
      
      // Exact match
      if (aTitleLower === qLower) scoreA += 100;
      if (bTitleLower === qLower) scoreB += 100;
      
      // Prefix match
      if (aTitleLower.startsWith(qLower)) scoreA += 50;
      if (bTitleLower.startsWith(qLower)) scoreB += 50;
      
      // In title match
      if (aTitleLower.includes(qLower)) scoreA += 20;
      if (bTitleLower.includes(qLower)) scoreB += 20;
    }

    if (scoreA !== scoreB) {
      return scoreB - scoreA;
    }

    const timeA = a.timestamp ? new Date(a.timestamp).getTime() : 0;
    const timeB = b.timestamp ? new Date(b.timestamp).getTime() : 0;
    return (isNaN(timeB) ? 0 : timeB) - (isNaN(timeA) ? 0 : timeA);
  });
`;

content = content.replace(/  \/\/ Sort by some heuristic[\s\S]*?return \(isNaN\(timeB\) \? 0 : timeB\) - \(isNaN\(timeA\) \? 0 : timeA\);\n  \}\);/g, replacement);

fs.writeFileSync('src/db/search.ts', content);
