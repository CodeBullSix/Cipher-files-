with open('server.ts', 'r') as f:
    content = f.read()

# We need to extract the app.get('/api/users/:id/contributions'... block from inside start() and put it before start()
import re

match = re.search(r"  app\.get\('/api/users/:id/contributions'[\s\S]*?}\);", content)
if match:
    block = match.group(0)
    # Remove it from where it is
    content = content.replace(block, "")
    
    # Put it right before async function start()
    content = content.replace("async function start() {", block + "\n\nasync function start() {")
    
    with open('server.ts', 'w') as f:
        f.write(content)
    print("Fixed contributions route")
else:
    print("Could not find contributions route")
