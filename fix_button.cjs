const fs = require('fs');
const file = 'src/components/InvestigatorProfileModal.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace("              </button>\n              </button>\n            </div>", "              </button>\n            </div>");

fs.writeFileSync(file, content);
