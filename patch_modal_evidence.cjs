const fs = require('fs');
const file = 'src/components/InvestigatorProfileModal.tsx';
let content = fs.readFileSync(file, 'utf8');

// replace the props definition to allow string types
content = content.replace(
  "onOpenEntity?: (type: 'person' | 'organisation' | 'location', id: string) => void;",
  "onOpenEntity?: (type: string, id: string) => void;"
);

// Add EVIDENCE, DISCUSSION logic
content = content.replace(
  "{c.recordType === 'CASE' && (",
  `{c.recordType === 'EVIDENCE' && (
                            <button onClick={() => { if(onOpenEntity) onOpenEntity('evidence', c.recordId); }} className={\`text-[10px] font-mono \${currentTheme.text} hover:underline flex items-center gap-1\`}>
                              <ArrowRight className="w-3 h-3" /> View Evidence
                            </button>
                          )}
                          {c.recordType === 'CASE' && (`
);

fs.writeFileSync(file, content);
