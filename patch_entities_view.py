import re

with open('src/components/EntitiesView.tsx', 'r') as f:
    content = f.read()

content = content.replace("import { EntityModal } from './EntityModal';", "import { EntityModal } from './EntityModal';\nimport { EntityProfileModal } from './EntityProfileModal';")
content = content.replace("const [isModalOpen, setIsModalOpen] = useState(false);", "const [isModalOpen, setIsModalOpen] = useState(false);\n  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);")

content = content.replace("""  const handleEntityClick = (entity: any) => {
    setSelectedEntity(entity);
    setIsModalOpen(true);
    sound.click();
  };""", """  const handleEntityClick = (entity: any) => {
    setSelectedEntity(entity);
    setIsProfileModalOpen(true);
    sound.click();
  };""")

profile_modal = """
      {isProfileModalOpen && selectedEntity && (
        <EntityProfileModal
          isOpen={isProfileModalOpen}
          onClose={() => { setIsProfileModalOpen(false); loadEntities(); }}
          entityId={selectedEntity.id}
          type={type}
          currentUser={currentUser}
          caseFileId={caseFileId}
        />
      )}
"""

content = content.replace("      {isModalOpen && (", profile_modal + "      {isModalOpen && (")

with open('src/components/EntitiesView.tsx', 'w') as f:
    f.write(content)
