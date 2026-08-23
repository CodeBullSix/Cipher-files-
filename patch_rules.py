with open('firestore.rules', 'r') as f:
    content = f.read()

content = content.replace("allow get, list: if isSignedIn();", "allow get: if isOwner(userId) || isAdmin() || isModerator();\n      allow list: if isAdmin();")

with open('firestore.rules', 'w') as f:
    f.write(content)
