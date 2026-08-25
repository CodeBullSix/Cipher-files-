import fs from 'fs';
let content = fs.readFileSync('src/components/EntityProfileModal.tsx', 'utf8');

if (!content.includes('TimelineView')) {
  content = content.replace(
    "import { X, Edit, Share2, MapPin, Database, Filter, ArrowRight, Activity, Calendar, FileText, ChevronRight, Scale, FolderArchive, ShieldCheck, AlertTriangle, User, Globe, Building2, Plus, Info } from 'lucide-react';",
    "import { X, Edit, Share2, MapPin, Database, Filter, ArrowRight, Activity, Calendar, FileText, ChevronRight, Scale, FolderArchive, ShieldCheck, AlertTriangle, User, Globe, Building2, Plus, Info } from 'lucide-react';\nimport { TimelineView } from './TimelineView';"
  );
  
  // Find where timeline is meant to go. 
  // Looks like it currently just renders `null` or a placeholder.
  
  content = content.replace(
    "{activeTab === 'timeline' && (\n                  <div className=\"flex flex-col items-center justify-center py-20 text-center animate-in fade-in duration-300\">\n                    <Calendar className=\"w-12 h-12 text-gray-700 mb-4\" />\n                    <h3 className=\"text-lg font-mono text-gray-400 mb-2\">Chronological Timeline</h3>\n                    <p className=\"text-gray-500 font-mono text-sm max-w-md\">Timeline generation is part of Phase 3.5.<br/>Events associated with this record will be plotted here.</p>\n                  </div>\n                )}",
    "{activeTab === 'timeline' && (\n                  <TimelineView entityType={type} entityId={entityId} />\n                )}"
  );

  fs.writeFileSync('src/components/EntityProfileModal.tsx', content);
}
