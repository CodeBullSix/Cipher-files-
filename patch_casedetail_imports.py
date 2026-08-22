with open('src/components/CaseDetailModal.tsx', 'r') as f:
    content = f.read()

if "Database," not in content and "Database" not in content.split("lucide-react")[0]:
    content = content.replace("FileText,", "FileText, Database,")
    with open('src/components/CaseDetailModal.tsx', 'w') as f:
        f.write(content)
