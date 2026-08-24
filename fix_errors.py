import re

with open('src/components/EntityModal.tsx', 'r') as f:
    content = f.read()
content = content.replace("sound.success();", "sound.blip();")
with open('src/components/EntityModal.tsx', 'w') as f:
    f.write(content)

with open('src/components/CaseDetailModal.tsx', 'r') as f:
    content = f.read()

lines = content.split('\n')
map_pin_lines = [i for i, line in enumerate(lines) if 'MapPin' in line and i < 60]
if len(map_pin_lines) > 1:
    del lines[map_pin_lines[1]]

with open('src/components/CaseDetailModal.tsx', 'w') as f:
    f.write('\n'.join(lines))

