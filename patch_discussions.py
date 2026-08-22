import re

with open('src/components/DiscussionsView.tsx', 'r') as f:
    content = f.read()

# Replace handleVoteThread
content = re.sub(
    r'const handleVoteThread = async \(e: React.MouseEvent, threadId: string\) => {[\s\S]*?};',
    '''const handleVoteThread = async (e: React.MouseEvent, threadId: string) => {
    e.stopPropagation();
    sound.click();
    try {
      const { ApiService } = await import('../services/apiService');
      await ApiService.voteDiscussion(threadId, 1);
      // Optimistic update
      setDiscussions(prev => prev.map(d => d.id === threadId ? { ...d, upvotes: d.upvotes + 1, userVote: 'up' } : d));
    } catch (err) {
      console.error(err);
    }
  };''',
    content
)

# Replace handleVoteReply
content = re.sub(
    r'const handleVoteReply = async \(commentId: string, dir: \'up\' \| \'down\'\) => {[\s\S]*?};',
    '''const handleVoteReply = async (commentId: string, dir: 'up' | 'down') => {
    sound.click();
  };''',
    content
)

# In handleCreateThread, replace try/catch with ApiService call
content = re.sub(
    r'try {[\s\S]*?await FirestoreService\.createDiscussion\(newThread\);[\s\S]*?} catch {[\s\S]*?StorageService\.createDiscussion\([\s\S]*?\}',
    '''try {
      const { ApiService } = await import('../services/apiService');
      const apiResp = await ApiService.createDiscussion({
        title: newTitle.trim(),
        content: newInitialComment.trim(),
        caseFileId: newCaseId,
        tags: tags
      });
      setShowCreateModal(false);
      setNewTitle('');
      setNewInitialComment('');
      // Optimistic update
      setDiscussions(prev => [{
        id: apiResp.id,
        title: apiResp.title,
        initialComment: apiResp.content,
        authorName: activeProfile?.displayName || 'Unknown',
        authorUid: activeProfile?.uid,
        createdAt: apiResp.createdAt,
        upvotes: 0,
        commentCount: 0,
        tags: tags
      }, ...prev]);
    } catch (err) {
      console.error(err);
    }''',
    content
)

# In handlePostReply, replace try/catch with ApiService call
content = re.sub(
    r'try {[\s\S]*?await FirestoreService\.addDiscussionComment\(activeThreadId, newComm\);[\s\S]*?} catch {[\s\S]*?StorageService\.postComment\([\s\S]*?\}',
    '''try {
      const { ApiService } = await import('../services/apiService');
      const apiResp = await ApiService.createReply(activeThreadId, replyContent.trim());
      setReplyContent('');
      // Optimistic update
      setThreadComments(prev => [...prev, {
        id: apiResp.id,
        content: apiResp.content,
        authorName: activeProfile?.displayName || 'Unknown',
        timestamp: apiResp.createdAt,
        upvotes: 0,
        downvotes: 0
      }]);
    } catch (err) {
      console.error(err);
      alert('Unable to post reply. Discussion may be locked.');
    }''',
    content
)

# Add Mod controls
content = re.sub(
    r'(<div className="flex items-center justify-between gap-4">[\s\S]*?)(<button\s*onClick={\(e\) => handleVoteThread\(e, activeThread\.id\))',
    r'''\1
                {/* Moderation Controls */}
                {(activeProfile?.role === 'MODERATOR' || activeProfile?.role === 'ADMIN') && (
                  <div className="flex gap-2">
                    <button
                      onClick={async (e) => {
                        e.stopPropagation();
                        const { ApiService } = await import('../services/apiService');
                        if (activeThread.locked) {
                          await ApiService.unlockDiscussion(activeThread.id);
                          setDiscussions(prev => prev.map(d => d.id === activeThread.id ? { ...d, locked: false } : d));
                        } else {
                          await ApiService.lockDiscussion(activeThread.id);
                          setDiscussions(prev => prev.map(d => d.id === activeThread.id ? { ...d, locked: true } : d));
                        }
                      }}
                      className="px-3 py-1.5 rounded-lg border border-yellow-700 bg-yellow-900/20 text-yellow-300 text-xs font-mono transition-colors hover:bg-yellow-800/40"
                    >
                      {activeThread.locked ? 'Unlock' : 'Lock'}
                    </button>
                    <button
                      onClick={async (e) => {
                        e.stopPropagation();
                        const { ApiService } = await import('../services/apiService');
                        if (activeThread.deletedAt) {
                          await ApiService.restoreDiscussion(activeThread.id);
                          setDiscussions(prev => prev.map(d => d.id === activeThread.id ? { ...d, deletedAt: null } : d));
                        } else {
                          await ApiService.deleteDiscussion(activeThread.id);
                          setDiscussions(prev => prev.map(d => d.id === activeThread.id ? { ...d, deletedAt: new Date().toISOString() } : d));
                          setActiveThreadId(null);
                        }
                      }}
                      className="px-3 py-1.5 rounded-lg border border-red-700 bg-red-900/20 text-red-300 text-xs font-mono transition-colors hover:bg-red-800/40"
                    >
                      {activeThread.deletedAt ? 'Restore' : 'Delete'}
                    </button>
                  </div>
                )}
                \2''',
    content
)

# Add Locked badge to thread view
content = re.sub(
    r'(<h2 className="text-xl md:text-2xl font-mono text-white font-bold leading-tight">[\s\S]*?{activeThread\.title}\s*</h2>)',
    r'''\1
              {activeThread.locked && (
                <div className="mt-2 inline-flex items-center gap-1.5 px-2 py-1 rounded bg-yellow-900/30 border border-yellow-700/50 text-yellow-400 text-[11px] font-mono uppercase font-bold">
                  <Lock className="w-3.5 h-3.5" />
                  Thread Locked
                </div>
              )}''',
    content
)

# Add Lock warning and disable reply input
content = re.sub(
    r'(<textarea\s*value={replyContent}\s*onChange={\(e\) => setReplyContent\(e\.target\.value\)}\s*placeholder="Submit your findings or peer-review to this thread...")',
    r'''{activeThread.locked ? (
                  <div className="p-4 bg-yellow-900/20 border border-yellow-700/50 rounded-lg text-yellow-400 text-sm font-mono text-center flex items-center justify-center gap-2">
                    <Lock className="w-4 h-4" />
                    This discussion has been locked by a moderator. No new replies can be added.
                  </div>
                ) : (
                \1''',
    content
)

# Close the parens for the reply block
content = re.sub(
    r'(<button\s*onClick={handlePostReply}\s*disabled={isUploadingNewMedia \|\| !replyContent\.trim\(\)}\s*className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-black text-xs font-mono font-bold rounded-lg uppercase cursor-pointer">\s*Submit\s*</button>\s*</div>\s*</div>)',
    r'''\1
                )}''',
    content
)

# Add Locked badge to list view
content = re.sub(
    r'(<div className="flex items-center gap-2 mb-2\.5">)',
    r'''\1
                        {disc.locked && (
                          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-yellow-900/30 border border-yellow-700/50 text-yellow-400" title="Locked Discussion">
                            <Lock className="w-3 h-3" />
                          </span>
                        )}''',
    content
)

with open('src/components/DiscussionsView.tsx', 'w') as f:
    f.write(content)
