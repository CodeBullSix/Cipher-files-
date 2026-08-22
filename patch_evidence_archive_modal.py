with open('src/components/EvidenceArchiveView.tsx', 'r') as f:
    content = f.read()

if "import { EvidenceDetailModal }" not in content:
    content = content.replace("import { SubmitEvidenceModal }", "import { SubmitEvidenceModal }\nimport { EvidenceDetailModal }")

if "const [selectedEvidence" not in content:
    content = content.replace("const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);", "const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);\n  const [selectedEvidence, setSelectedEvidence] = useState<ArchiveEvidence | null>(null);")

if "onClick={() => setSelectedEvidence(item)}" not in content:
    content = content.replace("key={item.id} className=\"bg-[#090D1A]", "key={item.id} onClick={() => setSelectedEvidence(item)} className=\"bg-[#090D1A]")

modal_html = """
      {selectedEvidence && (
        <EvidenceDetailModal
          evidence={selectedEvidence}
          currentUser={currentUser}
          onClose={() => setSelectedEvidence(null)}
          onUpdate={(updated) => {
            setEvidenceItems(prev => prev.map(item => item.id === updated.id ? updated : item));
            setSelectedEvidence(updated);
          }}
        />
      )}
    </div>
"""
if "EvidenceDetailModal" not in content.split("return (")[1]:
    content = content.replace("    </div>\n  );\n};", modal_html + "\n  );\n};")

with open('src/components/EvidenceArchiveView.tsx', 'w') as f:
    f.write(content)
