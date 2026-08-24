import re

with open('src/components/CaseDetailModal.tsx', 'r') as f:
    content = f.read()

# Add imports for User, Building, MapPin if not present
if 'import { EntitiesView }' not in content:
    content = content.replace("import { EvidenceArchiveView }", "import { EntitiesView } from './EntitiesView';\nimport { EvidenceArchiveView }")
    content = content.replace("Scale, Database,", "Scale, Database, User, Building, MapPin,")

# Add the tabs to the nav strip. Let's place them before Rabbit Hole (tab 7).
nav_strip_patch = """
          <button
            onClick={() => { setActiveTab('people'); sound.click(); }}
            className={`px-3.5 py-2.5 text-xs font-mono font-bold whitespace-nowrap transition-all border-b-2 flex items-center gap-1.5 ${
              activeTab === 'people'
                ? 'border-cyan-400 text-cyan-300 bg-cyan-950/20'
                : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">People</span>
          </button>
          
          <button
            onClick={() => { setActiveTab('organisations'); sound.click(); }}
            className={`px-3.5 py-2.5 text-xs font-mono font-bold whitespace-nowrap transition-all border-b-2 flex items-center gap-1.5 ${
              activeTab === 'organisations'
                ? 'border-cyan-400 text-cyan-300 bg-cyan-950/20'
                : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            <Building className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Organisations</span>
          </button>
          
          <button
            onClick={() => { setActiveTab('locations'); sound.click(); }}
            className={`px-3.5 py-2.5 text-xs font-mono font-bold whitespace-nowrap transition-all border-b-2 flex items-center gap-1.5 ${
              activeTab === 'locations'
                ? 'border-cyan-400 text-cyan-300 bg-cyan-950/20'
                : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Locations</span>
          </button>
"""

# Insert right before Rabbit Hole tab
content = content.replace(
    "<button\n            onClick={() => { setActiveTab('rabbithole');", 
    nav_strip_patch + "\n          <button\n            onClick={() => { setActiveTab('rabbithole');"
)

# Render the tabs
tabs_render_patch = """
          {/* TAB: PEOPLE */}
          {activeTab === 'people' && (
            <EntitiesView caseFileId={currentCase.id} type="people" currentUser={currentUser} />
          )}
          
          {/* TAB: ORGANISATIONS */}
          {activeTab === 'organisations' && (
            <EntitiesView caseFileId={currentCase.id} type="organisations" currentUser={currentUser} />
          )}
          
          {/* TAB: LOCATIONS */}
          {activeTab === 'locations' && (
            <EntitiesView caseFileId={currentCase.id} type="locations" currentUser={currentUser} />
          )}
"""

# Insert right before Rabbit Hole content
content = content.replace(
    "{/* TAB 7: RABBIT HOLE CONNECTIONS */}",
    tabs_render_patch + "\n          {/* TAB 7: RABBIT HOLE CONNECTIONS */}"
)

with open('src/components/CaseDetailModal.tsx', 'w') as f:
    f.write(content)
