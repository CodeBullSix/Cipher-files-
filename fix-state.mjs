import fs from 'fs';
let content = fs.readFileSync('src/components/CaseDetailModal.tsx', 'utf8');

if (!content.includes('setIsAddingToWorkspace')) {
  content = content.replace(
    "const [currentCase, setCurrentCase] = useState<CaseFile>(caseFile);", 
    "const [isAddingToWorkspace, setIsAddingToWorkspace] = useState(false);\n  const [currentCase, setCurrentCase] = useState<CaseFile>(caseFile);"
  );
  fs.writeFileSync('src/components/CaseDetailModal.tsx', content);
}
