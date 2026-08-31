const fs = require('fs');
const file = 'src/routes/appeals.ts';
let content = fs.readFileSync(file, 'utf8');

// The replacement was:
content = content.replace(
  "       }\n    }\n    }\n\n    // If previously Overturned but now Upheld",
  "       }\n    }\n\n    // If previously Overturned but now Upheld"
);

content = content.replace(
  "       }\n    }\n    }\n\n    // Send notification",
  "       }\n    }\n\n    // Send notification"
);

fs.writeFileSync(file, content);
