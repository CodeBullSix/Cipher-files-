with open('src/db/evidence.ts', 'r') as f:
    content = f.read()

import re

# replace totalQ with one that handles the join
new_total = """
  let countQ = db.select({ count: evidenceItems.id }).from(evidenceItems);
  if (caseFileId) {
    countQ.innerJoin(evidenceCaseFiles, eq(evidenceCaseFiles.evidenceId, evidenceItems.id));
  }
  const totalQ = await countQ.where(and(...conditions));
"""

content = re.sub(r"const totalQ = await db\.select\(\{ count: evidenceItems\.id \}\)\.from\(evidenceItems\)\.where\(and\(\.\.\.conditions\)\);", new_total.strip(), content)

with open('src/db/evidence.ts', 'w') as f:
    f.write(content)
