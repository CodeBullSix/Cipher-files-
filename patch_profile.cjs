const fs = require('fs');
const file = 'src/components/InvestigatorProfileModal.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  "const [activeTab, setActiveTab] = useState<'dossier' | 'customize'>('dossier');",
  "const [activeTab, setActiveTab] = useState<'dossier' | 'contributions' | 'customize'>('dossier');\n  const [contributions, setContributions] = useState<any[]>([]);\n  const [contributionFilter, setContributionFilter] = useState<string>('ALL');\n  const [loadingContributions, setLoadingContributions] = useState<boolean>(false);"
);

// Add fetch for contributions
const fetchBlock = `
  useEffect(() => {
    let mounted = true;
    setLoadingContributions(true);
    ApiService.getUserContributions(activeProfile.uid, contributionFilter)
      .then((data: any) => {
        if (mounted && Array.isArray(data)) {
          setContributions(data);
        }
      })
      .catch(err => console.error(err))
      .finally(() => {
        if (mounted) setLoadingContributions(false);
      });
      
    return () => { mounted = false; };
  }, [activeProfile.uid, contributionFilter]);
`;

content = content.replace("useEffect(() => {", fetchBlock + "\n  useEffect(() => {");

fs.writeFileSync(file, content);
