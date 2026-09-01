import fs from 'fs';
let content = fs.readFileSync('server.ts', 'utf8');

const logCode = `
    const { db } = await import('./src/db/index.js');
    const { moderationLogs } = await import('./src/db/schema.js');
    await db.insert(moderationLogs).values({
      id: \`mod-log-\${Date.now()}\`,
      actorId: req.user!.uid,
      action: featured ? 'APPROVE' : 'REMOVE', // repurposing these enum values for feature/unfeature
      targetType: 'case_files_featured',
      targetId: req.params.id,
      reason: \`Set featured to \${featured}, order \${featuredOrder}, collection \${editorialCollection}\`
    });
    res.json(updated);
  } catch (error: any) {
`;

content = content.replace(
    /\/\/ Log the audit[\s\S]*?\} catch \(error\: any\) \{/m,
    logCode
);
fs.writeFileSync('server.ts', content);
