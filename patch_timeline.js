import fs from 'fs';
let content = fs.readFileSync('src/components/TimelineView.tsx', 'utf8');

// Add import for EventModal
content = content.replace(
  "import { Calendar, Plus, Edit, Trash2, Clock, MapPin, Scale, Loader, ShieldCheck, AlertTriangle } from 'lucide-react';",
  "import { Calendar, Plus, Edit, Trash2, Clock, MapPin, Scale, Loader, ShieldCheck, AlertTriangle } from 'lucide-react';\nimport { EventModal } from './EventModal';"
);

// Add state for modal
content = content.replace(
  "const sound = useSound();",
  "const sound = useSound();\n  const [isModalOpen, setIsModalOpen] = useState(false);\n  const [editingEvent, setEditingEvent] = useState<any>(null);"
);

// Update button onClick
content = content.replace(
  "onClick={() => { sound.click(); /* open modal */ }}",
  "onClick={() => { sound.click(); setEditingEvent(null); setIsModalOpen(true); }}"
);

// Add edit/delete buttons
content = content.replace(
  "event.verificationStatus === 'DISPUTED' && <AlertTriangle className=\"w-4 h-4 text-red-400\" title=\"Disputed\" />}",
  "event.verificationStatus === 'DISPUTED' && <AlertTriangle className=\"w-4 h-4 text-red-400\" title=\"Disputed\" />}\n                    {(currentUser?.tier === 'ADMIN' || currentUser?.uid === event.createdBy) && (\n                      <button onClick={() => { setEditingEvent(event); setIsModalOpen(true); sound.click(); }} className=\"text-gray-500 hover:text-cyan-400 ml-2\">\n                        <Edit className=\"w-3.5 h-3.5\" />\n                      </button>\n                    )}"
);

// Add EventModal to return
content = content.replace(
  "    </div>\n  );\n}",
  "      <EventModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} entityType={entityType} entityId={entityId} onSuccess={fetchEvents} existingEvent={editingEvent} />\n    </div>\n  );\n}"
);

fs.writeFileSync('src/components/TimelineView.tsx', content);
