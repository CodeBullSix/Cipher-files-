import re

with open('src/db/investigation.ts', 'r') as f:
    content = f.read()

if 'caseFiles' not in content.split('} from \'./schema.js\'')[0]:
    content = content.replace("users\n}", "users,\n  caseFiles\n}")

# Person
old_person = """  const caseFilesResult = await db.select({ caseFileId: casePeople.caseFileId }).from(casePeople).where(eq(casePeople.personId, id));
  
  return {
    ...person,
    creator: creator ? { uid: creator.uid, displayName: creator.displayName } : null,
    caseFileIds: caseFilesResult.map(c => c.caseFileId)
  };"""
new_person = """  const caseFilesResult = await db.select({ 
    id: caseFiles.id, 
    title: caseFiles.title 
  })
  .from(casePeople)
  .innerJoin(caseFiles, eq(caseFiles.id, casePeople.caseFileId))
  .where(eq(casePeople.personId, id));
  
  return {
    ...person,
    creator: creator ? { uid: creator.uid, displayName: creator.displayName } : null,
    caseFileIds: caseFilesResult.map(c => c.id),
    associatedCases: caseFilesResult
  };"""
content = content.replace(old_person, new_person)

# Organisation
old_org = """  const caseFilesResult = await db.select({ caseFileId: caseOrganisations.caseFileId }).from(caseOrganisations).where(eq(caseOrganisations.organisationId, id));
  
  return {
    ...org,
    creator: creator ? { uid: creator.uid, displayName: creator.displayName } : null,
    caseFileIds: caseFilesResult.map(c => c.caseFileId)
  };"""
new_org = """  const caseFilesResult = await db.select({ 
    id: caseFiles.id, 
    title: caseFiles.title 
  })
  .from(caseOrganisations)
  .innerJoin(caseFiles, eq(caseFiles.id, caseOrganisations.caseFileId))
  .where(eq(caseOrganisations.organisationId, id));
  
  return {
    ...org,
    creator: creator ? { uid: creator.uid, displayName: creator.displayName } : null,
    caseFileIds: caseFilesResult.map(c => c.id),
    associatedCases: caseFilesResult
  };"""
content = content.replace(old_org, new_org)

# Location
old_loc = """  const caseFilesResult = await db.select({ caseFileId: caseLocations.caseFileId }).from(caseLocations).where(eq(caseLocations.locationId, id));
  
  return {
    ...loc,
    creator: creator ? { uid: creator.uid, displayName: creator.displayName } : null,
    caseFileIds: caseFilesResult.map(c => c.caseFileId)
  };"""
new_loc = """  const caseFilesResult = await db.select({ 
    id: caseFiles.id, 
    title: caseFiles.title 
  })
  .from(caseLocations)
  .innerJoin(caseFiles, eq(caseFiles.id, caseLocations.caseFileId))
  .where(eq(caseLocations.locationId, id));
  
  return {
    ...loc,
    creator: creator ? { uid: creator.uid, displayName: creator.displayName } : null,
    caseFileIds: caseFilesResult.map(c => c.id),
    associatedCases: caseFilesResult
  };"""
content = content.replace(old_loc, new_loc)

with open('src/db/investigation.ts', 'w') as f:
    f.write(content)
