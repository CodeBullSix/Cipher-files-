const fs = require('fs');

// Fix router auth
const routerFile = 'src/routes/moderation.ts';
let routerContent = fs.readFileSync(routerFile, 'utf8');
routerContent = routerContent.replace(
  "import { requireModerator } from '../middleware/auth.js';",
  "import { requireAuth, requireModerator } from '../middleware/auth.js';"
);
routerContent = routerContent.replace(
  "moderationRouter.use(requireModerator);",
  "moderationRouter.use(requireAuth, requireModerator);"
);
fs.writeFileSync(routerFile, routerContent);

// Fix frontend
const viewFile = 'src/components/ModerationDashboardView.tsx';
let viewContent = fs.readFileSync(viewFile, 'utf8');

viewContent = viewContent.replace(
  "import { formatDistanceToNow } from 'date-fns';",
  ""
);

const formatDateHtml = `
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};
`;

viewContent = viewContent.replace(
  "export const ModerationDashboardView",
  formatDateHtml + "\nexport const ModerationDashboardView"
);

viewContent = viewContent.replace(
  /formatDistanceToNow\(new Date\(item\.createdAt\), \{ addSuffix: true \}\)/g,
  "formatDate(item.createdAt)"
);

viewContent = viewContent.replace(/sound\.success\(\);/g, "sound.click();");
viewContent = viewContent.replace(/sound\.error\(\);/g, "sound.click();");

fs.writeFileSync(viewFile, viewContent);
