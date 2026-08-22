with open('src/components/DiscussionsView.tsx', 'r') as f:
    content = f.read()

state = """
  const [newDiscussionEvidence, setNewDiscussionEvidence] = useState<string[]>([]);
  const [availableEvidence, setAvailableEvidence] = useState<any[]>([]);

  useEffect(() => {
    import('../services/apiService').then(({ ApiService }) => {
      ApiService.getEvidence({ status: 'VERIFIED', limit: 100 }).then((data: any) => {
        setAvailableEvidence(data.items || data);
      }).catch(console.error);
    });
  }, []);
"""
if "const [newDiscussionEvidence" not in content:
    content = content.replace("const [newTagsText, setNewTagsText] = useState('');", "const [newTagsText, setNewTagsText] = useState('');\n" + state)

payload = """
        const payload = {
          title: newThreadTitle,
          content: newInitialComment,
          caseFileId: newThreadCaseId === 'GENERAL' ? null : newThreadCaseId,
          evidenceIds: newDiscussionEvidence
        };
"""
import re
content = re.sub(r"const payload = \{\n\s*title: newThreadTitle,\n\s*content: newInitialComment,\n\s*caseFileId: newThreadCaseId === 'GENERAL' \? null : newThreadCaseId\n\s*\};", payload.strip(), content, flags=re.DOTALL)

ui_html = """
            <div>
              <label className="block text-xs font-mono text-gray-400 mb-1.5 uppercase">Reference Evidence</label>
              <select
                multiple
                value={newDiscussionEvidence}
                onChange={e => {
                  const values = Array.from(e.target.selectedOptions, option => option.value);
                  setNewDiscussionEvidence(values);
                }}
                className="w-full px-3 py-2 bg-[#090D1A] border border-gray-800 rounded-lg text-white focus:outline-none focus:border-cyan-500/50 text-sm font-sans h-24"
              >
                {availableEvidence.map(ev => (
                  <option key={ev.id} value={ev.id}>{ev.title}</option>
                ))}
              </select>
              <p className="text-[10px] text-gray-500 mt-1">Hold Ctrl/Cmd to select multiple verified evidence items.</p>
            </div>
"""
content = content.replace("placeholder=\"e.g. MKULTRA, CIA, Project Stargate...\"\n                />\n              </div>", "placeholder=\"e.g. MKULTRA, CIA, Project Stargate...\"\n                />\n              </div>\n              " + ui_html)

reset_state = """
      setNewMediaCaption('');
      setNewTagsText('');
      setNewDiscussionEvidence([]);
"""
content = content.replace("setNewMediaCaption('');\n      setNewTagsText('');", reset_state.strip())

with open('src/components/DiscussionsView.tsx', 'w') as f:
    f.write(content)
