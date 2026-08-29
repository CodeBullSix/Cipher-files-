const fs = require('fs');
const file = 'src/middleware/auth.ts';
let content = fs.readFileSync(file, 'utf8');

const target = "const dbUser = await getOrCreateUser(decodedToken.uid, email, name);\n    req.dbUser = dbUser;";
const replacement = target + "\n\n    if (dbUser.deletedAt) {\n      return res.status(403).json({ error: 'Forbidden: Account suspended' });\n    }";

if (!content.includes("Account suspended")) {
  content = content.replace(target, replacement);
  fs.writeFileSync(file, content);
}
