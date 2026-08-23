import re

with open('src/components/DirectMessageModal.tsx', 'r') as f:
    content = f.read()

content = re.sub(r"import \{ TacticalCrypto \} from '\.\./utils/crypto';\n", "", content)

# Remove isEncrypted state
content = re.sub(r"\s*const \[isEncrypted, setIsEncrypted\] = useState\(true\);\n", "\n", content)
content = re.sub(r"\s*const \[encryptionKey\] = useState\('CIPHER-ZERO-TRUST-001'\);\n", "\n", content)

# Fix handleSendMessage
msg_creation_old = """    const { ciphertext, fingerprint } = isEncrypted 
      ? TacticalCrypto.encrypt(plain, encryptionKey)
      : { ciphertext: undefined, fingerprint: undefined };

    const newMsg: DirectMessage = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      conversationId: activeConversation.id,
      senderUid: currentUser.uid,
      senderName: currentUser.displayName,
      senderCallsign: currentUser.callsign,
      senderRole: currentUser.role,
      content: plain,
      ciphertext,
      isEncrypted,
      encryptionKeyFingerprint: fingerprint,
      attachmentUrl: attachedImage || undefined,
      createdAt: new Date().toISOString()
    };"""

msg_creation_new = """    const newMsg: DirectMessage = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      conversationId: activeConversation.id,
      senderUid: currentUser.uid,
      senderName: currentUser.displayName,
      senderCallsign: currentUser.callsign,
      senderRole: currentUser.role,
      content: plain,
      attachmentUrl: attachedImage || undefined,
      createdAt: new Date().toISOString()
    };"""

content = content.replace(msg_creation_old, msg_creation_new)

# Find and remove header E2EE block
header_e2ee = r"""\s*<div className="px-4 py-2 bg-black border-b border-gray-800 flex items-center justify-between">.*?</div>"""
content = re.sub(header_e2ee, "", content, flags=re.DOTALL)

# Find and remove message toggle
msg_toggle = r"""\s*<button\s*type="button"\s*onClick=\{.*?setIsEncrypted\(!isEncrypted\)\}.*?</button>"""
content = re.sub(msg_toggle, "", content, flags=re.DOTALL)

# Replace decrypted rendering
# `const decrypted = msg.isEncrypted && msg.ciphertext ... : msg.content;`
decrypted_regex = r"\s*const decrypted = msg\.isEncrypted && msg\.ciphertext\s*\?\s*TacticalCrypto\.decrypt\(msg\.ciphertext, encryptionKey\)\s*:\s*msg\.content;"
content = re.sub(decrypted_regex, "\n                    const decrypted = msg.content;", content, flags=re.DOTALL)

# Remove `isEncrypted ? "Compose encrypted dispatch..." : "Compose unencrypted dispatch..."`
content = content.replace('placeholder={isEncrypted ? "Compose encrypted dispatch..." : "Compose unencrypted dispatch..."}', 'placeholder="Compose secure dispatch..."')

# Remove `msg.isEncrypted && ...` badges
badge1 = r"""\s*\{msg\.isEncrypted && \(\s*<div className="flex items-center gap-1 text-\[9px\] text-gray-500 font-mono mt-1 opacity-50">\s*<Lock className="w-2\.5 h-2\.5" />\s*<span>CIPHERED</span>\s*</div>\s*\)\}"""
content = re.sub(badge1, "", content, flags=re.DOTALL)

badge2 = r"""\s*\{msg\.isEncrypted && msg\.ciphertext && \(\s*<div className="mt-1 text-\[8px\] text-gray-600 font-mono break-all leading-tight opacity-30 cursor-crosshair" title="Raw AES-256-GCM Payload">\s*\{msg\.ciphertext\}\s*</div>\s*\)\}"""
content = re.sub(badge2, "", content, flags=re.DOTALL)

with open('src/components/DirectMessageModal.tsx', 'w') as f:
    f.write(content)
