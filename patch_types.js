import fs from 'fs';
let content = fs.readFileSync('src/types.ts', 'utf8');
content = content.replace("type: 'CASE' | 'PERSON' | 'AGENCY' | 'LOCATION' | 'DOCUMENT' | 'EVENT';", "type: 'case_files' | 'people' | 'organisations' | 'locations' | 'events' | 'evidence_items' | 'CASE' | 'PERSON' | 'AGENCY' | 'LOCATION' | 'DOCUMENT' | 'EVENT';");
fs.writeFileSync('src/types.ts', content);
