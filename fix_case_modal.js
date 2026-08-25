import fs from 'fs';
let content = fs.readFileSync('src/components/CaseDetailModal.tsx', 'utf8');

// The file currently has:
// {(currentCase.timeline || []).map((t: any, idx: number) => (
// ...
// </div>
// </div>
// </div>
// <div className="mt-8">
// <TimelineView entityType="case_files" entityId={currentCase.id} />
// 
// <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
// {(currentCase.connectedCaseIds || []).map((connId) => (
// <div
// key={connId}
// onClick={() => { onJumpCase(connId); sound.click(); }}

// We need to restore the closing tags for the timeline map and the section wrapper for Connected Case Files.
const target = `</div>
              </div>
              <div className="mt-8">
                <TimelineView entityType="case_files" entityId={currentCase.id} />
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {(currentCase.connectedCaseIds || []).map((connId) => (
                    <div
                      key={connId}
                      onClick={() => { onJumpCase(connId); sound.click(); }}`;

const replacement = `</div>
              </div>
              <div className="mt-8 pt-8 border-t border-gray-800">
                <TimelineView entityType="case_files" entityId={currentCase.id} />
              </div>
            </div>
            
            {/* Additional Info that used to be part of timeline or overview */}
            <div className="mt-8 pt-8 border-t border-gray-800 space-y-6">
                <div>
                  <h3 className="font-mono text-sm font-bold text-gray-400 uppercase mb-4">
                    CONNECTED INVESTIGATIONS
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {(currentCase.connectedCaseIds || []).map((connId: any) => (
                      <div
                        key={connId}
                        onClick={() => { onJumpCase(connId); sound.click(); }}`;

content = content.replace(target, replacement);
fs.writeFileSync('src/components/CaseDetailModal.tsx', content);
