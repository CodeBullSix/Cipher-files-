with open('src/components/EvidenceArchiveView.tsx', 'r') as f:
    content = f.read()

import re
# Find the junk and remove it
content = re.sub(r"  // We can remove the old local evidenceItems and just map evidenceItems directly\.\n\n\s*if \(searchQuery\).*?return true;\n\s*\}\);\n", "  // We can remove the old local evidenceItems and just map evidenceItems directly.\n", content, flags=re.DOTALL)

with open('src/components/EvidenceArchiveView.tsx', 'w') as f:
    f.write(content)
