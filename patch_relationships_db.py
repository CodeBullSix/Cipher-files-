import re

with open('src/db/relationships.ts', 'r') as f:
    content = f.read()

bad_line1 = "if (type === 'people') res = await db.select({ id: people.id, name: people.name, imageUrl: people.imageUrl, type: db.$enum('people') }).from(people).where(eq(people.id, id));"
good_line1 = "if (type === 'people') res = await db.select({ id: people.id, name: people.name, imageUrl: people.imageUrl }).from(people).where(eq(people.id, id));"

content = content.replace(bad_line1, good_line1)

with open('src/db/relationships.ts', 'w') as f:
    f.write(content)
