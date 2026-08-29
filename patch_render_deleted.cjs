const fs = require('fs');
const file = 'src/components/DiscussionsView.tsx';
let content = fs.readFileSync(file, 'utf8');

const contentRenderHtml = `
          {/* Content */}
          <p className="text-xs sm:text-sm text-gray-200 font-sans leading-relaxed whitespace-pre-wrap">
            {comment.content}
          </p>
`;

const newContentRenderHtml = `
          {/* Content */}
          <p className={\`text-xs sm:text-sm font-sans leading-relaxed whitespace-pre-wrap \${comment.deletedAt ? 'text-gray-500 italic' : 'text-gray-200'}\`}>
            {comment.deletedAt ? '[This comment was removed by moderation]' : comment.content}
          </p>
`;

if (!content.includes('[This comment was removed by moderation]')) {
  content = content.replace(contentRenderHtml, newContentRenderHtml);
  fs.writeFileSync(file, content);
}
