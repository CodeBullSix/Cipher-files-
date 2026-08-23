import re

with open('src/services/firestoreService.ts', 'r') as f:
    content = f.read()

content = re.sub(r"import \{ TacticalCrypto \} from '\.\./utils/crypto';\n", "", content)
# Fix lastMessage setting
content = re.sub(r"message\.isEncrypted \? '🔐 \[SECURE MESSAGE\]' : message\.content\.substring\(0, 80\)", "message.content.substring(0, 80)", content)

with open('src/services/firestoreService.ts', 'w') as f:
    f.write(content)
