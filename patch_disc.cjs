const fs = require('fs');
const file = 'src/components/DiscussionsView.tsx';
let content = fs.readFileSync(file, 'utf8');

// The backend gives 10 REP for discussion and 2 REP for reply.
// Let's update the frontend calls to match.
content = content.replace("onRewardXp(50, 'Published new research inquiry');", "onReputationEarned(10, 'Published new research inquiry');");
content = content.replace("Publish Inquiry (+50 XP)", "Publish Inquiry (+10 REP)");

// We also need to change onRewardXp to onReputationEarned in the props
content = content.replace(/onRewardXp/g, 'onReputationEarned');
content = content.replace(/Publish Peer Review \(\+30 XP\)/g, 'Publish Peer Review (+2 REP)');

fs.writeFileSync(file, content);
