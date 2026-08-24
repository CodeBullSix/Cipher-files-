import re

with open('src/components/CaseDetailModal.tsx', 'r') as f:
    content = f.read()

content = content.replace('overflow-x-auto overflow-y-hidden whitespace-nowrap scrollbar-hide pb-1', 'overflow-x-auto overflow-y-hidden whitespace-nowrap custom-scrollbar pb-2')

with open('src/components/CaseDetailModal.tsx', 'w') as f:
    f.write(content)
