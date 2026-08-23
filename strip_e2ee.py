import re

with open('src/types.ts', 'r') as f:
    content = f.read()
    
# Remove isEncrypted, ciphertext, encryptionKeyFingerprint from DirectMessage
content = re.sub(r"\s*ciphertext\?: string;", "", content)
content = re.sub(r"\s*isEncrypted: boolean;", "", content)
content = re.sub(r"\s*encryptionKeyFingerprint\?: string;", "", content)

with open('src/types.ts', 'w') as f:
    f.write(content)
