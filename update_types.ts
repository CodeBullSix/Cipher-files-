import fs from 'fs';
const typesPath = 'src/types.ts';
let content = fs.readFileSync(typesPath, 'utf8');

if (!content.includes("featuredOrder?: number;")) {
  content = content.replace(
    /isFeatured\?: boolean;/,
    `isFeatured?: boolean;
  featuredOrder?: number;
  editorialCollection?: string;
  editorialDescription?: string;`
  );
  fs.writeFileSync(typesPath, content);
  console.log("Updated types.ts with editorial fields");
} else {
  console.log("types.ts already updated.");
}
