import re
import os

def replace_in_file(filepath, replacements):
    if not os.path.exists(filepath): return
    with open(filepath, 'r') as f:
        content = f.read()
    
    for old, new in replacements:
        content = content.replace(old, new)
        
    with open(filepath, 'w') as f:
        f.write(content)

replace_in_file('src/components/AdminConsoleModal.tsx', [
    ('AES-PGP v4.2 ECC', 'SECURE CHANNEL / TLS')
])

replace_in_file('src/components/SupportersView.tsx', [
    ('encrypted communication nodes', 'secure communication nodes')
])

replace_in_file('src/components/Navbar.tsx', [
    ('Encrypted Messages', 'Secure Messages')
])

replace_in_file('src/components/InvestigatorProfileModal.tsx', [
    ('Radio & classified encrypted tag.', 'Radio & classified secure tag.')
])

replace_in_file('src/components/CaseDetailModal.tsx', [
    ('Open encrypted direct communication with author', 'Open secure direct communication with author')
])

replace_in_file('src/App.tsx', [
    ('E2E Cryptographic Terminal', 'SECURE CHANNEL / TLS')
])

# For firestoreService.ts
replace_in_file('src/services/firestoreService.ts', [
    ("message.isEncrypted ? '🔐 [ENCRYPTED DATA PACKET]' : message.content.substring(0, 80)", "message.isEncrypted ? '🔐 [SECURE MESSAGE]' : message.content.substring(0, 80)")
])
