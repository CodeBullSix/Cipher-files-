import fs from 'fs';
let content = fs.readFileSync('src/components/TimelineView.tsx', 'utf8');

if (!content.includes('AttachEvidenceModal')) {
  // Add import
  content = content.replace(
    "import { EventModal } from './EventModal';",
    "import { EventModal } from './EventModal';\nimport { AttachEvidenceModal } from './AttachEvidenceModal';"
  );
  
  // Add state
  content = content.replace(
    "const [editingEvent, setEditingEvent] = useState<any>(null);",
    "const [editingEvent, setEditingEvent] = useState<any>(null);\n  const [attachEventId, setAttachEventId] = useState<string | null>(null);"
  );
  
  // Add attach button in evidence section
  content = content.replace(
    "{event.evidenceList && event.evidenceList.length > 0 && (\n                  <div className=\"mt-3 pt-3 border-t border-gray-800\">\n                    <div className=\"flex items-center gap-1.5 text-xs text-gray-500 font-mono mb-2\">\n                      <Scale className=\"w-3.5 h-3.5\" /> Supporting Evidence ({event.evidenceList.length})\n                    </div>\n                  </div>\n                )}",
    `<div className="mt-3 pt-3 border-t border-gray-800 flex items-center justify-between">
                    {event.evidenceList && event.evidenceList.length > 0 ? (
                      <div className="flex items-center gap-1.5 text-xs text-gray-500 font-mono">
                        <Scale className="w-3.5 h-3.5" /> Supporting Evidence ({event.evidenceList.length})
                        {event.evidenceList.map((e: any) => (
                          <span key={e.id} className="ml-2 px-1.5 py-0.5 bg-gray-800 rounded text-gray-300">
                            {e.title || 'Ev#' + e.id.substring(0,6)}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-xs text-gray-600 font-mono italic">No evidence attached</span>
                    )}
                    
                    {(currentUser?.tier === 'ADMIN' || currentUser?.tier === 'MODERATOR' || currentUser?.uid === event.createdBy) && (
                      <button onClick={() => { setAttachEventId(event.id); sound.click(); }} className="text-xs text-cyan-500 hover:text-cyan-400 font-mono flex items-center gap-1">
                        <Plus className="w-3 h-3" /> Attach Evidence
                      </button>
                    )}
                  </div>`
  );
  
  // Add AttachEvidenceModal to render
  content = content.replace(
    "<EventModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} entityType={entityType} entityId={entityId} onSuccess={fetchEvents} existingEvent={editingEvent} />\n    </div>",
    "<EventModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} entityType={entityType} entityId={entityId} onSuccess={fetchEvents} existingEvent={editingEvent} />\n      {attachEventId && <AttachEvidenceModal isOpen={true} onClose={() => setAttachEventId(null)} eventId={attachEventId} onSuccess={fetchEvents} />}\n    </div>"
  );
  
  fs.writeFileSync('src/components/TimelineView.tsx', content);
}
