import re

with open('server.ts', 'r') as f:
    content = f.read()

content = content.replace("import { investigationRoutes } from './src/routes/investigation.js';",
    "import { investigationRoutes } from './src/routes/investigation.js';\nimport { relationshipsRoutes } from './src/routes/relationships.js';")

with open('server.ts', 'w') as f:
    f.write(content)
