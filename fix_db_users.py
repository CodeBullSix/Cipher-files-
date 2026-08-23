import re

with open('src/db/users.ts', 'r') as f:
    content = f.read()

# Replace hardcoded admin email check with a safer one, checking process.env.ADMIN_EMAIL
# Since we might not have process.env.ADMIN_EMAIL, we should just assign 'USER', unless they exist in the admins table...
# But in our setup, it's fine to rely on a generic check, or no automatic admin for now, or use process.env.
old_role_check = r"const role = \(email\.toLowerCase\(\) === 'ajsteptoe123@gmail\.com'\) \? 'ADMIN' : 'USER';"
new_role_check = "const role = (process.env.ADMIN_EMAIL && email.toLowerCase() === process.env.ADMIN_EMAIL.toLowerCase()) ? 'ADMIN' : 'USER';"

content = re.sub(old_role_check, new_role_check, content)

with open('src/db/users.ts', 'w') as f:
    f.write(content)
