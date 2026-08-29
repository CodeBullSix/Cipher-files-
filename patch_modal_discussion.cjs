const fs = require('fs');
const file = 'src/components/InvestigatorProfileModal.tsx';
let content = fs.readFileSync(file, 'utf8');

// modify props
content = content.replace(
  "onOpenEntity?: (type: string, id: string) => void;",
  "onOpenEntity?: (type: string, id: string) => void;\n  onOpenDiscussion?: (id: string) => void;"
);

content = content.replace(
  "onOpenEntity,",
  "onOpenEntity,\n  onOpenDiscussion,"
);

// Add DISCUSSION logic
content = content.replace(
  "{c.recordType === 'CASE' && (",
  `{c.recordType === 'DISCUSSION' && (
                            <button onClick={() => { if(onOpenDiscussion) onOpenDiscussion(c.recordId); onClose(); }} className={\`text-[10px] font-mono \${currentTheme.text} hover:underline flex items-center gap-1\`}>
                              <ArrowRight className="w-3 h-3" /> View Discussion
                            </button>
                          )}
                          {c.recordType === 'CASE' && (`
);

// Also add a close to the others
content = content.replace(/if\(onOpenEntity\) onOpenEntity\('person', c.recordId\);/g, "if(onOpenEntity) { onOpenEntity('person', c.recordId); onClose(); }");
content = content.replace(/if\(onOpenEntity\) onOpenEntity\('organisation', c.recordId\);/g, "if(onOpenEntity) { onOpenEntity('organisation', c.recordId); onClose(); }");
content = content.replace(/if\(onOpenEntity\) onOpenEntity\('location', c.recordId\);/g, "if(onOpenEntity) { onOpenEntity('location', c.recordId); onClose(); }");
content = content.replace(/if\(onOpenEntity\) onOpenEntity\('evidence', c.recordId\);/g, "if(onOpenEntity) { onOpenEntity('evidence', c.recordId); onClose(); }");
content = content.replace(/if\(onOpenCase\) window\.onOpenCase\(c.recordId\);/g, "if(onOpenCase) { onOpenCase(c.recordId); onClose(); }");
content = content.replace(/if\(onOpenCase\) onOpenCase\(c.recordId\);/g, "if(onOpenCase) { onOpenCase(c.recordId); onClose(); }");

fs.writeFileSync(file, content);
