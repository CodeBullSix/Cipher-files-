with open('src/components/EvidenceArchiveView.tsx', 'r') as f:
    content = f.read()

pagination = """
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 mt-8 pt-4 border-t border-gray-800">
          <button 
            disabled={page === 1}
            onClick={() => setPage(p => p - 1)}
            className="px-3 py-1 bg-gray-900 border border-gray-800 text-gray-400 rounded-md disabled:opacity-50"
          >
            Prev
          </button>
          <span className="text-xs text-gray-500">Page {page} of {totalPages}</span>
          <button 
            disabled={page === totalPages}
            onClick={() => setPage(p => p + 1)}
            className="px-3 py-1 bg-gray-900 border border-gray-800 text-gray-400 rounded-md disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
"""

content = content.replace("</div>\n      )}\n\n      {selectedEvidence && (", pagination + "\n      </div>\n      )}\n\n      {selectedEvidence && (")

with open('src/components/EvidenceArchiveView.tsx', 'w') as f:
    f.write(content)
