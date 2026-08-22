with open('src/services/apiService.ts', 'r') as f:
    content = f.read()

content = content.replace(
    "throw new Error(`API error: ${response.statusText}`);",
    "throw new Error(`API error: ${response.statusText} (${response.status}) on ${url}`);"
)

with open('src/services/apiService.ts', 'w') as f:
    f.write(content)
