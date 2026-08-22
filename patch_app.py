with open('src/App.tsx', 'r') as f:
    content = f.read()

import_stmt = "import { EvidenceArchiveView } from './components/EvidenceArchiveView.js';\n"
if "EvidenceArchiveView" not in content:
    content = content.replace("import { DiscussionsView }", import_stmt + "import { DiscussionsView }")

evidence_view = """
        {/* VIEW 5: EVIDENCE ARCHIVE */}
        {currentTab === 'evidence' && (
          <EvidenceArchiveView
            currentUser={currentUser || (legacyProfile as any)}
            onOpenCase={handleOpenCase}
            onRewardXp={handleRewardXp}
          />
        )}
"""

if "currentTab === 'evidence'" not in content:
    content = content.replace("</main>", evidence_view + "\n      </main>")

# type TabId = 'cases' | 'graph' | 'discussions' | 'supporters' | 'evidence';
if "type TabId =" not in content and "cases" in content:
    pass

with open('src/App.tsx', 'w') as f:
    f.write(content)
