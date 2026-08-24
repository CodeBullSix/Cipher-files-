import re

with open('src/components/CaseDetailModal.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    "'overview' | 'facts' | 'allegations' | 'theories' | 'ai_analysis' | 'evidence' | 'timeline' | 'rabbithole' | 'discussions'",
    "'overview' | 'facts' | 'allegations' | 'theories' | 'ai_analysis' | 'evidence' | 'timeline' | 'people' | 'organisations' | 'locations' | 'rabbithole' | 'discussions'"
)

with open('src/components/CaseDetailModal.tsx', 'w') as f:
    f.write(content)
