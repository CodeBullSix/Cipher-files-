import fs from 'fs';
let content = fs.readFileSync('src/components/RabbitHoleGraph.tsx', 'utf8');

const overlayCode = `
      {/* States Overlay */}
      {error && (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-[#050505]/90 backdrop-blur-sm pointer-events-none">
          <div className="border border-red-500/50 bg-red-950/80 p-6 max-w-md text-center shadow-2xl">
            <h3 className="text-red-400 font-mono font-bold text-sm mb-2">NEXUS CONNECTION FAILURE</h3>
            <p className="text-red-200/70 text-xs font-mono">{error}</p>
          </div>
        </div>
      )}

      {!loading && !error && nodes.length === 0 && (
        <div className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none">
          <div className="border border-[#00E5FF]/30 bg-[#0D0D0D]/90 p-6 max-w-md text-center shadow-2xl">
            <h3 className="text-[#00E5FF] font-mono font-bold text-sm mb-2">NO CONNECTIONS DETECTED</h3>
            <p className="text-white/60 text-xs font-mono">No nodes available for the current query parameters.</p>
          </div>
        </div>
      )}

      {/* SVG Canvas */}
`;

content = content.replace("{/* SVG Canvas */}", overlayCode);
fs.writeFileSync('src/components/RabbitHoleGraph.tsx', content);
