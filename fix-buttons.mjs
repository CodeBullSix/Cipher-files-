import fs from 'fs';

let content = fs.readFileSync('src/components/CaseDetailModal.tsx', 'utf8');
if (!content.includes('FolderArchive')) {
  // also add FolderArchive to lucide-react imports if missing
  content = content.replace("import { \n  X,", "import { \n  FolderArchive,\n  X,");
  
  content = content.replace(
    `            <button\n              onClick={onClose}`,
    `            {currentUser && (
              <button
                onClick={(e) => { e.stopPropagation(); setIsAddingToWorkspace(true); }}
                className="p-1.5 border border-white/10 rounded hover:bg-white/[0.02] text-gray-400 hover:text-cyan-400 transition-colors"
                title="Add to Workspace"
              >
                <FolderArchive className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={onClose}`
  );
  fs.writeFileSync('src/components/CaseDetailModal.tsx', content);
}

let content2 = fs.readFileSync('src/components/EvidenceDetailModal.tsx', 'utf8');
if (!content2.includes('FolderArchive')) {
  content2 = content2.replace("import { X,", "import { FolderArchive, X,");
  content2 = content2.replace(
    `            <button\n              onClick={onClose}`,
    `            {currentUser && (
              <button
                onClick={(e) => { e.stopPropagation(); setIsAddingToWorkspace(true); }}
                className="p-1.5 border border-white/10 rounded hover:bg-white/[0.02] text-gray-400 hover:text-cyan-400 transition-colors"
                title="Add to Workspace"
              >
                <FolderArchive className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={onClose}`
  );
  fs.writeFileSync('src/components/EvidenceDetailModal.tsx', content2);
}

