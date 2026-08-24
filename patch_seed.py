import re

with open('src/db/seed.ts', 'r') as f:
    content = f.read()

replacement = """
      await db.insert(caseFiles).values({
        id: c.id,
        title: c.title,
        slug: c.id,
        summary: c.summary,
        description: c.claim || '',
        category: c.category,
        status: c.status === 'VERIFIED' ? 'CONFIRMED' : c.status as any,
        caseNumber: c.caseNumber,
        subtitle: c.subtitle,
        officialVerdict: c.officialVerdict,
        coverImage: c.coverImage,
        claim: c.claim,
        claimOrigin: c.claimOrigin,
        whatWeKnow: c.whatWeKnow,
        speculations: c.speculations,
        timeline: c.timeline,
        featured: c.id === 'mkultra' || c.id === 'roswell',
        createdBy: adminUid
      }).onConflictDoUpdate({
        target: caseFiles.id,
        set: {
          title: c.title,
          summary: c.summary,
          description: c.claim || '',
          category: c.category,
          status: c.status === 'VERIFIED' ? 'CONFIRMED' : c.status as any,
          caseNumber: c.caseNumber,
          subtitle: c.subtitle,
          officialVerdict: c.officialVerdict,
          coverImage: c.coverImage,
          claim: c.claim,
          claimOrigin: c.claimOrigin,
          whatWeKnow: c.whatWeKnow,
          speculations: c.speculations,
          timeline: c.timeline
        }
      });
"""

content = re.sub(r"await db\.insert\(caseFiles\)\.values\(\{.*?\}\)\.onConflictDoNothing\(\);", replacement.strip(), content, flags=re.DOTALL, count=1)

with open('src/db/seed.ts', 'w') as f:
    f.write(content)
