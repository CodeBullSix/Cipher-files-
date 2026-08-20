import React, { useState, useRef } from 'react';
import { Category, EvidenceRating, CaseFile, UserProfile } from '../types';
import { FirestoreService } from '../services/firestoreService';
import { GeminiService } from '../services/geminiService';
import { processImageUpload } from '../utils/imageUpload';
import { processVideoUpload, parseMediaUrl } from '../utils/mediaUtils';
import { MediaAttachmentViewer } from './MediaAttachmentViewer';
import { 
  X, 
  Sparkles, 
  Send, 
  FileText, 
  CheckCircle2, 
  HelpCircle, 
  ArrowRight, 
  ArrowLeft,
  Wand2,
  RefreshCw,
  Image as ImageIcon,
  Flame,
  ShieldAlert,
  Percent,
  Film,
  Video,
  ExternalLink
} from 'lucide-react';
import { sound } from '../utils/audio';

interface Props {
  onClose: () => void;
  onSubmitted: () => void;
  currentUser: UserProfile | null;
}

export const SubmitTheoryModal: React.FC<Props> = ({ onClose, onSubmitted, currentUser }) => {
  const [step, setStep] = useState<number>(1);
  const [isAiStructuring, setIsAiStructuring] = useState<boolean>(false);
  const [rawDeclassifyText, setRawDeclassifyText] = useState<string>('');

  // Form states
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [category, setCategory] = useState<Category>('UFOS_UAP');
  const [claim, setClaim] = useState('');
  const [summary, setSummary] = useState('');
  const [knownFactsText, setKnownFactsText] = useState('');
  const [speculationsText, setSpeculationsText] = useState('');
  const [sourcesText, setSourcesText] = useState('');
  const [beliefScore, setBeliefScore] = useState<number>(75);
  const [status, setStatus] = useState<EvidenceRating>('UNVERIFIED');
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [videoUrl, setVideoUrl] = useState<string>('');
  const [uploadedVideo, setUploadedVideo] = useState<string | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isUploadingVideo, setIsUploadingVideo] = useState(false);
  const [tagsText, setTagsText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  // Run AI Auto-Structuring on raw notes
  const handleAiAutoStructure = async () => {
    if (!rawDeclassifyText.trim() || isAiStructuring) return;
    setIsAiStructuring(true);
    sound.click();

    try {
      const parsed = await GeminiService.declassifyText(rawDeclassifyText);
      if (parsed) {
        if (parsed.suggestedTitle) setTitle(parsed.suggestedTitle);
        if (parsed.category) setCategory(parsed.category as Category);
        if (parsed.coreClaim) setClaim(parsed.coreClaim);
        if (parsed.documentedFacts) setKnownFactsText(parsed.documentedFacts.join('\n'));
        if (parsed.suggestedRating) setStatus(parsed.suggestedRating as EvidenceRating);
        if (parsed.speculativePoints) setSpeculationsText(parsed.speculativePoints.join('\n'));
        sound.blip();
        setStep(1); // Jump to review parsed form
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsAiStructuring(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploadingImage(true);
      const dataUrl = await processImageUpload(file);
      setCoverImage(dataUrl);
      sound.click();
    } catch (err) {
      console.error('Image processing failed:', err);
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploadingVideo(true);
      const dataUrl = await processVideoUpload(file);
      setUploadedVideo(dataUrl);
      sound.click();
    } catch (err) {
      console.error('Video processing failed:', err);
    } finally {
      setIsUploadingVideo(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !claim.trim()) return;

    sound.click();
    setIsSubmitting(true);

    const whatWeKnow = knownFactsText.split('\n').map(s => s.trim()).filter(Boolean);
    const speculations = speculationsText.split('\n').map(s => s.trim()).filter(Boolean);
    const sources = sourcesText.split('\n').map(s => s.trim()).filter(Boolean);
    const tags = tagsText.split(',').map(s => s.trim()).filter(Boolean);

    const caseId = `theory-${Date.now()}-${title.toLowerCase().replace(/[^a-z0-9]+/g, '-').substring(0, 30)}`;
    const caseNumber = `FILE-${Math.floor(1000 + Math.random() * 9000)}`;
    const finalVideoUrl = uploadedVideo || (videoUrl.trim() ? videoUrl.trim() : undefined);

    const evidenceItems = [
      ...sources.map((src, i) => ({
        id: `ev-sub-${i}`,
        title: `Community Source #${i + 1}`,
        type: 'USER_SUBMISSION' as const,
        rating: status,
        isSupporting: true,
        provenance: src,
        authenticity: 'UNPROVEN' as const,
        summary: src,
        context: 'Submitted with dossier',
        votes: 1
      })),
      ...(finalVideoUrl ? [{
        id: `ev-video-${Date.now()}`,
        title: 'Forensic Video / Telemetry Exhibit',
        type: 'AUDIO_VIDEO' as const,
        rating: status,
        isSupporting: true,
        provenance: 'Submitted by Operative with theory dossier',
        authenticity: 'UNPROVEN' as const,
        summary: 'Primary video documentation and audio-visual telemetry record.',
        context: 'Direct media attachment uploaded by investigator.',
        sourceUrl: finalVideoUrl,
        votes: 1
      }] : [])
    ];

    const newCase: CaseFile = {
      id: caseId,
      caseNumber,
      title: title.trim(),
      subtitle: subtitle.trim() || 'Community Investigative Theory Dossier',
      category,
      status,
      officialVerdict: 'Under community investigation & open debate.',
      coverImage: coverImage || undefined,
      summary: summary.trim() || claim.trim(),
      claim: claim.trim(),
      claimOrigin: `Submitted by ${currentUser?.callsign || 'Field Investigator'}`,
      whatWeKnow: whatWeKnow.length > 0 ? whatWeKnow : ['Initial report filed to public archive.'],
      speculations: speculations.length > 0 ? speculations : [claim.trim()],
      evidenceList: evidenceItems,
      timeline: [{
        id: `tl-1`,
        date: new Date().toISOString().split('T')[0],
        title: 'Theory Published to CIPHER Archive',
        description: claim.trim(),
        rating: status
      }],
      documents: [],
      entities: [],
      connectedCaseIds: [],
      views: 1,
      commentCount: 0,
      bookmarkCount: 0,
      authorUid: currentUser?.uid || 'guest-operative',
      authorName: currentUser?.displayName || 'Field Investigator',
      authorCallsign: currentUser?.callsign || 'AGENT-ANON',
      authorRole: currentUser?.role || 'operative',
      beliefScore,
      upvotes: 1,
      downvotes: 0,
      mindblownCount: 1,
      skepticCount: 0,
      tags: tags.length > 0 ? tags : ['Theory', category],
      createdAt: new Date().toISOString()
    };

    try {
      await FirestoreService.createCase(newCase);
      sound.blip();
      onSubmitted();
      onClose();
    } catch (err) {
      console.error('Failed to submit theory:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-4xl bg-[#090C16] border border-cyan-500/40 rounded-2xl shadow-2xl overflow-hidden text-gray-200 flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="px-6 py-4 bg-[#05070E] border-b border-cyan-500/20 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-mono text-base font-bold text-white tracking-wider">CREATE CONSPIRACY THEORY DOSSIER</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 font-mono border border-cyan-800 uppercase">
                  COMMUNITY HUB
                </span>
              </div>
              <p className="text-xs text-gray-400 font-mono">Publish theories, share evidence, and open discussions for peer-investigation.</p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* AI Declassification Assistant Banner */}
        <div className="px-6 py-3 bg-[#0D1322] border-b border-cyan-500/20 flex items-center justify-between text-xs font-mono">
          <div className="flex items-center space-x-2 text-cyan-300">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>Have raw leak notes or transcripts? Use AI Auto-Dossier Synthesizer:</span>
          </div>
          <button
            type="button"
            onClick={() => setStep(step === 2 ? 1 : 2)}
            className="px-3 py-1 rounded bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 transition-colors flex items-center space-x-1.5"
          >
            <Wand2 className="w-3.5 h-3.5" />
            <span>{step === 2 ? 'Return to Manual Form' : 'AI Note Synthesizer'}</span>
          </button>
        </div>

        {/* Body Form */}
        <div className="flex-1 overflow-y-auto p-6 bg-[#05070E]">
          {step === 2 ? (
            /* AI RAW PARSER STEP */
            <div className="space-y-4 max-w-2xl mx-auto font-mono">
              <div>
                <h3 className="text-sm font-bold text-white">PASTE RAW EVIDENCE, FORUM LEAK, OR RESEARCH NOTES</h3>
                <p className="text-xs text-gray-400 mt-1">Our AI engine will parse your raw input into structured hypotheses, documented facts, speculative lore, and category tags.</p>
              </div>

              <textarea 
                rows={10}
                value={rawDeclassifyText}
                onChange={(e) => setRawDeclassifyText(e.target.value)}
                placeholder="Paste unformatted text, declassified snippets, eyewitness accounts, or forum theories here..."
                className="w-full p-4 rounded-xl bg-gray-950 border border-gray-800 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-cyan-400 leading-relaxed font-mono"
              />

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-2 rounded-lg bg-gray-800 text-gray-300 text-xs hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={!rawDeclassifyText.trim() || isAiStructuring}
                  onClick={handleAiAutoStructure}
                  className="px-5 py-2 rounded-lg bg-cyan-400 hover:bg-cyan-300 disabled:opacity-50 text-black font-bold text-xs flex items-center space-x-2"
                >
                  {isAiStructuring ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Synthesizing Dossier...</span>
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-3.5 h-3.5" />
                      <span>Synthesize into Form</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : (
            /* MANUAL FULL FORM */
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Row 1: Title & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2 space-y-1.5">
                  <label className="block text-xs font-mono text-cyan-400 font-bold">
                    THEORY / DOSSIER TITLE *
                  </label>
                  <input 
                    type="text"
                    required
                    placeholder="e.g. Hollow Earth Agartha Expedition, Tartaria Mud Flood..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-gray-950 border border-gray-800 rounded-lg text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-mono text-cyan-400 font-bold">
                    CATEGORY *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as Category)}
                    className="w-full px-3.5 py-2.5 bg-gray-950 border border-gray-800 rounded-lg text-xs text-cyan-300 focus:outline-none focus:border-cyan-400 font-mono"
                  >
                    <option value="UFOS_UAP">UFOs & Non-Human Intelligence</option>
                    <option value="GOVERNMENT_INTELLIGENCE">Government & Intelligence Programs</option>
                    <option value="ANCIENT_MYSTERIES">Ancient Mysteries & Lost Civilizations</option>
                    <option value="QUANTUM_REALITY">Quantum Reality & Simulation</option>
                    <option value="SECRET_SOCIETIES">Secret Societies & Deep State</option>
                    <option value="MONEY_POWER">Money, Central Banks & Power</option>
                    <option value="GLOBAL_EVENTS">Global Events & False Flags</option>
                    <option value="PSYCHOLOGY_CONTROL">Mind Control & Subliminals</option>
                    <option value="CRYPTIDS">Cryptids & Paranormal</option>
                    <option value="UNSOLVED">Unsolved Anomalies</option>
                  </select>
                </div>
              </div>

              {/* Row 2: Subtitle & Theory Classification */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2 space-y-1.5">
                  <label className="block text-xs font-mono text-gray-400">
                    SUBTITLE / HOOK
                  </label>
                  <input 
                    type="text"
                    placeholder="e.g. Subterranean Entrances & Admiral Byrd's Polar Telemetry"
                    value={subtitle}
                    onChange={(e) => setSubtitle(e.target.value)}
                    className="w-full px-3.5 py-2 bg-gray-950 border border-gray-800 rounded-lg text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-mono text-gray-400">
                    INITIAL EVIDENCE RATING
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as EvidenceRating)}
                    className="w-full px-3.5 py-2 bg-gray-950 border border-gray-800 rounded-lg text-xs text-cyan-300 focus:outline-none focus:border-cyan-400 font-mono"
                  >
                    <option value="UNVERIFIED">UNVERIFIED // COMPELLING LORE</option>
                    <option value="DISPUTED">DISPUTED // COMPETING THEORIES</option>
                    <option value="CONFIRMED">CONFIRMED // DECLASSIFIED DOCS</option>
                    <option value="DEBUNKED">DEBUNKED // ALTERNATIVE EXPLANATION</option>
                  </select>
                </div>
              </div>

              {/* Row 3: Core Claim */}
              <div className="space-y-1.5">
                <label className="block text-xs font-mono text-cyan-400 font-bold">
                  CORE HYPOTHESIS & THEORY CLAIM *
                </label>
                <textarea 
                  required
                  rows={3}
                  placeholder="Explain what is alleged to have occurred and why it matters..."
                  value={claim}
                  onChange={(e) => setClaim(e.target.value)}
                  className="w-full p-3.5 bg-gray-950 border border-gray-800 rounded-lg text-xs text-white placeholder-gray-600 focus:outline-none focus:border-cyan-400 font-mono"
                />
              </div>

              {/* Row 4: Cover Image & Video Exhibits */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Cover Image Upload */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-mono text-cyan-400 font-bold">
                    EVIDENCE / COVER PHOTO (SCAN / PNG / JPG)
                  </label>
                  <input 
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    accept="image/*"
                    className="hidden"
                  />

                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-gray-800 hover:border-cyan-500/50 rounded-xl p-4 bg-gray-950/40 text-center cursor-pointer transition-colors group flex flex-col items-center justify-center space-y-2 min-h-[140px]"
                  >
                    {coverImage ? (
                      <div className="relative group/img w-full flex flex-col items-center">
                        <img src={coverImage} alt="Cover preview" className="max-h-32 rounded-lg object-cover border border-cyan-500/40" />
                        <span className="text-[10px] font-mono text-cyan-400 block mt-1">Click to replace photo</span>
                      </div>
                    ) : (
                      <>
                        <ImageIcon className="w-6 h-6 text-gray-500 group-hover:text-cyan-400 transition-colors" />
                        <div className="text-xs font-mono text-gray-300">
                          {isUploadingImage ? 'Processing image...' : 'Click to select or drag & drop photo scan'}
                        </div>
                        <span className="text-[10px] text-gray-500 font-mono">PNG, JPG, WebP supported</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Video Clip or Embed */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-mono text-rose-400 font-bold">
                    VIDEO FOOTAGE / TELEMETRY (MP4 / YOUTUBE)
                  </label>
                  <input 
                    type="file"
                    ref={videoInputRef}
                    onChange={handleVideoUpload}
                    accept="video/*"
                    className="hidden"
                  />

                  <div 
                    onClick={() => videoInputRef.current?.click()}
                    className="border-2 border-dashed border-gray-800 hover:border-rose-500/50 rounded-xl p-3 bg-gray-950/40 text-center cursor-pointer transition-colors group flex flex-col items-center justify-center space-y-1.5 min-h-[90px]"
                  >
                    {uploadedVideo ? (
                      <div className="text-xs font-mono text-rose-300 flex items-center gap-1.5">
                        <Film className="w-4 h-4 text-rose-400" />
                        <span>Video file attached. Click to replace.</span>
                      </div>
                    ) : (
                      <>
                        <Video className="w-6 h-6 text-gray-500 group-hover:text-rose-400 transition-colors" />
                        <div className="text-xs font-mono text-gray-300">
                          {isUploadingVideo ? 'Reading video...' : 'Upload video clip or telemetry'}
                        </div>
                      </>
                    )}
                  </div>

                  <input
                    type="url"
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    placeholder="Or paste YouTube / video URL (e.g. https://youtu.be/...)"
                    className="w-full px-3 py-1.5 bg-gray-950 border border-gray-800 rounded-lg text-xs text-rose-300 placeholder-gray-600 focus:outline-none focus:border-rose-400 font-mono"
                  />
                </div>
              </div>

              {/* Media Preview if attached */}
              {(coverImage || uploadedVideo || videoUrl.trim()) && (
                <div className="p-3 rounded-xl bg-black/60 border border-cyan-500/30 space-y-2">
                  <div className="text-[10px] font-mono text-cyan-400 font-bold">
                    ATTACHED MEDIA PREVIEW:
                  </div>
                  <MediaAttachmentViewer
                    imageUrl={coverImage || undefined}
                    videoUrl={uploadedVideo || (videoUrl.trim() ? videoUrl.trim() : undefined)}
                    allowZoom={false}
                  />
                </div>
              )}

              {/* Row 5: Conviction / Belief Score Slider */}
              <div className="p-4 rounded-xl bg-gray-950/60 border border-gray-800 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-mono text-cyan-400 font-bold flex items-center space-x-1.5">
                    <Flame className="w-4 h-4 text-amber-400" />
                    <span>THEORIST CONVICTION / BELIEF METER</span>
                  </label>
                  <span className="text-sm font-mono font-extrabold text-cyan-300">{beliefScore}%</span>
                </div>
                <input 
                  type="range"
                  min="0"
                  max="100"
                  value={beliefScore}
                  onChange={(e) => setBeliefScore(Number(e.target.value))}
                  className="w-full accent-cyan-400 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] font-mono text-gray-500">
                  <span>0% Skeptical / Speculative</span>
                  <span>50% Open Investigation</span>
                  <span>100% Fully Convinced</span>
                </div>
              </div>

              {/* Row 6: Known Points vs Speculation */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-mono text-gray-300">
                    DOCUMENTED FACTS / RECORDS (1 per line)
                  </label>
                  <textarea 
                    rows={4}
                    placeholder="e.g. Operation Highjump launched Aug 1946&#10;Admiral Byrd reported anomalous ice-free areas"
                    value={knownFactsText}
                    onChange={(e) => setKnownFactsText(e.target.value)}
                    className="w-full p-3 bg-gray-950 border border-gray-800 rounded-lg text-xs text-white placeholder-gray-600 focus:outline-none focus:border-cyan-400 font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-mono text-gray-300">
                    SPECULATIVE LORE & ANOMALIES (1 per line)
                  </label>
                  <textarea 
                    rows={4}
                    placeholder="e.g. Leaked flight logs describing green valleys&#10;Subterranean acoustic resonance"
                    value={speculationsText}
                    onChange={(e) => setSpeculationsText(e.target.value)}
                    className="w-full p-3 bg-gray-950 border border-gray-800 rounded-lg text-xs text-white placeholder-gray-600 focus:outline-none focus:border-cyan-400 font-mono"
                  />
                </div>
              </div>

              {/* Row 7: Tags */}
              <div className="space-y-1.5">
                <label className="block text-xs font-mono text-gray-400">
                  TAGS (comma-separated)
                </label>
                <input 
                  type="text"
                  placeholder="e.g. Antarctica, Hollow Earth, Byrd, UFOs"
                  value={tagsText}
                  onChange={(e) => setTagsText(e.target.value)}
                  className="w-full px-3.5 py-2 bg-gray-950 border border-gray-800 rounded-lg text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
                />
              </div>

              {/* Footer Actions */}
              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-800">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-xs font-mono text-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !title.trim() || !claim.trim()}
                  className="px-6 py-2.5 rounded-lg bg-cyan-400 hover:bg-cyan-300 disabled:opacity-50 text-black font-extrabold text-xs font-mono flex items-center space-x-2 transition-all shadow-lg"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSubmitting ? 'Publishing Dossier...' : 'Publish to Community Archive'}</span>
                </button>
              </div>

            </form>
          )}
        </div>

      </div>
    </div>
  );
};
