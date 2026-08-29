import fs from 'fs';
let content = fs.readFileSync('src/components/EntityProfileModal.tsx', 'utf8');

if (!content.includes('setIsAddingToWorkspace')) {
  content = content.replace(
    `            <button onClick={() => { onClose(); sound.click(); }}`,
    `            {currentUser && (
              <button
                onClick={(e) => { e.stopPropagation(); setIsAddingToWorkspace(true); }}
                className="p-1 text-gray-400 hover:text-cyan-400 transition-colors mr-2"
                title="Add to Workspace"
              >
                <FolderArchive className="w-5 h-5" />
              </button>
            )}
            <button onClick={() => { onClose(); sound.click(); }}`
  );
  fs.writeFileSync('src/components/EntityProfileModal.tsx', content);
}
