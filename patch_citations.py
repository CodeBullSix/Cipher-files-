import re

with open('src/components/SubmitEvidenceModal.tsx', 'r') as f:
    content = f.read()

states = """
  const [sourcePublisher, setSourcePublisher] = useState('');
  const [sourceAuthor, setSourceAuthor] = useState('');
  const [sourcePubDate, setSourcePubDate] = useState('');
  const [sourceAccessDate, setSourceAccessDate] = useState('');
  const [documentPage, setDocumentPage] = useState('');
"""
content = content.replace("const [sourceUrl, setSourceUrl] = useState('');", "const [sourceUrl, setSourceUrl] = useState('');\n" + states)

documentData = """
        documentData = {
          title: file.name,
          fileName: uploadRes.fileName,
          fileType: uploadRes.fileType,
          fileSize: uploadRes.fileSize,
          storageKey: uploadRes.storageKey,
          pageCount: documentPage ? parseInt(documentPage) : null,
        };
"""
content = re.sub(r"documentData = \{\n.*?storageKey: uploadRes\.storageKey,\n\s*?\};", documentData.strip(), content, flags=re.DOTALL)

sourceData = """
        source: {
          name: sourceName || 'Unknown Source',
          sourceType,
          url: sourceUrl,
          publisher: sourcePublisher,
          author: sourceAuthor,
          publicationDate: sourcePubDate ? new Date(sourcePubDate).toISOString() : null,
          accessedAt: sourceAccessDate ? new Date(sourceAccessDate).toISOString() : null,
        }
"""
content = re.sub(r"source: \{\n\s*name: sourceName \|\| 'Unknown Source',\n\s*sourceType,\n\s*url: sourceUrl\n\s*\}", sourceData.strip(), content, flags=re.DOTALL)

ui_html = """
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-1.5 uppercase">Author</label>
                  <input
                    type="text"
                    value={sourceAuthor}
                    onChange={e => setSourceAuthor(e.target.value)}
                    className="w-full px-3 py-2 bg-[#0E121E] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-cyan-500/50 text-sm"
                    placeholder="e.g. John Doe"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-1.5 uppercase">Publisher / Org</label>
                  <input
                    type="text"
                    value={sourcePublisher}
                    onChange={e => setSourcePublisher(e.target.value)}
                    className="w-full px-3 py-2 bg-[#0E121E] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-cyan-500/50 text-sm"
                    placeholder="e.g. CIA, NY Times"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-1.5 uppercase">Publication Date</label>
                  <input
                    type="date"
                    value={sourcePubDate}
                    onChange={e => setSourcePubDate(e.target.value)}
                    className="w-full px-3 py-2 bg-[#0E121E] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-cyan-500/50 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-1.5 uppercase">Access Date</label>
                  <input
                    type="date"
                    value={sourceAccessDate}
                    onChange={e => setSourceAccessDate(e.target.value)}
                    className="w-full px-3 py-2 bg-[#0E121E] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-cyan-500/50 text-sm"
                  />
                </div>
              </div>
"""
content = content.replace("</div>\n            </div>\n            \n            <div className=\"space-y-4\">\n              <h3 className=\"text-xs font-bold text-cyan-400 uppercase tracking-widest border-b border-gray-800 pb-2\">File Attachment</h3>", "</div>\n" + ui_html + "\n            </div>\n            \n            <div className=\"space-y-4\">\n              <h3 className=\"text-xs font-bold text-cyan-400 uppercase tracking-widest border-b border-gray-800 pb-2\">File Attachment</h3>")

with open('src/components/SubmitEvidenceModal.tsx', 'w') as f:
    f.write(content)
