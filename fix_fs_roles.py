import re

with open('src/services/firestoreService.ts', 'r') as f:
    content = f.read()

content = re.sub(r"\s*participantRoles: \{\s*\[currentProfile\.uid\]: currentProfile\.role,\s*\[recipient\.uid\]: recipient\.role\s*\},", "", content)

with open('src/services/firestoreService.ts', 'w') as f:
    f.write(content)

with open('src/types.ts', 'r') as f:
    content = f.read()

content = re.sub(r"\s*participantRoles\?: Record<string, UserRole>;", "", content)

with open('src/types.ts', 'w') as f:
    f.write(content)
