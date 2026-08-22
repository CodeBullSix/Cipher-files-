with open('src/routes/evidence.ts', 'r') as f:
    content = f.read()

import re
content = content.replace("!req.file", "!(req as any).file")
content = content.replace("req.file.filename", "(req as any).file.filename")
content = content.replace("req.file.originalname", "(req as any).file.originalname")
content = content.replace("req.file.mimetype", "(req as any).file.mimetype")
content = content.replace("req.file.size", "(req as any).file.size")

with open('src/routes/evidence.ts', 'w') as f:
    f.write(content)
