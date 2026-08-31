import fs from 'fs';
const path = 'src/components/EditorialHome.tsx';
let content = fs.readFileSync(path, 'utf8');

const filteredLogic = `
  const filteredCases = cases.filter(c => {
    const matchSearch = c.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        (c.caseNumber && c.caseNumber.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchCat = selectedCategory === 'ALL' || c.category === selectedCategory;
    const matchStatus = selectedStatus === 'ALL' || c.status === selectedStatus;
    return matchSearch && matchCat && matchStatus;
  });

  const featuredCases =`;

content = content.replace(/  const featuredCases =/, filteredLogic);

fs.writeFileSync(path, content);
