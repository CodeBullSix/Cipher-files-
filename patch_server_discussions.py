with open('server.ts', 'r') as f:
    content = f.read()

content = content.replace("import { getDiscussions, createDiscussion, getDiscussionReplies, createReply, voteDiscussion, getDiscussionById, updateDiscussionStatus }", "import { getDiscussions, createDiscussion, getDiscussionReplies, createReply, voteDiscussion, getDiscussionById, updateDiscussionStatus, getDiscussionEvidence }")

endpoint = """
app.get('/api/discussions/:id/evidence', requireAuth, async (req: AuthRequest, res) => {
  try {
    const evidence = await getDiscussionEvidence(req.params.id);
    res.json(evidence);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch discussion evidence' });
  }
});
"""

if "app.get('/api/discussions/:id/evidence'" not in content:
    content = content.replace("app.post('/api/discussions', requireAuth, async (req: AuthRequest, res) => {", endpoint + "\napp.post('/api/discussions', requireAuth, async (req: AuthRequest, res) => {")

with open('server.ts', 'w') as f:
    f.write(content)
