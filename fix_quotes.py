with open('src/services/apiService.ts', 'r') as f:
    content = f.read()

content = content.replace("method: \\'POST\\'", "method: 'POST'")
with open('src/services/apiService.ts', 'w') as f:
    f.write(content)
