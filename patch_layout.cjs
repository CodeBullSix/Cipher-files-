const fs = require('fs');
let content = fs.readFileSync('src/components/RabbitHoleGraph.tsx', 'utf8');

const oldClass = 'absolute right-4 top-20 sm:top-24 w-[320px] max-w-[calc(100vw-2rem)] bg-[#0A0A0A]/95 border border-[#00E5FF]/40 shadow-[0_0_20px_rgba(0,229,255,0.15)] flex flex-col z-30 pointer-events-auto rounded max-h-[calc(100vh-140px)] overflow-y-auto';

const newClass = 'absolute bottom-0 left-0 right-0 sm:left-auto sm:right-4 sm:top-24 w-full sm:w-[320px] bg-[#0A0A0A]/95 border-t sm:border-t-0 sm:border border-[#00E5FF]/40 shadow-[0_0_20px_rgba(0,229,255,0.15)] flex flex-col z-30 pointer-events-auto rounded-t-xl sm:rounded max-h-[50vh] sm:max-h-[calc(100vh-140px)] overflow-y-auto pb-6 sm:pb-0';

content = content.replace(oldClass, newClass);

fs.writeFileSync('src/components/RabbitHoleGraph.tsx', content);
