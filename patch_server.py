import re

with open('server.ts', 'r') as f:
    content = f.read()

if "import { relationshipsRoutes }" not in content:
    content = content.replace(
        "import { investigationRoutes } from './src/routes/investigation.js';",
        "import { investigationRoutes } from './src/routes/investigation.js';\nimport { relationshipsRoutes } from './src/routes/relationships.js';"
    )

    content = content.replace(
        "app.use('/api/investigation', investigationRoutes);",
        "app.use('/api/investigation', investigationRoutes);\napp.use('/api/relationships', relationshipsRoutes);"
    )

with open('server.ts', 'w') as f:
    f.write(content)
