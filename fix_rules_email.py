import re

with open('firestore.rules', 'r') as f:
    content = f.read()

# Fix isAdmin() to not check the hardcoded email
old_is_admin = r"""function isAdmin\(\) \{\s*return isSignedIn\(\) && \(\s*exists\(/databases/\$\(database\)/documents/admins/\$\(request\.auth\.uid\)\) \|\|\s*\(request\.auth\.token\.email != null && request\.auth\.token\.email == 'ajsteptoe123@gmail\.com'\)\s*\);\s*\}"""
new_is_admin = """function isAdmin() {\n      return isSignedIn() && exists(/databases/$(database)/documents/admins/$(request.auth.uid));\n    }"""

content = re.sub(old_is_admin, new_is_admin, content)

with open('firestore.rules', 'w') as f:
    f.write(content)
