const fs = require('fs');
let content = fs.readFileSync('src/components/DirectMessageModal.tsx', 'utf8');

// Left sidebar wrapper
content = content.replace(
  '<div className="w-72 sm:w-80 border-r border-gray-800 bg-[#07090F] flex flex-col">',
  '<div className={`w-full sm:w-80 border-r border-gray-800 bg-[#07090F] flex-col shrink-0 ${activeConversation ? "hidden sm:flex" : "flex"}`}>'
);

// Main chat window
content = content.replace(
  '          {activeConversation ? (',
  '          {activeConversation ? ('
); // just a marker check

content = content.replace(
  '<div className="flex-1 flex flex-col bg-[#050811]">',
  '<div className={`flex-1 flex-col bg-[#050811] ${activeConversation ? "flex" : "hidden sm:flex"}`}>'
);

// Add mobile back button in header
content = content.replace(
  '                  <div className="px-5 py-3 bg-[#080B14] border-b border-gray-800 flex items-center justify-between">',
  `                  <div className="px-5 py-3 bg-[#080B14] border-b border-gray-800 flex items-center justify-between">
                    <button onClick={() => setActiveConversation(null)} className="sm:hidden mr-3 p-1 text-cyan-400">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                    </button>`
);

fs.writeFileSync('src/components/DirectMessageModal.tsx', content);
