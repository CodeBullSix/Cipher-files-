import fs from 'fs';
let content = fs.readFileSync('src/components/CaseDetailModal.tsx', 'utf8');

// I want to just find the block from 1010 to 1025 and replace it.
const lines = content.split('\n');

// Let's just find the exact text we have around the problem area.
// We have:
//               </div>
// 
//               <div className="mt-8 pt-8 border-t border-gray-800">
//                 <TimelineView entityType="case_files" entityId={currentCase.id} />
//               </div>
//             </div>
// 
//             {/* Additional Info that used to be part of timeline or overview */}
//             <div className="mt-8 pt-8 border-t border-gray-800 space-y-6">

const target = `              </div>
              
              <div className="mt-8 pt-8 border-t border-gray-800">
                <TimelineView entityType="case_files" entityId={currentCase.id} />
              </div>
            </div>
            
            {/* Additional Info that used to be part of timeline or overview */}
            <div className="mt-8 pt-8 border-t border-gray-800 space-y-6">`;

const replacement = `              </div>
              
              <div className="mt-8 pt-8 border-t border-gray-800">
                <TimelineView entityType="case_files" entityId={currentCase.id} />
              </div>
            
            {/* Additional Info that used to be part of timeline or overview */}
            <div className="mt-8 pt-8 border-t border-gray-800 space-y-6">`;

content = content.replace(target, replacement);
fs.writeFileSync('src/components/CaseDetailModal.tsx', content);
