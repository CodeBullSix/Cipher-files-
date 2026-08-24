import re

with open('src/components/EntitiesView.tsx', 'r') as f:
    content = f.read()
content = content.replace("import { sound } from '../utils/sound';", "import { sound } from '../utils/audio';")
with open('src/components/EntitiesView.tsx', 'w') as f:
    f.write(content)

with open('src/components/EntityModal.tsx', 'r') as f:
    content = f.read()
content = content.replace("import { sound } from '../utils/sound';", "import { sound } from '../utils/audio';")
with open('src/components/EntityModal.tsx', 'w') as f:
    f.write(content)

with open('src/components/CaseDetailModal.tsx', 'r') as f:
    content = f.read()

# Add EntitiesView
if 'import { EntitiesView }' not in content:
    content = content.replace("import { EvidenceDetailModal }", "import { EntitiesView } from './EntitiesView';\nimport { EvidenceDetailModal }")

# Add icons: User, Building, MapPin
if 'User, ' not in content:
    content = content.replace("AlertTriangle, \n", "AlertTriangle, \n  User, \n  Building, \n  MapPin, \n")

with open('src/components/CaseDetailModal.tsx', 'w') as f:
    f.write(content)

