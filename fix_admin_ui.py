import re

with open('src/components/AdminConsoleModal.tsx', 'r') as f:
    content = f.read()

# Replace hardcoded email checks
content = re.sub(r"currentUser\?\.role === 'admin' \|\| currentUser\?\.email === 'ajsteptoe123@gmail\.com'", "currentUser?.role === 'admin'", content)
content = re.sub(r"alert\('Only Primary Admin \(ajsteptoe123@gmail\.com\) can adjust investigator security clearances\.'\);", "alert('Only administrators can adjust investigator security clearances.');", content)
content = re.sub(r"\{isAdmin && u\.email !== 'ajsteptoe123@gmail\.com' \? \(", "{isAdmin ? (", content)
content = re.sub(r"\{u\.email !== 'ajsteptoe123@gmail\.com' && \(", "{true && (", content)
content = re.sub(r"<span>ajsteptoe123@gmail\.com</span>", "", content)

with open('src/components/AdminConsoleModal.tsx', 'w') as f:
    f.write(content)

with open('src/components/Navbar.tsx', 'r') as f:
    content = f.read()
content = re.sub(r"currentUser\?\.role === 'admin' \|\| currentUser\?\.email === 'ajsteptoe123@gmail\.com'", "currentUser?.role === 'admin'", content)
with open('src/components/Navbar.tsx', 'w') as f:
    f.write(content)
