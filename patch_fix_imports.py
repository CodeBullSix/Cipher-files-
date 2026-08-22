with open('src/components/EvidenceArchiveView.tsx', 'r') as f:
    content = f.read()

content = content.replace("import { SubmitEvidenceModal }\nimport { EvidenceDetailModal } from './SubmitEvidenceModal';", "import { SubmitEvidenceModal } from './SubmitEvidenceModal';\nimport { EvidenceDetailModal } from './EvidenceDetailModal';")

with open('src/components/EvidenceArchiveView.tsx', 'w') as f:
    f.write(content)
