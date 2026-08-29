const fs = require('fs');
const file = 'src/components/InvestigatorProfileModal.tsx';
let content = fs.readFileSync(file, 'utf8');

if (!content.includes('const [isFollowing, setIsFollowing]')) {
  content = content.replace(
    "const [loadingReputation, setLoadingReputation] = useState<boolean>(true);",
    "const [loadingReputation, setLoadingReputation] = useState<boolean>(true);\n  const [isFollowing, setIsFollowing] = useState<boolean>(false);\n  const [followersCount, setFollowersCount] = useState<number>(0);\n  const [followingCount, setFollowingCount] = useState<number>(0);\n  const [followers, setFollowers] = useState<any[]>([]);\n  const [following, setFollowing] = useState<any[]>([]);\n  const [loadingFollows, setLoadingFollows] = useState<boolean>(false);"
  );

  const followEffect = `
  useEffect(() => {
    let mounted = true;
    ApiService.getFollowCounts(activeProfile.uid).then((data: any) => {
      if (mounted && data) {
        setFollowersCount(data.followersCount || 0);
        setFollowingCount(data.followingCount || 0);
      }
    }).catch(console.error);

    if (isOwnProfile || !currentUser) return;
    
    ApiService.getFollowStatus(activeProfile.uid).then((data: any) => {
      if (mounted && data && data.isFollowing !== undefined) {
        setIsFollowing(data.isFollowing);
      }
    }).catch(console.error);

    return () => { mounted = false; };
  }, [activeProfile.uid, currentUser, isOwnProfile]);

  useEffect(() => {
    if (activeTab === 'followers') {
      setLoadingFollows(true);
      ApiService.getFollowers(activeProfile.uid).then((data: any) => {
        setFollowers(data);
      }).catch(console.error).finally(() => setLoadingFollows(false));
    } else if (activeTab === 'following') {
      setLoadingFollows(true);
      ApiService.getFollowing(activeProfile.uid).then((data: any) => {
        setFollowing(data);
      }).catch(console.error).finally(() => setLoadingFollows(false));
    }
  }, [activeTab, activeProfile.uid]);

  const handleToggleFollow = async () => {
    if (!currentUser) return;
    sound.click();
    
    // Optimistic UI (with revert if failed is optional, but we can do it)
    const originalFollowing = isFollowing;
    setIsFollowing(!isFollowing);
    if (!isFollowing) {
      setFollowersCount(prev => prev + 1);
    } else {
      setFollowersCount(prev => prev - 1);
    }

    try {
      if (originalFollowing) {
        await ApiService.unfollowUser(activeProfile.uid);
      } else {
        await ApiService.followUser(activeProfile.uid);
      }
    } catch (e) {
      console.error(e);
      // Revert on fail
      setIsFollowing(originalFollowing);
      if (originalFollowing) {
        setFollowersCount(prev => prev + 1);
      } else {
        setFollowersCount(prev => prev - 1);
      }
    }
  };
`;

  content = content.replace(
    "  useEffect(() => {",
    followEffect + "\n  useEffect(() => {"
  );
  
  // Add Follow/Following Tabs
  content = content.replace(
    "activeTab === 'contributions'",
    "activeTab === 'contributions' || activeTab === 'followers' || activeTab === 'following'"
  );
  
  content = content.replace(
    /onClick=\{\(\) => \{ setActiveTab\('contributions'\); sound\.click\(\); \}\}[\s\S]*?Contributions<\/span>[\s\S]*?<\/button>/,
    `$&
            <button
              onClick={() => { setActiveTab('followers'); sound.click(); }}
              className={\`flex flex-col items-center gap-1.5 p-3 rounded-xl border transition-all \${
                activeTab === 'followers' 
                  ? 'bg-cyan-950/40 border-cyan-500/50 shadow-[0_0_15px_rgba(34,211,238,0.15)] text-cyan-300' 
                  : 'bg-[#0A0E1A] border-gray-800 text-gray-500 hover:text-cyan-400 hover:border-cyan-500/30'
              }\`}
            >
              <Users className={\`w-5 h-5 \${activeTab === 'followers' ? 'text-cyan-400' : ''}\`} />
              <span className="text-[10px] font-mono font-bold tracking-wider">Followers</span>
            </button>
            <button
              onClick={() => { setActiveTab('following'); sound.click(); }}
              className={\`flex flex-col items-center gap-1.5 p-3 rounded-xl border transition-all \${
                activeTab === 'following' 
                  ? 'bg-cyan-950/40 border-cyan-500/50 shadow-[0_0_15px_rgba(34,211,238,0.15)] text-cyan-300' 
                  : 'bg-[#0A0E1A] border-gray-800 text-gray-500 hover:text-cyan-400 hover:border-cyan-500/30'
              }\`}
            >
              <Users className={\`w-5 h-5 \${activeTab === 'following' ? 'text-cyan-400' : ''}\`} />
              <span className="text-[10px] font-mono font-bold tracking-wider">Following</span>
            </button>`
  );

  // Users import
  if (!content.includes('import { Users')) {
    content = content.replace("import { \n  User,", "import { \n  User, Users,");
    content = content.replace("import { User,", "import { User, Users,");
  }

  fs.writeFileSync(file, content);
}
