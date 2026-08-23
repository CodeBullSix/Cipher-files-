import re

with open('src/lib/firebase-admin.ts', 'r') as f:
    content = f.read()

content = content.replace("import { getAuth } from 'firebase-admin/auth';", "import { getAuth } from 'firebase-admin/auth';\nimport { getFirestore } from 'firebase-admin/firestore';")
content = content.replace("export const adminAuth = getAuth();", "export const adminAuth = getAuth();\nexport const adminDb = getFirestore();")

with open('src/lib/firebase-admin.ts', 'w') as f:
    f.write(content)
