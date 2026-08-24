import re

with open('src/components/EntityProfileModal.tsx', 'r') as f:
    content = f.read()

# Add imports
if 'RelationshipModal' not in content:
    content = content.replace(
        "import { EntityModal } from './EntityModal';",
        "import { EntityModal } from './EntityModal';\nimport { RelationshipModal } from './RelationshipModal';\nimport { Plus, Trash2 } from 'lucide-react';"
    )

# Add state variables
state_vars = """
  const [relationships, setRelationships] = useState<any[]>([]);
  const [isRelationshipModalOpen, setIsRelationshipModalOpen] = useState(false);
  const [editingRelationship, setEditingRelationship] = useState<any>(null);
"""
content = content.replace("const [isEditModalOpen, setIsEditModalOpen] = useState(false);", "const [isEditModalOpen, setIsEditModalOpen] = useState(false);\n" + state_vars)

# Load relationships
load_rels = """
  const loadRelationships = async () => {
    try {
      const data = await ApiService.getRelationshipsForEntity(type, entityId);
      setRelationships(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (isOpen && entityId && activeTab === 'relationships') {
      loadRelationships();
    }
  }, [isOpen, entityId, type, activeTab]);
"""
content = content.replace("if (!isOpen) return null;", load_rels + "\n  if (!isOpen) return null;")

# Update relationships tab render
old_rels_tab = """                {activeTab === 'relationships' && (
                  <div className="text-center py-12 animate-in fade-in duration-300">
                    <div className="w-16 h-16 rounded-full bg-gray-900 flex items-center justify-center mx-auto mb-4 border border-gray-800">
                      <Share2 className="w-6 h-6 text-cyan-500/50" />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">Relationship Graph</h3>
                    <p className="text-gray-400 max-w-md mx-auto text-sm">
                      Phase 3.3 feature. Connections to other people, organisations, and locations will be visualised here.
                    </p>
                  </div>
                )}"""

new_rels_tab = """                {activeTab === 'relationships' && (
                  <div className="space-y-4 animate-in fade-in duration-300">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-mono font-bold text-gray-400 uppercase">Known Connections</h3>
                      {(currentUser?.tier === 'ADMIN' || currentUser?.tier === 'MODERATOR' || currentUser?.tier === 'CONTRIBUTOR') && (
                        <button
                          onClick={() => { setEditingRelationship(null); setIsRelationshipModalOpen(true); sound.click(); }}
                          className="px-3 py-1.5 bg-cyan-950/30 border border-cyan-500/30 hover:border-cyan-500/80 rounded text-cyan-400 text-xs font-mono transition-colors flex items-center gap-1.5"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          Add Connection
                        </button>
                      )}
                    </div>
                    
                    {relationships.length === 0 ? (
                      <div className="text-center py-12 border border-gray-800 rounded-xl bg-gray-900/30">
                        <Share2 className="w-8 h-8 text-gray-600 mx-auto mb-3" />
                        <p className="text-gray-500 font-mono text-sm">No documented relationships.</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {relationships.map(rel => {
                          const isSource = rel.sourceId === entity.id;
                          const connectedEntity = isSource ? rel.targetEntity : rel.sourceEntity;
                          
                          // Determine direction arrow
                          const directionText = isSource ? '→ ' + rel.relationshipType.replace(/_/g, ' ') : '← ' + rel.relationshipType.replace(/_/g, ' ');
                          
                          return (
                            <div key={rel.id} className="p-4 bg-black border border-gray-800 rounded-xl flex items-start gap-4 group hover:border-gray-600 transition-colors">
                              {connectedEntity?.imageUrl ? (
                                <img src={connectedEntity.imageUrl} alt={connectedEntity.name} className="w-10 h-10 rounded object-cover border border-gray-700 mt-1" />
                              ) : (
                                <div className="w-10 h-10 rounded bg-gray-900 border border-gray-700 flex items-center justify-center shrink-0 mt-1">
                                  {connectedEntity?.entityType === 'people' ? <User className="w-5 h-5 text-cyan-400" /> : connectedEntity?.entityType === 'organisations' ? <Building className="w-5 h-5 text-amber-400" /> : <MapPin className="w-5 h-5 text-emerald-400" />}
                                </div>
                              )}
                              
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="text-xs font-mono text-cyan-500">{directionText}</span>
                                  {rel.verificationStatus === 'VERIFIED' && <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />}
                                  {rel.verificationStatus === 'DISPUTED' && <AlertTriangle className="w-3.5 h-3.5 text-red-400" />}
                                </div>
                                <h4 className="font-bold text-gray-200 truncate">{connectedEntity?.name}</h4>
                                {rel.description && (
                                  <p className="text-sm text-gray-400 mt-1 line-clamp-2">{rel.description}</p>
                                )}
                              </div>
                              
                              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                {(currentUser?.tier === 'ADMIN' || currentUser?.tier === 'MODERATOR' || rel.createdBy === currentUser?.uid) && (
                                  <>
                                    <button
                                      onClick={() => { setEditingRelationship(rel); setIsRelationshipModalOpen(true); sound.click(); }}
                                      className="p-1.5 text-gray-500 hover:text-cyan-400 transition-colors"
                                      title="Edit Relationship"
                                    >
                                      <Edit className="w-4 h-4" />
                                    </button>
                                    <button
                                      onClick={async () => {
                                        if (window.confirm('Delete this relationship?')) {
                                          await ApiService.deleteRelationship(rel.id);
                                          loadRelationships();
                                          sound.blip();
                                        }
                                      }}
                                      className="p-1.5 text-gray-500 hover:text-red-400 transition-colors"
                                      title="Delete Relationship"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}"""

content = content.replace(old_rels_tab, new_rels_tab)

# Add RelationshipModal to the end
rel_modal_jsx = """
      {isRelationshipModalOpen && entity && (
        <RelationshipModal
          isOpen={isRelationshipModalOpen}
          onClose={() => setIsRelationshipModalOpen(false)}
          sourceEntity={entity}
          sourceType={type}
          caseFileId={caseFileId || entity.caseFileIds?.[0]}
          existingRelationship={editingRelationship}
          onSaved={() => {
            loadRelationships();
          }}
        />
      )}
"""
content = content.replace("    </div>\n  );\n};", rel_modal_jsx + "    </div>\n  );\n};")

with open('src/components/EntityProfileModal.tsx', 'w') as f:
    f.write(content)

