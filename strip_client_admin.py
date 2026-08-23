import re

with open('src/services/authService.ts', 'r') as f:
    content = f.read()

# Replace isAdmin check and ADMIN_BOOTSTRAP_EMAIL usage in fallback profile
fallback_old = r"const isAdmin = user\.email\?\.toLowerCase\(\) === ADMIN_BOOTSTRAP_EMAIL\.toLowerCase\(\);"
content = re.sub(fallback_old, "const isAdmin = false; // Determined by server", content)

with open('src/services/authService.ts', 'w') as f:
    f.write(content)
