import fs from 'fs';
let content = fs.readFileSync('src/components/CaseDetailModal.tsx', 'utf8');

if (!content.includes("TimelineView")) {
  content = content.replace(
    "import { X, Calendar, Lock, Globe, Users, ShieldAlert, Folder, Download, ExternalLink, Hash, Clock, FileText, ChevronRight, Eye, RefreshCw, MessageSquare, Plus, CheckCircle, Search, Save, AlertTriangle, Trash2, BrainCircuit, Activity, Edit3, Image as ImageIcon, Scale, FolderArchive, ArrowRight, CornerRightDown, MapPin, Building2, User } from 'lucide-react';",
    "import { X, Calendar, Lock, Globe, Users, ShieldAlert, Folder, Download, ExternalLink, Hash, Clock, FileText, ChevronRight, Eye, RefreshCw, MessageSquare, Plus, CheckCircle, Search, Save, AlertTriangle, Trash2, BrainCircuit, Activity, Edit3, Image as ImageIcon, Scale, FolderArchive, ArrowRight, CornerRightDown, MapPin, Building2, User } from 'lucide-react';\nimport { TimelineView } from './TimelineView';"
  );
  
  // Find where timeline tab is rendered.
  // We want to add `<TimelineView entityType="case_files" entityId={caseId} />` below the legacy JSON timeline.
  
  content = content.replace(
    /\{\(currentCase\.timeline \|\| \[\]\)\.map\(\(t, idx\) => \([\s\S]*?\}\)/,
    "{(currentCase.timeline || []).map((t: any, idx: number) => (\n                      <div key={idx} className=\"relative flex gap-6 pb-8 last:pb-0\">\n                        <div className=\"flex flex-col items-center\">\n                          <div className=\"w-3 h-3 rounded-full bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.6)] z-10\" />\n                          <div className=\"w-px h-full bg-gray-800 -mt-1\" />\n                        </div>\n                        <div className=\"pt-0\">\n                          <span className=\"text-cyan-400 font-mono text-sm tracking-widest font-bold\">\n                            {t.date}\n                          </span>\n                          <h4 className=\"text-gray-200 mt-1 uppercase text-sm tracking-wider font-semibold\">\n                            {t.event}\n                          </h4>\n                          <p className=\"text-gray-400 text-sm mt-2 max-w-2xl\">\n                            {t.description}\n                          </p>\n                        </div>\n                      </div>\n                    ))}\n                  </div>\n                </div>\n              </div>\n              <div className=\"mt-8\">\n                <TimelineView entityType=\"case_files\" entityId={caseId} />"
  );

  fs.writeFileSync('src/components/CaseDetailModal.tsx', content);
}
