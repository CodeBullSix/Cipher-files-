const fs = require('fs');
const file = 'src/components/ModerationDashboardView.tsx';
let content = fs.readFileSync(file, 'utf8');

// Fix sound.play('click') -> sound.click()
content = content.replace(/sound\.play\('click'\)/g, "sound.click()");
// Fix sound.play('success') -> sound.blip(1200)
content = content.replace(/sound\.play\('success'\)/g, "sound.blip(1200)");
// Fix sound.play('error') -> sound.blip(200)
content = content.replace(/sound\.play\('error'\)/g, "sound.blip(200)");

// Fix ApiService.moderateItem -> ApiService.moderateContent
content = content.replace(/ApiService\.moderateItem\(/g, "ApiService.moderateContent(");

fs.writeFileSync(file, content);
