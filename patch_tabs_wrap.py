import re

with open('src/components/CaseDetailModal.tsx', 'r') as f:
    content = f.read()

# Replace overflow-x-auto with flex-wrap
content = content.replace('overflow-x-auto custom-scrollbar pb-1', 'flex-wrap pb-2')

with open('src/components/CaseDetailModal.tsx', 'w') as f:
    f.write(content)
