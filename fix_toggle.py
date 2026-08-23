import re

with open('src/components/DirectMessageModal.tsx', 'r') as f:
    content = f.read()

# Remove the button block
button_regex = r"<button\s*onClick=\{\(\) => setIsEncrypted\(!isEncrypted\)\}[\s\S]*?</button>"
content = re.sub(button_regex, "", content)

# Remove the encryption key input
input_regex = r'<input\s*type="text"\s*value=\{encryptionKey\}\s*onChange=\{\(e\) => setEncryptionKey\(e\.target\.value\)\}[\s\S]*?/>'
content = re.sub(input_regex, "", content)

with open('src/components/DirectMessageModal.tsx', 'w') as f:
    f.write(content)
