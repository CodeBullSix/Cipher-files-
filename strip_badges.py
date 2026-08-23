import re

with open('src/components/DirectMessageModal.tsx', 'r') as f:
    content = f.read()

# Remove the isEncrypted badge
content = re.sub(r'\{msg\.isEncrypted && \([\s\S]*?CIPHERED[\s\S]*?\)\}</div>', '</div>', content)
content = re.sub(r'\{msg\.isEncrypted && \([\s\S]*?</svg>[\s\S]*?\{msg\.encryptionKeyFingerprint\}[\s\S]*?\)\}', '', content)
content = re.sub(r'\{msg\.isEncrypted && msg\.ciphertext && \([\s\S]*?\{msg\.ciphertext\}[\s\S]*?\)\}', '', content)

with open('src/components/DirectMessageModal.tsx', 'w') as f:
    f.write(content)
