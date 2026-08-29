const fs = require('fs');
const file = 'src/components/DiscussionsView.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Thread actions lock/unlock/delete
content = content.replace(
  /await ApiService\.lockDiscussion\(activeThread\.id\);/g,
  "await ApiService.moderateContent('DISCUSSION', activeThread.id, 'LOCK');"
);
content = content.replace(
  /await ApiService\.unlockDiscussion\(activeThread\.id\);/g,
  "await ApiService.moderateContent('DISCUSSION', activeThread.id, 'UNLOCK');"
);
content = content.replace(
  /await ApiService\.deleteDiscussion\(activeThread\.id\);/g,
  "await ApiService.moderateContent('DISCUSSION', activeThread.id, 'REMOVE');"
);
content = content.replace(
  /await ApiService\.restoreDiscussion\(activeThread\.id\);/g,
  "await ApiService.moderateContent('DISCUSSION', activeThread.id, 'RESTORE');"
);

// 2. Add inline comment moderation
const isModeratorCheck = "(currentUser?.role === 'MODERATOR' || currentUser?.role === 'ADMIN')";

const inlineModerationHtml = `
            <div className="flex items-center gap-4 bg-black/40 px-3 py-1.5 rounded-lg border border-gray-800">
              <button
                onClick={() => handleVoteReply(comment.id, 'up')}
`;

const modActionsHtml = `
            {${isModeratorCheck} && (
              <div className="flex items-center gap-2 ml-auto">
                {comment.deletedAt ? (
                  <button
                    onClick={async () => {
                      try {
                        const { ApiService } = await import('../services/apiService');
                        await ApiService.moderateContent('REPLY', comment.id, 'RESTORE');
                        // Update local state by re-fetching or marking
                        const res = await ApiService.getDiscussionReplies(activeThread!.id);
                        const commentsTree = buildCommentTree(res);
                        setThreadComments(commentsTree);
                      } catch (err) {
                        console.error(err);
                      }
                    }}
                    className="flex items-center gap-1.5 text-xs font-mono text-emerald-400 hover:text-emerald-300 bg-emerald-950/30 px-2 py-1 rounded border border-emerald-900/50 transition-colors"
                  >
                    <span>Restore</span>
                  </button>
                ) : (
                  <button
                    onClick={async () => {
                      if (!window.confirm('Remove this comment?')) return;
                      try {
                        const { ApiService } = await import('../services/apiService');
                        await ApiService.moderateContent('REPLY', comment.id, 'REMOVE');
                        // Re-fetch
                        const res = await ApiService.getDiscussionReplies(activeThread!.id);
                        const commentsTree = buildCommentTree(res);
                        setThreadComments(commentsTree);
                      } catch (err) {
                        console.error(err);
                      }
                    }}
                    className="flex items-center gap-1.5 text-xs font-mono text-red-400 hover:text-red-300 bg-red-950/30 px-2 py-1 rounded border border-red-900/50 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Remove</span>
                  </button>
                )}
              </div>
            )}
            <div className="flex items-center gap-4 bg-black/40 px-3 py-1.5 rounded-lg border border-gray-800">
              <button
                onClick={() => handleVoteReply(comment.id, 'up')}
`;

content = content.replace(inlineModerationHtml, modActionsHtml);

fs.writeFileSync(file, content);
