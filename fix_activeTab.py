with open('src/components/AdminConsoleModal.tsx', 'r') as f:
    content = f.read()

import re

# find the reviewEvidence state and useEffect, and move it below activeTab
pattern = r"(\s*const \[reviewEvidence, setReviewEvidence\].*?\}, \[isOpen, activeTab\]\);\n)(\s*const \[activeTab, setActiveTab\] = useState.*?\n)"
replacement = r"\2\1"

content = re.sub(pattern, replacement, content, flags=re.DOTALL)

with open('src/components/AdminConsoleModal.tsx', 'w') as f:
    f.write(content)
