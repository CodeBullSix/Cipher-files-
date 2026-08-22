with open('src/components/DiscussionsView.tsx', 'r') as f:
    content = f.read()

import re

# insert state declarations
states_to_add = """
  const [threadEvidence, setThreadEvidence] = useState<any[]>([]);
  const [selectedArchiveEvidence, setSelectedArchiveEvidence] = useState<any | null>(null);
  const [newDiscussionEvidence, setNewDiscussionEvidence] = useState<any[]>([]);
"""
content = re.sub(r"const \[threadComments, setThreadComments\] = useState<Comment\[\]>\(\[\]\);", "const [threadComments, setThreadComments] = useState<Comment[]>([]);" + states_to_add, content)

with open('src/components/DiscussionsView.tsx', 'w') as f:
    f.write(content)
