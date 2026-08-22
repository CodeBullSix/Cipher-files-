with open('src/components/CaseDetailModal.tsx', 'r') as f:
    content = f.read()

content = content.replace("ApiService.getEvidence(caseFile.id)", "ApiService.getEvidence({ caseFileId: caseFile.id })")
content = content.replace(".then(data => setCaseEvidence(data))", ".then(data => setCaseEvidence(data.items || data))")

with open('src/components/CaseDetailModal.tsx', 'w') as f:
    f.write(content)
