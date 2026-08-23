import re

with open('src/components/EvidenceDetailModal.tsx', 'r') as f:
    content = f.read()

old_a_tag = r'<a\s*href=\{`/api/evidence/documents/\$\{evidence\.document\.storageKey\}`\}\s*target="_blank"\s*rel="noopener noreferrer"\s*className="px-3 py-1\.5 bg-cyan-950/50 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-900 rounded flex items-center gap-2 text-xs font-bold transition-colors"\s*>\s*<Download className="w-4 h-4" />\s*View / Download\s*</a>'

new_button = """<button
                      onClick={(e) => {
                        e.preventDefault();
                        ApiService.downloadDocument(evidence.document!.storageKey, evidence.document!.fileName, evidence.document!.fileType).catch(err => alert(err.message));
                      }}
                      className="px-3 py-1.5 bg-cyan-950/50 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-900 rounded flex items-center gap-2 text-xs font-bold transition-colors cursor-pointer"
                    >
                      <Download className="w-4 h-4" />
                      View / Download
                    </button>"""

content = re.sub(old_a_tag, new_button, content)

if 'ApiService' not in content:
    content = content.replace("import { ArchiveEvidence } from '../types';", "import { ArchiveEvidence } from '../types';\nimport { ApiService } from '../services/apiService';")

with open('src/components/EvidenceDetailModal.tsx', 'w') as f:
    f.write(content)
