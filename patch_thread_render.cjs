const fs = require('fs');
const file = 'src/components/DiscussionsView.tsx';
let content = fs.readFileSync(file, 'utf8');

const activeThreadHtml = `
            {/* Opening Argument Content */}
            <div className="p-4 rounded-lg bg-[#05070D] border border-gray-800 text-sm text-gray-200 font-sans leading-relaxed whitespace-pre-wrap">
              {activeThread.initialComment}
            </div>
`;

const activeThreadDeletedHtml = `
            {/* Opening Argument Content */}
            <div className={\`p-4 rounded-lg bg-[#05070D] border border-gray-800 text-sm font-sans leading-relaxed whitespace-pre-wrap \${activeThread.deletedAt ? 'text-gray-500 italic' : 'text-gray-200'}\`}>
              {activeThread.deletedAt ? '[This thread was removed by moderation]' : activeThread.initialComment}
            </div>
`;

if (content.includes(activeThreadHtml)) {
  content = content.replace(activeThreadHtml, activeThreadDeletedHtml);
  fs.writeFileSync(file, content);
}
