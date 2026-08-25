import fs from 'fs';

// Fix TimelineView.tsx
let content = fs.readFileSync('src/components/TimelineView.tsx', 'utf8');
content = content.replace("import { useAuth } from '../context/AuthContext';", "");
content = content.replace("import { useSound } from '../hooks/useSound';", "import { sound } from '../utils/audio';");
content = content.replace(
  "interface TimelineViewProps {",
  "interface TimelineViewProps {\n  currentUser?: any;"
);
content = content.replace(
  "export function TimelineView({ entityType, entityId }: TimelineViewProps) {",
  "export function TimelineView({ entityType, entityId, currentUser }: TimelineViewProps) {"
);
content = content.replace(
  "const { currentUser, userToken } = useAuth();",
  ""
);
content = content.replace(
  "const sound = useSound();",
  ""
);
content = content.replace(
  "const res = await fetch(`/api/events/entity/${entityType}/${entityId}`, {",
  "const { auth } = await import('../services/firebase');\n      const token = await auth.currentUser?.getIdToken();\n      const res = await fetch(`/api/events/entity/${entityType}/${entityId}`, {"
);
content = content.replace(
  "headers: { 'Authorization': `Bearer ${userToken}` }",
  "headers: token ? { 'Authorization': `Bearer ${token}` } : {}"
);
content = content.replace(
  "if (userToken) fetchEvents();",
  "fetchEvents();"
);
content = content.replace(
  "[entityId, entityType, userToken]",
  "[entityId, entityType]"
);
// Pass currentUser to modals
content = content.replace(
  "<EventModal isOpen={isModalOpen}",
  "<EventModal currentUser={currentUser} isOpen={isModalOpen}"
);
content = content.replace(
  "<AttachEvidenceModal isOpen={true}",
  "<AttachEvidenceModal currentUser={currentUser} isOpen={true}"
);
fs.writeFileSync('src/components/TimelineView.tsx', content);

// Fix EventModal.tsx
let eventModal = fs.readFileSync('src/components/EventModal.tsx', 'utf8');
eventModal = eventModal.replace("import { useAuth } from '../context/AuthContext';", "");
eventModal = eventModal.replace("import { useSound } from '../hooks/useSound';", "import { sound } from '../utils/audio';");
eventModal = eventModal.replace(
  "interface EventModalProps {",
  "interface EventModalProps {\n  currentUser?: any;"
);
eventModal = eventModal.replace(
  "export function EventModal({ isOpen, onClose, entityType, entityId, onSuccess, existingEvent }: EventModalProps) {",
  "export function EventModal({ isOpen, onClose, entityType, entityId, onSuccess, existingEvent, currentUser }: EventModalProps) {"
);
eventModal = eventModal.replace(
  "const { userToken } = useAuth();",
  ""
);
eventModal = eventModal.replace(
  "const sound = useSound();",
  ""
);
// replace token fetching in API calls
eventModal = eventModal.replace(
  "headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${userToken}` }",
  "headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${await (await import('../services/firebase')).auth.currentUser?.getIdToken()}` }"
);
// twice for POST and PUT, DELETE
eventModal = eventModal.replace(
  "headers: { 'Authorization': `Bearer ${userToken}` }",
  "headers: { 'Authorization': `Bearer ${await (await import('../services/firebase')).auth.currentUser?.getIdToken()}` }"
);
fs.writeFileSync('src/components/EventModal.tsx', eventModal);

// Fix AttachEvidenceModal.tsx
let attachModal = fs.readFileSync('src/components/AttachEvidenceModal.tsx', 'utf8');
attachModal = attachModal.replace("import { useAuth } from '../context/AuthContext';", "");
attachModal = attachModal.replace("import { useSound } from '../hooks/useSound';", "import { sound } from '../utils/audio';");
attachModal = attachModal.replace(
  "interface AttachEvidenceModalProps {",
  "interface AttachEvidenceModalProps {\n  currentUser?: any;"
);
attachModal = attachModal.replace(
  "export function AttachEvidenceModal({ isOpen, onClose, eventId, onSuccess }: AttachEvidenceModalProps) {",
  "export function AttachEvidenceModal({ isOpen, onClose, eventId, onSuccess, currentUser }: AttachEvidenceModalProps) {"
);
attachModal = attachModal.replace(
  "const { userToken } = useAuth();",
  ""
);
attachModal = attachModal.replace(
  "const sound = useSound();",
  ""
);
// fetch all
attachModal = attachModal.replace(
  "if (isOpen && userToken)",
  "if (isOpen)"
);
attachModal = attachModal.replace(
  "[isOpen, userToken]",
  "[isOpen]"
);
attachModal = attachModal.replace(
  "headers: { 'Authorization': `Bearer ${userToken}` }",
  "headers: { 'Authorization': `Bearer ${await (await import('../services/firebase')).auth.currentUser?.getIdToken()}` }"
);
attachModal = attachModal.replace(
  "headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${userToken}` }",
  "headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${await (await import('../services/firebase')).auth.currentUser?.getIdToken()}` }"
);
fs.writeFileSync('src/components/AttachEvidenceModal.tsx', attachModal);

