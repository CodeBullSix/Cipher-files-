import re

with open('src/components/CaseDetailModal.tsx', 'r') as f:
    content = f.read()

content = content.replace('flex-wrap pb-2', 'overflow-x-auto overflow-y-hidden whitespace-nowrap scrollbar-hide pb-1')

# Add scrollbar-hide to index.css if not there
with open('src/index.css', 'r') as f:
    css = f.read()

if 'scrollbar-hide' not in css:
    with open('src/index.css', 'a') as f:
        f.write("\n.scrollbar-hide::-webkit-scrollbar { display: none; }\n.scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }\n")

with open('src/components/CaseDetailModal.tsx', 'w') as f:
    f.write(content)
