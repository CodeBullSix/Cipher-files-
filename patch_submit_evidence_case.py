with open('src/components/SubmitEvidenceModal.tsx', 'r') as f:
    content = f.read()

state = """
  const [caseFileId, setCaseFileId] = useState('');
  const [cases, setCases] = useState<any[]>([]);

  React.useEffect(() => {
    ApiService.getCases().then(setCases).catch(console.error);
  }, []);
"""
content = content.replace("const [documentPage, setDocumentPage] = useState('');", "const [documentPage, setDocumentPage] = useState('');\n" + state)

payload = """
      const evidenceData = {
        title,
        description,
        type,
        stance,
        caseFileIds: caseFileId ? [caseFileId] : [],
        document: documentData,
"""
import re
content = re.sub(r"const evidenceData = \{\n\s*title,\n\s*description,\n\s*type,\n\s*stance,\n\s*document: documentData,", payload.strip(), content, flags=re.DOTALL)

ui_html = """
              <div className="mt-4">
                <label className="block text-xs font-bold text-gray-400 mb-1.5 uppercase">Link to Case File (Optional)</label>
                <select
                  value={caseFileId}
                  onChange={e => setCaseFileId(e.target.value)}
                  className="w-full px-3 py-2 bg-[#0E121E] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-cyan-500/50 text-sm"
                >
                  <option value="">-- None --</option>
                  {cases.map(c => (
                    <option key={c.id} value={c.id}>{c.title}</option>
                  ))}
                </select>
              </div>
"""
content = content.replace("</select>\n                </div>\n              </div>", "</select>\n                </div>\n              </div>\n" + ui_html)

with open('src/components/SubmitEvidenceModal.tsx', 'w') as f:
    f.write(content)
