import fs from 'fs';
const path = 'src/components/SubmitTheoryModal.tsx';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(
  "import { FirestoreService } from '../services/firestoreService';",
  "import { ApiService } from '../services/apiService';"
);

content = content.replace(
  "await FirestoreService.createCase(newCase);",
  "await ApiService.createSubmission({ title: newCase.title, summary: newCase.summary, type: 'CASE', content: newCase });"
);

fs.writeFileSync(path, content);
console.log("SubmitTheoryModal updated to use ApiService.createSubmission");
