import re

with open('src/db/investigation.ts', 'r') as f:
    content = f.read()

# Fix q.innerJoin not mutating q
content = content.replace("q.innerJoin(casePeople, eq(casePeople.personId, people.id))", "q = q.innerJoin(casePeople, eq(casePeople.personId, people.id)) as any")
content = content.replace("q.innerJoin(caseOrganisations, eq(caseOrganisations.organisationId, organisations.id))", "q = q.innerJoin(caseOrganisations, eq(caseOrganisations.organisationId, organisations.id)) as any")
content = content.replace("q.innerJoin(caseLocations, eq(caseLocations.locationId, locations.id))", "q = q.innerJoin(caseLocations, eq(caseLocations.locationId, locations.id)) as any")

with open('src/db/investigation.ts', 'w') as f:
    f.write(content)
