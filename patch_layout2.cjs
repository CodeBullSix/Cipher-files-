const fs = require('fs');
let content = fs.readFileSync('src/components/RabbitHoleGraph.tsx', 'utf8');

const oldClass2 = 'absolute top-20 right-4 z-30 w-80 border border-amber-500/50 bg-[#0D0D0D]/95 backdrop-blur-md p-4 shadow-2xl text-white animate-in slide-in-from-right-4 duration-150';

const newClass2 = 'absolute bottom-0 left-0 right-0 sm:left-auto sm:top-24 sm:right-4 z-30 w-full sm:w-80 border-t sm:border border-amber-500/50 bg-[#0D0D0D]/95 backdrop-blur-md p-4 shadow-2xl text-white animate-in slide-in-from-bottom-4 sm:slide-in-from-right-4 duration-150 pb-8 sm:pb-4 rounded-t-xl sm:rounded';

content = content.replace(oldClass2, newClass2);
fs.writeFileSync('src/components/RabbitHoleGraph.tsx', content);
