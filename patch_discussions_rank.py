with open('src/components/DiscussionsView.tsx', 'r') as f:
    content = f.read()

import re

content = re.sub(r"comment\.authorRank\.replace", "(comment.authorRank || 'OBSERVER').replace", content)
content = re.sub(r"activeThread\.authorRank\.replace", "(activeThread.authorRank || 'OBSERVER').replace", content)
content = re.sub(r"disc\.authorRank\.replace", "(disc.authorRank || 'OBSERVER').replace", content)

with open('src/components/DiscussionsView.tsx', 'w') as f:
    f.write(content)
