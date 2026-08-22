with open('src/components/EvidenceArchiveView.tsx', 'r') as f:
    content = f.read()

if "import { SubmitEvidenceModal }" not in content:
    content = content.replace("import { UserProfile } from '../types';", "import { UserProfile } from '../types';\nimport { SubmitEvidenceModal } from './SubmitEvidenceModal';")

if "isSubmitModalOpen" not in content:
    content = content.replace("const [statusFilter, setStatusFilter] = useState('ALL');", "const [statusFilter, setStatusFilter] = useState('ALL');\n  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);")

if "setIsSubmitModalOpen(true)" not in content:
    content = content.replace("Submit Evidence\n          </button>", "Submit Evidence\n          </button>").replace("<button className=\"px-4", "<button onClick={() => setIsSubmitModalOpen(true)} className=\"px-4")

modal_html = """
      {isSubmitModalOpen && currentUser && (
        <SubmitEvidenceModal
          currentUser={currentUser}
          onClose={() => setIsSubmitModalOpen(false)}
          onSubmitted={() => {
            setIsSubmitModalOpen(false);
            loadEvidence();
          }}
        />
      )}
    </div>
"""
if "SubmitEvidenceModal" not in content.split("return (")[1]:
    content = content.replace("    </div>\n  );\n};", modal_html + "\n  );\n};")

with open('src/components/EvidenceArchiveView.tsx', 'w') as f:
    f.write(content)
