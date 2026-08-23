import re

with open('src/components/DirectMessageModal.tsx', 'r') as f:
    content = f.read()

# Remove encryptionKey state
content = re.sub(r"const \[encryptionKey, setEncryptionKey\] = useState\('CIPHER_SEC_KEY_ALPHA'\);\n\s*", "", content)

# Remove TacticalCrypto imports and usages
content = re.sub(r"import \{ TacticalCrypto \} from '\.\./utils/crypto';\n", "", content)

# Remove "E2EE ACTIVE" and related header items
content = re.sub(r'<div className="flex items-center gap-1 text-\[10px\] font-mono text-\[\#00E5FF\] animate-pulse">.*?E2EE ACTIVE.*?</div>', '', content, flags=re.DOTALL)
content = re.sub(r'<p className="text-\[11px\] text-gray-400 font-mono">End-to-End Encrypted Terminal • Tactical Operative Comms</p>', '<p className="text-[11px] text-gray-400 font-mono">Secure Channel • Tactical Operative Comms</p>', content)
content = re.sub(r'<span>Key: \{TacticalCrypto\.generateFingerprint\(encryptionKey\)\}</span>', '', content)
content = re.sub(r'Fingerprint: <span className="text-cyan-400">\{TacticalCrypto\.generateFingerprint\(encryptionKey\)\}</span> \(Share with recipient for deciphers\)', '', content)

# Remove senderRole from the message payload
content = re.sub(r'\s*senderRole: currentUser\.role,', '', content)

with open('src/components/DirectMessageModal.tsx', 'w') as f:
    f.write(content)
