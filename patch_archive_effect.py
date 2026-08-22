import re

with open('src/components/EvidenceArchiveView.tsx', 'r') as f:
    content = f.read()

effect = """
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      loadEvidence();
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, statusFilter, page]);

  const loadEvidence = async () => {
    try {
      setLoading(true);
      const data = await ApiService.getEvidence({ query: searchQuery, status: statusFilter, page });
      setEvidenceItems(data.items || data);
      if (data.totalPages) setTotalPages(data.totalPages);
    } catch (err) {
      console.error('Failed to load evidence', err);
    } finally {
      setLoading(false);
    }
  };

  // We can remove the old local filteredEvidence and just map evidenceItems directly.
"""

content = re.sub(r"  useEffect\(\(\) => \{.*?\n  \}, \[\]\);\n\n  const loadEvidence = async \(\) => \{.*?\n  \};\n\n  const filteredEvidence = evidenceItems.filter.*?;\n", effect.strip() + "\n", content, flags=re.DOTALL)
content = content.replace("filteredEvidence", "evidenceItems")

with open('src/components/EvidenceArchiveView.tsx', 'w') as f:
    f.write(content)
