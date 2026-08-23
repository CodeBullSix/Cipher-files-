import re

with open('src/components/DirectMessageModal.tsx', 'r') as f:
    content = f.read()

import_str = "import { ApiService } from '../services/apiService';\n"
if "ApiService" not in content:
    content = import_str + content

content = content.replace("AuthService.getAllUsers().then", "ApiService.getUsers().then")

with open('src/components/DirectMessageModal.tsx', 'w') as f:
    f.write(content)
