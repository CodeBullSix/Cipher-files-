import re

with open('src/services/authService.ts', 'r') as f:
    content = f.read()

# Remove ADMIN_BOOTSTRAP_EMAIL
content = re.sub(r"export const ADMIN_BOOTSTRAP_EMAIL = 'ajsteptoe123@gmail\.com';\n", "", content)

# Remove other usages if any
content = re.sub(r"const isAdmin = user\.email\?\.toLowerCase\(\) === ADMIN_BOOTSTRAP_EMAIL\.toLowerCase\(\);", "const isAdmin = false; // Derived server-side", content)

with open('src/services/authService.ts', 'w') as f:
    f.write(content)
