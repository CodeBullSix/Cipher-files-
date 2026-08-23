import React, { useState, useEffect } from 'react';
import { 
  X, 
  ShieldAlert, 
  Users, 
  FileText, 
  Activity, 
  CheckCircle, 
  XCircle, 
  Trash2, 
  UserCheck, 
  Lock, 
  Unlock,
  Key,
  Shield,
  Sparkles,
  RefreshCw,
  Search
} from 'lucide-react';
import { UserProfile, UserRole, CaseFile, TheorySubmission } from '../types';
import { ArchiveEvidence } from '../types';
import { ApiService } from '../services/apiService';
import { EvidenceDetailModal } from './EvidenceDetailModal';
import { Database } from 'lucide-react';
import { AuthService } from '../services/authService';
import { FirestoreService } from '../services/firestoreService';
import { sound } from '../utils/audio';

interface AdminConsoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile | null;
  cases: CaseFile[];
  onRefreshCases?: () => void;
}

export const AdminConsoleModal: React.FC<AdminConsoleModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  cases,
  onRefreshCases
}) => {  const [activeTab, setActiveTab] = useState<'users' | 'moderation' | 'evidence' | 'audit'>('users');

  
  const [reviewEvidence, setReviewEvidence] = useState<ArchiveEvidence[]>([]);
  const [selectedArchiveEvidence, setSelectedArchiveEvidence] = useState<ArchiveEvidence | null>(null);

  useEffect(() => {
    if (isOpen && activeTab === 'evidence') {
      ApiService.getEvidence({ status: 'UNDER_REVIEW' })
        .then(data => setReviewEvidence(data.items || data))
        .catch(err => console.error(err));
    }
  }, [isOpen, activeTab]);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const isAdmin = currentUser?.role === 'admin';
  const isModerator = isAdmin || currentUser?.role === 'moderator';

  useEffect(() => {
    if (isOpen) {
      loadUsers();
    }
  }, [isOpen]);

  const loadUsers = async () => {
    setIsLoading(true);
    try {
      const allUsers = await ApiService.getUsers();
      setUsers(allUsers);
    } catch (e) {
      console.error('Failed to load users', e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRoleChange = async (targetUser: UserProfile, newRole: UserRole) => {
    if (!isAdmin) {
      alert('Only administrators can adjust investigator security clearances.');
      return;
    }

    sound.click();
    try {
      await ApiService.setUserRole(targetUser.uid, newRole);
      setUsers(prev => prev.map(u => u.uid === targetUser.uid ? { ...u, role: newRole } : u));
      setStatusMessage(`Clearance updated: ${targetUser.callsign} is now [${newRole.toUpperCase()}].`);
      setTimeout(() => setStatusMessage(null), 3000);
      sound.blip();
    } catch (err) {
      console.error(err);
      alert('Failed to update role in security registry.');
    }
  };

  const handleToggleBan = async (targetUser: UserProfile) => {
    if (!isAdmin && !isModerator) return;
    sound.click();
    const newBannedState = !targetUser.isBanned;
    try {
      await AuthService.toggleUserBan(targetUser.uid, newBannedState);
      setUsers(prev => prev.map(u => u.uid === targetUser.uid ? { ...u, isBanned: newBannedState } : u));
      setStatusMessage(`Investigator ${targetUser.callsign} status set to ${newBannedState ? 'RESTRICTED' : 'AUTHORIZED'}.`);
      setTimeout(() => setStatusMessage(null), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteCase = async (caseId: string, title: string) => {
    if (!confirm(`Are you sure you want to expunge dossier "${title}" from the public archive?`)) return;
    sound.click();
    try {
      await FirestoreService.deleteCase(caseId);
      onRefreshCases?.();
      setStatusMessage(`Dossier "${title}" permanently expunged.`);
      setTimeout(() => setStatusMessage(null), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-5xl h-[88vh] bg-[#070A12] border border-cyan-500/40 rounded-xl shadow-2xl flex flex-col overflow-hidden text-gray-200">
        
        {/* Top Header */}
        <div className="px-6 py-4 bg-[#04060B] border-b border-cyan-500/20 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-mono text-base font-bold text-white tracking-wider">MAJESTIC COMMAND CENTER</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-mono border border-cyan-500/40 font-bold">
                  {currentUser?.role?.toUpperCase() || 'OPERATIVE'} ACCESS
                </span>
              </div>
              <p className="text-xs text-gray-400 font-mono">
                Administrator: {currentUser?.email || 'Authorized'} • Firebase Security Hardened
              </p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status Toast Notification */}
        {statusMessage && (
          <div className="bg-emerald-950/80 border-b border-emerald-500/40 px-6 py-2 text-xs font-mono text-emerald-300 flex items-center justify-between animate-fadeIn">
            <span>✓ {statusMessage}</span>
            <button onClick={() => setStatusMessage(null)} className="text-emerald-400 hover:text-white">✕</button>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="px-6 bg-[#090D18] border-b border-gray-800 flex space-x-6 text-xs font-mono">
          <button
            onClick={() => { setActiveTab('users'); sound.click(); }}
            className={`py-3 flex items-center space-x-2 border-b-2 font-medium transition-colors ${
              activeTab === 'users' 
                ? 'border-cyan-400 text-cyan-400' 
                : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Investigator Registry ({users.length})</span>
          </button>

          <button
            onClick={() => { setActiveTab('moderation'); sound.click(); }}
            className={`py-3 flex items-center space-x-2 border-b-2 font-medium transition-colors ${
              activeTab === 'moderation' 
                ? 'border-cyan-400 text-cyan-400' 
                : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Archive Moderation ({cases.length} Dossiers)</span>
          </button>

          <button
            onClick={() => { setActiveTab('audit'); sound.click(); }}
            className={`py-3 flex items-center space-x-2 border-b-2 font-medium transition-colors ${
              activeTab === 'audit' 
                ? 'border-cyan-400 text-cyan-400' 
                : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>System Telemetry & Security</span>
          </button>
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-[#05070E]">
          
          {/* TAB 1: USER REGISTRY */}
          {activeTab === 'users' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-gray-800">
                <div>
                  <h3 className="text-sm font-bold text-white font-mono">INVESTIGATOR ACCESS CONTROL & ROLES</h3>
                  <p className="text-xs text-gray-400 font-mono">Appoint moderators, assign archivists, and manage investigator clearances.</p>
                </div>

                <div className="flex items-center space-x-2 w-full sm:w-auto">
                  <div className="relative flex-1 sm:w-64">
                    <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-gray-500" />
                    <input 
                      type="text"
                      placeholder="Search callsign or email..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-8 pr-3 py-1.5 bg-gray-900 border border-gray-800 rounded-lg text-xs text-white font-mono focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                  <button 
                    onClick={loadUsers}
                    className="p-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg transition-colors"
                    title="Refresh List"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
                  </button>
                </div>
              </div>

              {/* Users Table */}
              <div className="border border-gray-800 rounded-xl overflow-hidden bg-gray-950/60">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-[#0B101E] text-gray-400 border-b border-gray-800">
                    <tr>
                      <th className="p-3">Investigator</th>
                      <th className="p-3">Callsign</th>
                      <th className="p-3">Tier</th>
                      <th className="p-3">Clearance Role</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-900">
                    {users
                      .filter(u => 
                        u.displayName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        u.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        u.callsign?.toLowerCase().includes(searchQuery.toLowerCase())
                      )
                      .map(u => (
                        <tr key={u.uid} className="hover:bg-gray-900/40 transition-colors">
                          <td className="p-3">
                            <div className="font-semibold text-white">{u.displayName}</div>
                            <div className="text-[10px] text-gray-500">{u.email}</div>
                          </td>
                          <td className="p-3">
                            <span className="text-cyan-400 font-bold">{u.callsign}</span>
                          </td>
                          <td className="p-3">
                            <span className={`px-2 py-0.5 rounded text-[10px] ${
                              u.tier === 'VIP_MAJESTIC' 
                                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                                : u.tier === 'BENEFACTOR'
                                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                                  : 'bg-gray-800 text-gray-400'
                            }`}>
                              {u.tier || 'FREE'}
                            </span>
                          </td>
                          <td className="p-3">
                            {isAdmin ? (
                              <select
                                value={u.role}
                                onChange={(e) => handleRoleChange(u, e.target.value as UserRole)}
                                className="bg-gray-900 border border-gray-700 rounded px-2 py-1 text-xs text-cyan-300 font-mono focus:outline-none focus:border-cyan-400"
                              >
                                <option value="operative">Operative</option>
                                <option value="archivist">Archivist</option>
                                <option value="moderator">Moderator</option>
                                <option value="admin">Administrator</option>
                              </select>
                            ) : (
                              <span className={`px-2 py-0.5 rounded uppercase font-bold text-[10px] ${
                                u.role === 'admin' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                                u.role === 'moderator' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' :
                                u.role === 'archivist' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                                'bg-gray-800 text-gray-400'
                              }`}>
                                {u.role}
                              </span>
                            )}
                          </td>
                          <td className="p-3">
                            {u.isBanned ? (
                              <span className="px-2 py-0.5 rounded bg-red-950 text-red-400 text-[10px] border border-red-800">
                                BANNED
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 text-[10px] border border-emerald-800">
                                ACTIVE
                              </span>
                            )}
                          </td>
                          <td className="p-3 text-right">
                            {true && (
                              <button
                                onClick={() => handleToggleBan(u)}
                                className={`px-2 py-1 rounded text-[10px] font-mono border transition-colors ${
                                  u.isBanned 
                                    ? 'bg-emerald-950 hover:bg-emerald-900 text-emerald-400 border-emerald-700' 
                                    : 'bg-red-950 hover:bg-red-900 text-red-400 border-red-800'
                                }`}
                              >
                                {u.isBanned ? 'Unban Operative' : 'Ban Operative'}
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 2: ARCHIVE MODERATION */}
          {activeTab === 'moderation' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-gray-800">
                <div>
                  <h3 className="text-sm font-bold text-white font-mono">CONSPIRACY ARCHIVE & DOSSIER MODERATION</h3>
                  <p className="text-xs text-gray-400 font-mono">Review, approve, or expunge published theories and investigations.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {cases.map((c) => (
                  <div 
                    key={c.id}
                    className="p-4 rounded-xl bg-gray-900/60 border border-gray-800 hover:border-cyan-500/30 flex flex-col justify-between space-y-3 transition-colors"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono text-cyan-400 font-bold">{c.caseNumber}</span>
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-gray-800 text-gray-400 font-mono">{c.category}</span>
                      </div>
                      <h4 className="text-sm font-bold text-white mt-1">{c.title}</h4>
                      <p className="text-xs text-gray-400 line-clamp-2 mt-1">{c.claim}</p>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-gray-800/80 text-[11px] font-mono">
                      <div className="text-gray-400">
                        Belief Score: <span className="text-cyan-400">{c.beliefScore || 50}%</span> • {c.commentCount || 0} debates
                      </div>
                      <button
                        onClick={() => handleDeleteCase(c.id, c.title)}
                        className="px-2 py-1 rounded bg-red-950/60 hover:bg-red-900 text-red-400 border border-red-800/50 flex items-center space-x-1 transition-colors"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Expunge</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: AUDIT & SECURITY */}
          {activeTab === 'audit' && (
            <div className="space-y-6 font-mono text-xs">
              <div>
                <h3 className="text-sm font-bold text-white">SECURITY AUDIT & TELEMETRY</h3>
                <p className="text-gray-400">Real-time status of CIPHER encryption layers, Firebase schemas, and admin credentials.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-gray-900/60 border border-cyan-500/30 space-y-1">
                  <div className="text-gray-400">Firebase Firestore</div>
                  <div className="text-base font-bold text-emerald-400 flex items-center space-x-1.5">
                    <CheckCircle className="w-4 h-4" />
                    <span>ONLINE (Enterprise)</span>
                  </div>
                  <div className="text-[10px] text-gray-500">noble-lamp-6skkt</div>
                </div>

                <div className="p-4 rounded-xl bg-gray-900/60 border border-cyan-500/30 space-y-1">
                  <div className="text-gray-400">E2E Cryptographic Layer</div>
                  <div className="text-base font-bold text-cyan-400 flex items-center space-x-1.5">
                    <Shield className="w-4 h-4" />
                    <span>SECURE CHANNEL / TLS</span>
                  </div>
                  <div className="text-[10px] text-gray-500">Client-Side Armored</div>
                </div>

                <div className="p-4 rounded-xl bg-gray-900/60 border border-cyan-500/30 space-y-1">
                  <div className="text-gray-400">Primary Administrator</div>
                  <div className="text-base font-bold text-amber-300 flex items-center space-x-1.5">
                    <UserCheck className="w-4 h-4" />
                    
                  </div>
                  <div className="text-[10px] text-gray-500">Master Clearance 5</div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#090D18] border border-gray-800 space-y-2">
                <h4 className="font-bold text-white text-xs">Security Protocol Rules</h4>
                <ul className="list-disc list-inside space-y-1 text-gray-400 text-[11px] leading-relaxed">
                  <li>Zero-Trust Role-Based Access Control enforced directly via Firestore Security Rules.</li>
                  <li>Direct messages transmitted over secure TLS connections.</li>
                  <li>Moderator promotion privileges strictly isolated to Primary Master Admin account.</li>
                  <li>Real-time database mutations validated through Eight Pillars validation helpers.</li>
                </ul>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
