const fs = require('fs');
const file = 'src/components/InvestigatorProfileModal.tsx';
let content = fs.readFileSync(file, 'utf8');

if (!content.includes('AlertTriangle')) {
  content = content.replace("  Upload,\n  MapPin", "  Upload,\n  MapPin,\n  AlertTriangle");
}

if (!content.includes('const [isBanned, setIsBanned] = useState')) {
  content = content.replace("  const activeProfile = profile;", "  const activeProfile = profile;\n  const [isBanned, setIsBanned] = useState<boolean>(!!activeProfile.deletedAt);");
  content = content.replace("setActiveProfile(prev => ({ ...prev, deletedAt: action === 'BAN' ? new Date().toISOString() : undefined }));", "setIsBanned(action === 'BAN');");
  content = content.replace(/activeProfile\.deletedAt/g, "isBanned");
}

fs.writeFileSync(file, content);
