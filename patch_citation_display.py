import re
with open('src/components/EvidenceDetailModal.tsx', 'r') as f:
    content = f.read()

source_html = """
                  <div className="space-y-3 text-sm">
                    <div>
                      <div className="text-[10px] text-gray-500 uppercase">Entity / Title</div>
                      <div className="font-bold text-white">{evidence.source.name}</div>
                    </div>
                    
                    {evidence.source.author && (
                      <div>
                        <div className="text-[10px] text-gray-500 uppercase">Author</div>
                        <div className="text-gray-300">{evidence.source.author}</div>
                      </div>
                    )}
                    
                    {evidence.source.publisher && (
                      <div>
                        <div className="text-[10px] text-gray-500 uppercase">Publisher / Org</div>
                        <div className="text-gray-300">{evidence.source.publisher}</div>
                      </div>
                    )}
                    
                    <div className="grid grid-cols-2 gap-2">
                      {evidence.source.publicationDate && (
                        <div>
                          <div className="text-[10px] text-gray-500 uppercase">Published</div>
                          <div className="text-gray-300 text-xs">{new Date(evidence.source.publicationDate).toLocaleDateString()}</div>
                        </div>
                      )}
                      {evidence.source.accessedAt && (
                        <div>
                          <div className="text-[10px] text-gray-500 uppercase">Accessed</div>
                          <div className="text-gray-300 text-xs">{new Date(evidence.source.accessedAt).toLocaleDateString()}</div>
                        </div>
                      )}
                    </div>

                    <div>
                      <div className="text-[10px] text-gray-500 uppercase">Type</div>
                      <div className="text-gray-300">{evidence.source.sourceType}</div>
                    </div>
                    {evidence.source.url && (
                      <div>
                        <div className="text-[10px] text-gray-500 uppercase">Link</div>
                        <a href={evidence.source.url} target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline flex items-center gap-1 text-xs">
                          External Source <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    )}
                  </div>
"""

content = re.sub(r'<div className="space-y-3 text-sm">\n\s*<div>\n\s*<div className="text-\[10px\] text-gray-500 uppercase">Entity / Author.*?</a>\n\s*</div>\n\s*\)}?\n\s*</div>', source_html.strip(), content, flags=re.DOTALL)

with open('src/components/EvidenceDetailModal.tsx', 'w') as f:
    f.write(content)
