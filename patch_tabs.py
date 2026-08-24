import re

with open('src/components/CaseDetailModal.tsx', 'r') as f:
    content = f.read()

# Replace hidden sm:inline with just the span text for the new tabs
content = content.replace('<span className="hidden sm:inline">People</span>', '<span>People</span>')
content = content.replace('<span className="hidden sm:inline">Organisations</span>', '<span>Organisations</span>')
content = content.replace('<span className="hidden sm:inline">Locations</span>', '<span>Locations</span>')

# Update the scroll container
content = content.replace('overflow-x-auto scrollbar-none', 'overflow-x-auto custom-scrollbar pb-1')

with open('src/components/CaseDetailModal.tsx', 'w') as f:
    f.write(content)
