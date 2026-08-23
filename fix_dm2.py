import re

with open('src/components/DirectMessageModal.tsx', 'r') as f:
    content = f.read()

content = content.replace('E2EE ACTIVE', 'SECURE CHANNEL')

with open('src/components/DirectMessageModal.tsx', 'w') as f:
    f.write(content)
