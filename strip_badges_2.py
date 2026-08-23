import re

with open('src/components/DirectMessageModal.tsx', 'r') as f:
    content = f.read()

content = re.sub(r'\{msg\.isEncrypted && \([\s\S]*?\{msg\.encryptionKeyFingerprint\}\s*</span>\s*\)\}', '', content)

with open('src/components/DirectMessageModal.tsx', 'w') as f:
    f.write(content)
