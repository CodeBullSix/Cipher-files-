with open('src/App.tsx', 'r') as f:
    content = f.read()

content = content.replace("import { EvidenceArchiveView } from './components/EvidenceArchiveView.js';", "import { EvidenceArchiveView } from './components/EvidenceArchiveView';")
content = content.replace("import { import {", "import {")

with open('src/App.tsx', 'w') as f:
    f.write(content)
