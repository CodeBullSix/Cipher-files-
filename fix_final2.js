import fs from 'fs';
let content = fs.readFileSync('src/components/CaseDetailModal.tsx', 'utf8');

const lines = content.split('\n');
// Let's just locate TimelineView and remove the `</div>` that comes after it, because `TimelineView` should be INSIDE the `space-y-6` div, which also wraps the Connected Investigations.
// Wait, my replacement had:
//               <div className="mt-8 pt-8 border-t border-gray-800">
//                 <TimelineView entityType="case_files" entityId={currentCase.id} />
//               </div>
//             </div>
// Let's remove that `</div>`!

const target = `              <div className="mt-8 pt-8 border-t border-gray-800">
                <TimelineView entityType="case_files" entityId={currentCase.id} />
              </div>
            </div>`;
const replacement = `              <div className="mt-8 pt-8 border-t border-gray-800">
                <TimelineView entityType="case_files" entityId={currentCase.id} />
              </div>`;

content = content.replace(target, replacement);
fs.writeFileSync('src/components/CaseDetailModal.tsx', content);
