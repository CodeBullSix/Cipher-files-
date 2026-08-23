import re

with open('src/components/AdminConsoleModal.tsx', 'r') as f:
    content = f.read()

content = content.replace("<li>Direct messages transmitted with cryptographic signatures & client-side deciphering keys.</li>", "<li>Direct messages transmitted over secure TLS connections.</li>")

with open('src/components/AdminConsoleModal.tsx', 'w') as f:
    f.write(content)
