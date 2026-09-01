import fs from 'fs';
const path = 'src/components/CaseDetailModal.tsx';
let content = fs.readFileSync(path, 'utf8');

const featureStatusLogic = `
  const toggleFeatureStatus = async () => {
    try {
      const { ApiService } = await import('../services/apiService');
      const updated = await ApiService.patch(\`/api/cases/\${currentCase.id}/feature\`, {
        featured: !currentCase.featured
      });
      setCurrentCase(prev => ({ ...prev, featured: !prev.featured }));
      sound.blip();
    } catch (error) {
      console.error('Failed to toggle feature status', error);
      sound.error();
    }
  };
`;

content = content.replace(
  /const handleVoteComment = async/,
  `${featureStatusLogic}\n  const handleVoteComment = async`
);

const featureButton = `
            {currentUser && (['MODERATOR', 'ADMIN', 'admin', 'moderator'].includes(currentUser.role)) && (
              <button
                onClick={(e) => { e.stopPropagation(); toggleFeatureStatus(); }}
                className={\`p-1.5 border rounded transition-colors flex items-center gap-1 \${
                  currentCase.featured
                    ? 'border-purple-500/50 bg-purple-500/10 text-purple-400 hover:bg-purple-500/20'
                    : 'border-white/10 hover:bg-white/[0.02] text-gray-400 hover:text-purple-400'
                }\`}
                title={currentCase.featured ? "Unfeature Case" : "Feature Case"}
              >
                <Sparkles className="w-4 h-4" />
                <span className="text-[10px] font-mono hidden sm:inline">{currentCase.featured ? 'FEATURED' : 'FEATURE'}</span>
              </button>
            )}
`;

content = content.replace(
  /            \{currentUser && \(\n              <button\n                onClick=\{\(e\) => \{ e\.stopPropagation\(\); setIsAddingToWorkspace\(true\); \}\}\n                className="p-1\.5 border border-white\/10 rounded hover:bg-white\/\[0\.02\] text-gray-400 hover:text-cipher-accent transition-colors"\n                title="Add to Workspace"\n              >/,
  `${featureButton}\n            {currentUser && (\n              <button\n                onClick={(e) => { e.stopPropagation(); setIsAddingToWorkspace(true); }}\n                className="p-1.5 border border-white/10 rounded hover:bg-white/[0.02] text-gray-400 hover:text-cipher-accent transition-colors"\n                title="Add to Workspace"\n              >`
);

fs.writeFileSync(path, content);
console.log("Updated CaseDetailModal.tsx with feature button");
