const fs = require('fs');
let code = fs.readFileSync('src/components/RabbitHoleGraph.tsx', 'utf8');

code = code.replace(
  "import { useSound } from '../hooks/useSound';",
  "import { sound } from '../utils/audio';"
);
code = code.replace(
  "const sound = useSound();",
  ""
);

code = code.replace(
  "Layers\n} from 'lucide-react';",
  "Layers,\n  Folder\n} from 'lucide-react';"
);

fs.writeFileSync('src/components/RabbitHoleGraph.tsx', code);
