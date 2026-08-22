with open('src/components/CaseDetailModal.tsx', 'r') as f:
    content = f.read()

content = content.replace("currentCase.relatedEntities", "currentCase.entities")

with open('src/components/CaseDetailModal.tsx', 'w') as f:
    f.write(content)
