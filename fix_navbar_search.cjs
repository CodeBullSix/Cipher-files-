const fs = require('fs');
const file = 'src/components/Navbar.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  "onRandomRabbitHole: () => void;",
  "onRandomRabbitHole: () => void;\n  onOpenSearch: () => void;"
);

content = content.replace(
  "onRandomRabbitHole, currentUser,",
  "onRandomRabbitHole, onOpenSearch, currentUser,"
);

fs.writeFileSync(file, content);
