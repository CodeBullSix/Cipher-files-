const fs = require('fs');
const file = 'src/components/InvestigatorProfileModal.tsx';
let content = fs.readFileSync(file, 'utf8');

// Fix isBanned
content = content.replace("const [isBanned, setIsBanned] = useState<boolean>(!!isBanned);", "const [isBanned, setIsBanned] = useState<boolean>(!!activeProfile.deletedAt);");

// Fix AlertTriangle
if (!content.includes('AlertTriangle')) {
  content = content.replace("  Check,\n  MapPin", "  Check,\n  MapPin,\n  AlertTriangle");
}

fs.writeFileSync(file, content);
