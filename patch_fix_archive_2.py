with open('src/components/EvidenceArchiveView.tsx', 'r') as f:
    content = f.read()

# I will find the exact string to remove
bad_text = """    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      if (!item.title.toLowerCase().includes(q) && !item.description.toLowerCase().includes(q)) return false;
    }
    return true;
  });"""

import re
content = re.sub(r"    if \(searchQuery\) \{.*?return true;\n\s*\}\);", "", content, flags=re.DOTALL)

with open('src/components/EvidenceArchiveView.tsx', 'w') as f:
    f.write(content)
