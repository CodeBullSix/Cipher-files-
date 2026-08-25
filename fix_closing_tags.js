import fs from 'fs';
let content = fs.readFileSync('src/components/CaseDetailModal.tsx', 'utf8');

const target = `                    ))}
                  </div>
                </div>
              </div>
              <div className="mt-8 pt-8 border-t border-gray-800">
                <TimelineView entityType="case_files" entityId={currentCase.id} />
              </div>
            </div>`;

const replacement = `                    ))}
              </div>
              
              <div className="mt-8 pt-8 border-t border-gray-800">
                <TimelineView entityType="case_files" entityId={currentCase.id} />
              </div>
            </div>
          )}`;

content = content.replace(target, replacement);
fs.writeFileSync('src/components/CaseDetailModal.tsx', content);
