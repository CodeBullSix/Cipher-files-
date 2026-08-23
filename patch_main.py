with open('src/main.tsx', 'r') as f:
    content = f.read()

content = "import { AuthService } from './services/authService';\nAuthService.initAuthListener();\n" + content

with open('src/main.tsx', 'w') as f:
    f.write(content)
