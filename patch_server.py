import re

with open('server.ts', 'r') as f:
    content = f.read()

import_statement = "import investigationRoutes from './src/routes/investigation.js';\n"
content = content.replace("import evidenceRoutes from './src/routes/evidence.js';", "import evidenceRoutes from './src/routes/evidence.js';\n" + import_statement)

route_statement = "app.use('/api/investigation', investigationRoutes);\n"
content = content.replace("app.use('/api/evidence', evidenceRoutes);", "app.use('/api/evidence', evidenceRoutes);\n" + route_statement)

with open('server.ts', 'w') as f:
    f.write(content)
