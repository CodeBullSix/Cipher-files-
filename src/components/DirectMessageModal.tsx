import { ApiService } from '../services/apiService';
import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Send, 
  Lock, 
  Unlock, 
  ShieldCheck, 
  Image as ImageIcon, 
  UserPlus, 
  MessageSquare, 
  Terminal, 
  CheckCheck,
  Search,
  Sparkles
} from 'lucide-react';
import { Conversation, DirectMessage, UserProfile } from '../types';
import { FirestoreService } from '../services/firestoreService';
import { AuthService } from '../services/authService';
import { processImageUpload } from '../utils/imageUpload';
import { sound } from '../utils/audio';

interface DirectMessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile | null;
  targetUser?: UserProfile | null;
}

export const DirectMessageModal: React.FC<DirectMessageModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  targetUser
}) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<DirectMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [attachedImage, setAttachedImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [showKeyInspect, setShowKeyInspect] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [allUsers, setAllUsers] = useState<UserProfile[]>([]);
  const [showUserPicker, setShowUserPicker] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load conversations
  useEffect(() => {
    if (!isOpen || !currentUser) return;

    const unsubscribe = FirestoreService.listenConversations(currentUser.uid, (convs) => {
      setConversations(convs);
      if (!activeConversation && convs.length > 0) {
        setActiveConversation(convs[0]);
      }
    });

    ApiService.getUsers().then(users => {
      setAllUsers(users.filter(u => u.uid !== currentUser.uid));
    });

    return () => unsubscribe();
  }, [isOpen, currentUser]);

  // Handle direct target user opening
  useEffect(() => {
    if (targetUser && currentUser && isOpen) {
      FirestoreService.getOrCreateConversation(currentUser, targetUser).then(conv => {
        setActiveConversation(conv);
      });
    }
  }, [targetUser, currentUser, isOpen]);

  // Load messages for active conversation
  useEffect(() => {
    if (!activeConversation) {
      setMessages([]);
      return;
    }

    const unsubscribe = FirestoreService.listenMessages(activeConversation.id, (msgs) => {
      setMessages(msgs);
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    });

    return () => unsubscribe();
  }, [activeConversation]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if ((!inputText.trim() && !attachedImage) || !activeConversation || !currentUser) return;

    sound.click();
    const plain = inputText.trim();
    const newMsg: DirectMessage = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      conversationId: activeConversation.id,
      senderUid: currentUser.uid,
      senderName: currentUser.displayName,
      senderCallsign: currentUser.callsign,
      content: plain,
      attachmentUrl: attachedImage || undefined,
      createdAt: new Date().toISOString()
    };

    setInputText('');
    setAttachedImage(null);

    try {
      await FirestoreService.sendDirectMessage(activeConversation.id, newMsg);
      sound.blip();
    } catch (err) {
      console.error('Failed to send DM:', err);
    }
  };

  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const dataUrl = await processImageUpload(file);
      setAttachedImage(dataUrl);
      sound.click();
    } catch (err) {
      console.error('Image upload failed', err);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSelectUserToChat = async (user: UserProfile) => {
    if (!currentUser) return;
    setShowUserPicker(false);
    const conv = await FirestoreService.getOrCreateConversation(currentUser, user);
    setActiveConversation(conv);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-5xl h-[85vh] bg-[#0A0D14] border border-[#00E5FF]/30 rounded-xl shadow-2xl flex flex-col overflow-hidden text-gray-200">
        
        {/* Top Header */}
        <div className="px-5 py-3.5 bg-[#05070A] border-b border-[#00E5FF]/20 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-[#00E5FF]/10 border border-[#00E5FF]/30 flex items-center justify-center text-[#00E5FF]">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-mono text-sm font-bold text-white tracking-wider">CIPHER DIRECT FREQUENCY</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-mono border border-emerald-500/30">
                  SECURE CHANNEL
                </span>
              </div>
              <p className="text-[11px] text-gray-400 font-mono">Secure Channel • Tactical Operative Comms</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button 
              onClick={() => setShowKeyInspect(!showKeyInspect)}
              className="px-2.5 py-1 text-xs font-mono rounded bg-gray-900 border border-gray-700 hover:border-[#00E5FF]/50 text-gray-300 flex items-center space-x-1.5 transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#00E5FF]" />
              
            </button>

            <button 
              onClick={onClose}
              className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Key Inspector Banner */}
        {showKeyInspect && (
          <div className="px-5 py-2.5 bg-[#0e1626] border-b border-[#00E5FF]/20 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
            <div className="flex items-center space-x-2 text-cyan-300">
              <Terminal className="w-4 h-4" />
              <span>Symmetric Key Passphrase:</span>
              
            </div>
            <div className="text-gray-400 text-[11px]">
              
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex-1 flex overflow-hidden">
          
          {/* Left Sidebar: Conversations List */}
          <div className="w-72 sm:w-80 border-r border-gray-800 bg-[#07090F] flex flex-col">
            <div className="p-3 border-b border-gray-800 flex items-center justify-between gap-2">
              <div className="relative flex-1">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-gray-500" />
                <input 
                  type="text"
                  placeholder="Filter transmissions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 bg-gray-900/80 border border-gray-800 rounded-lg text-xs text-white placeholder-gray-500 font-mono focus:outline-none focus:border-[#00E5FF]/50"
                />
              </div>
              <button 
                onClick={() => setShowUserPicker(true)}
                title="New Classified Transmission"
                className="p-1.5 rounded-lg bg-[#00E5FF]/10 text-[#00E5FF] hover:bg-[#00E5FF]/20 border border-[#00E5FF]/30 transition-colors"
              >
                <UserPlus className="w-4 h-4" />
              </button>
            </div>

            {/* User Picker Modal */}
            {showUserPicker && (
              <div className="p-3 bg-gray-900 border-b border-[#00E5FF]/30 max-h-48 overflow-y-auto space-y-1">
                <div className="flex items-center justify-between pb-1 text-[11px] font-mono text-cyan-400">
                  <span>SELECT RECIPIENT</span>
                  <button onClick={() => setShowUserPicker(false)} className="text-gray-400 hover:text-white">✕</button>
                </div>
                {allUsers.map(user => (
                  <button
                    key={user.uid}
                    onClick={() => handleSelectUserToChat(user)}
                    className="w-full text-left p-2 rounded bg-black/40 hover:bg-[#00E5FF]/10 border border-gray-800 hover:border-[#00E5FF]/30 flex items-center justify-between transition-colors"
                  >
                    <div>
                      <div className="text-xs font-semibold text-white">{user.displayName}</div>
                      <div className="text-[10px] font-mono text-cyan-400">{user.callsign}</div>
                    </div>
                    <span className="text-[9px] px-1 py-0.5 rounded bg-gray-800 text-gray-400 uppercase font-mono">{user.role}</span>
                  </button>
                ))}
              </div>
            )}

            {/* Conversation Threads */}
            <div className="flex-1 overflow-y-auto divide-y divide-gray-900">
              {conversations.length === 0 ? (
                <div className="p-6 text-center text-gray-500 text-xs font-mono space-y-2">
                  <MessageSquare className="w-8 h-8 mx-auto opacity-30 text-[#00E5FF]" />
                  <p>No active frequencies.</p>
                  <button 
                    onClick={() => setShowUserPicker(true)}
                    className="text-[#00E5FF] hover:underline"
                  >
                    + Transmit to an operative
                  </button>
                </div>
              ) : (
                conversations
                  .filter(c => {
                    const otherUid = c.participants.find(p => p !== currentUser?.uid) || '';
                    const otherName = c.participantNames?.[otherUid] || '';
                    return otherName.toLowerCase().includes(searchQuery.toLowerCase());
                  })
                  .map(conv => {
                    const otherUid = conv.participants.find(p => p !== currentUser?.uid) || '';
                    const otherName = conv.participantNames?.[otherUid] || 'Field Operative';
                    const otherCallsign = conv.participantCallsigns?.[otherUid] || 'AGENT-UNKNOWN';
                    const otherUser = allUsers.find(u => u.uid === otherUid);
                    const otherRole = otherUser?.role || 'operative';
                    const isActive = activeConversation?.id === conv.id;

                    return (
                      <button
                        key={conv.id}
                        onClick={() => {
                          setActiveConversation(conv);
                          sound.click();
                        }}
                        className={`w-full text-left p-3 flex items-center space-x-3 transition-colors ${
                          isActive 
                            ? 'bg-[#00E5FF]/10 border-l-2 border-[#00E5FF]' 
                            : 'hover:bg-gray-900/50'
                        }`}
                      >
                        <div className="w-10 h-10 rounded-lg bg-gray-800 border border-gray-700 flex items-center justify-center font-mono font-bold text-sm text-[#00E5FF]">
                          {otherName.substring(0, 2).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <div className="text-xs font-medium text-white truncate">{otherName}</div>
                            <span className="text-[10px] font-mono text-gray-500">
                              {new Date(conv.lastTimestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <div className="flex items-center space-x-1.5 mt-0.5">
                            <span className="text-[10px] font-mono text-cyan-400 truncate">{otherCallsign}</span>
                            <span className="text-[9px] px-1 py-0.2 rounded bg-gray-800 text-gray-400 uppercase font-mono">{otherRole}</span>
                          </div>
                          <p className="text-[11px] text-gray-400 truncate mt-1">{conv.lastMessage}</p>
                        </div>
                      </button>
                    );
                  })
              )}
            </div>
          </div>

          {/* Right Chat Panel */}
          {activeConversation ? (
            <div className="flex-1 flex flex-col bg-[#050811]">
              
              {/* Active Conversation Banner */}
              {(() => {
                const otherUid = activeConversation.participants.find(p => p !== currentUser?.uid) || '';
                const otherName = activeConversation.participantNames?.[otherUid] || 'Field Operative';
                const otherCallsign = activeConversation.participantCallsigns?.[otherUid] || 'AGENT-UNKNOWN';
                const otherUser = allUsers.find(u => u.uid === otherUid);
                const otherRole = otherUser?.role || 'operative';

                return (
                  <div className="px-5 py-3 bg-[#080B14] border-b border-gray-800 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-9 h-9 rounded-lg bg-[#00E5FF]/10 border border-[#00E5FF]/30 flex items-center justify-center font-mono font-bold text-[#00E5FF]">
                        {otherName.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-bold text-white">{otherName}</span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-400 font-mono border border-cyan-800 uppercase">
                            {otherRole}
                          </span>
                        </div>
                        <p className="text-[11px] font-mono text-cyan-400">{otherCallsign} • SECURE DIRECT CHANNEL</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      
                    </div>
                  </div>
                );
              })()}

              {/* Messages Flow */}
              <div className="flex-1 p-4 overflow-y-auto space-y-4">
                {messages.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-gray-500 space-y-2 font-mono text-xs">
                    <ShieldCheck className="w-10 h-10 opacity-30 text-[#00E5FF]" />
                    <p>Encrypted frequency established. All transmissions are ciphered.</p>
                  </div>
                ) : (
                  messages.map((msg) => {
                    const isMine = msg.senderUid === currentUser?.uid;
                    const decrypted = msg.content;

                    return (
                      <div 
                        key={msg.id}
                        className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}
                      >
                        <div className="flex items-center space-x-2 mb-1 px-1">
                          <span className="text-[10px] font-mono text-gray-400">
                            {isMine ? 'YOU' : msg.senderCallsign || msg.senderName}
                          </span>
                          <span className="text-[9px] font-mono text-gray-600">
                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                          
                        </div>

                        <div className={`max-w-lg rounded-xl p-3 text-xs ${
                          isMine 
                            ? 'bg-[#00E5FF]/15 border border-[#00E5FF]/40 text-cyan-50' 
                            : 'bg-gray-900 border border-gray-800 text-gray-200'
                        }`}>
                          {msg.attachmentUrl && (
                            <div className="mb-2 rounded-lg overflow-hidden border border-cyan-500/30">
                              <img 
                                src={msg.attachmentUrl} 
                                alt="Classified attachment" 
                                className="max-h-64 w-full object-cover"
                              />
                            </div>
                          )}

                          <p className="whitespace-pre-wrap leading-relaxed">{decrypted}</p>

                          
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Attached Image Preview */}
              {attachedImage && (
                <div className="px-4 py-2 bg-gray-900/90 border-t border-cyan-500/20 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <img src={attachedImage} alt="Attachment" className="w-12 h-12 rounded object-cover border border-cyan-500/40" />
                    <span className="text-xs font-mono text-cyan-400">Classified Image Attached</span>
                  </div>
                  <button 
                    onClick={() => setAttachedImage(null)}
                    className="text-xs text-gray-400 hover:text-red-400 font-mono"
                  >
                    Remove
                  </button>
                </div>
              )}

              {/* Message Input Bar */}
              <form 
                onSubmit={handleSendMessage}
                className="p-3 bg-[#080B14] border-t border-gray-800 flex items-center space-x-2"
              >
                <input 
                  type="file" 
                  ref={fileInputRef}
                  onChange={handleImageFileChange}
                  accept="image/*"
                  className="hidden" 
                />
                
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="p-2 text-gray-400 hover:text-[#00E5FF] rounded-lg hover:bg-gray-800 transition-colors"
                  title="Attach Classified Evidence Image"
                >
                  <ImageIcon className="w-5 h-5" />
                </button>

                <input 
                  type="text"
                  placeholder="Compose secure dispatch..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="flex-1 bg-gray-900 border border-gray-800 rounded-lg px-4 py-2 text-xs text-white placeholder-gray-500 font-mono focus:outline-none focus:border-[#00E5FF]/50"
                />

                <button
                  type="submit"
                  disabled={!inputText.trim() && !attachedImage}
                  className="px-4 py-2 bg-[#00E5FF] hover:bg-[#00E5FF]/80 disabled:opacity-40 text-black font-bold text-xs rounded-lg flex items-center space-x-1.5 transition-colors"
                >
                  <span>Transmit</span>
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>

            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-500 space-y-3 font-mono text-xs">
              <Terminal className="w-12 h-12 opacity-30 text-[#00E5FF]" />
              <p>Select an ongoing frequency or start a new transmission with an operative.</p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
