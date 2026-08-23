import re

with open('src/components/DirectMessageModal.tsx', 'r') as f:
    content = f.read()

input_regex = r'<input\s*type="password"\s*value=\{encryptionKey\}\s*onChange=\{\(e\) => setEncryptionKey\(e\.target\.value\)\}[\s\S]*?/>'
content = re.sub(input_regex, "", content)

with open('src/components/DirectMessageModal.tsx', 'w') as f:
    f.write(content)
