import re

with open('src/components/DirectMessageModal.tsx', 'r') as f:
    content = f.read()

# find otherRole usage
content = re.sub(r"const otherRole = conv\.participantRoles\?\.\[otherUid\] \|\| 'operative';", "const otherUser = allUsers.find(u => u.uid === otherUid);\n                    const otherRole = otherUser?.role || 'operative';", content)
content = re.sub(r"const otherRole = activeConversation\.participantRoles\?\.\[otherUid\] \|\| 'operative';", "const otherUser = allUsers.find(u => u.uid === otherUid);\n                const otherRole = otherUser?.role || 'operative';", content)

with open('src/components/DirectMessageModal.tsx', 'w') as f:
    f.write(content)
