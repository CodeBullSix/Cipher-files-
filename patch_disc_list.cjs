const fs = require('fs');
const file = 'src/components/DiscussionsView.tsx';
let content = fs.readFileSync(file, 'utf8');

const excerptHtml = `
                      {/* Excerpt */}
                      <p className="text-xs text-gray-300 font-sans line-clamp-2 leading-relaxed mb-3">
                        "{disc.initialComment}"
                      </p>
`;

const newExcerptHtml = `
                      {/* Excerpt */}
                      <p className={\`text-xs font-sans line-clamp-2 leading-relaxed mb-3 \${disc.deletedAt ? 'text-gray-600 italic' : 'text-gray-300'}\`}>
                        {disc.deletedAt ? '[This thread was removed by moderation]' : \`"\${disc.initialComment}"\`}
                      </p>
`;

if (content.includes('"{disc.initialComment}"')) {
  content = content.replace(excerptHtml, newExcerptHtml);
  fs.writeFileSync(file, content);
}
