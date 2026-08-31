import React, { useState } from 'react';
import { MediaAttachment } from '../types';
import { parseMediaUrl } from '../utils/mediaUtils';
import { 
  Maximize2, 
  X, 
  Play, 
  Film, 
  Image as ImageIcon, 
  ExternalLink,
  ShieldAlert,
  Sparkles,
  Download
} from 'lucide-react';
import { sound } from '../utils/audio';

interface Props {
  imageUrl?: string;
  videoUrl?: string;
  mediaType?: 'image' | 'video' | 'youtube' | 'none';
  attachments?: MediaAttachment[];
  className?: string;
  allowZoom?: boolean;
}

export const MediaAttachmentViewer: React.FC<Props> = ({
  imageUrl,
  videoUrl,
  mediaType,
  attachments = [],
  className = '',
  allowZoom = true
}) => {
  const [selectedLightboxMedia, setSelectedLightboxMedia] = useState<{
    url: string;
    type: 'image' | 'video' | 'youtube';
    title?: string;
    caption?: string;
  } | null>(null);

  // Compile all media items
  const items: Array<{
    id: string;
    type: 'image' | 'video' | 'youtube';
    url: string;
    title?: string;
    caption?: string;
    embedUrl?: string;
  }> = [];

  // Add primary videoUrl if present
  if (videoUrl) {
    const parsed = parseMediaUrl(videoUrl);
    if (parsed) {
      items.push({
        id: 'primary-video',
        type: parsed.type,
        url: parsed.url,
        embedUrl: parsed.embedUrl,
        title: 'Primary Video Exhibit'
      });
    }
  }

  // Add primary imageUrl if present and not already covered
  if (imageUrl && !items.some(i => i.url === imageUrl)) {
    const parsed = parseMediaUrl(imageUrl);
    items.push({
      id: 'primary-image',
      type: parsed?.type || 'image',
      url: imageUrl,
      embedUrl: parsed?.embedUrl,
      title: 'Primary Evidence Scan'
    });
  }

  // Add attachments
  if (attachments && attachments.length > 0) {
    for (const att of attachments) {
      if (!items.some(i => i.url === att.url)) {
        const parsed = parseMediaUrl(att.url);
        items.push({
          id: att.id || Math.random().toString(),
          type: att.type || parsed?.type || 'image',
          url: att.url,
          embedUrl: parsed?.embedUrl,
          title: att.title,
          caption: att.caption
        });
      }
    }
  }

  if (items.length === 0) return null;

  return (
    <div className={`space-y-3 ${className}`}>
      <div className={`grid gap-3 ${
        items.length === 1 ? 'grid-cols-1' :
        items.length === 2 ? 'grid-cols-1 sm:grid-cols-2' :
        'grid-cols-1 sm:grid-cols-2 md:grid-cols-3'
      }`}>
        {items.map((item, idx) => {
          if (item.type === 'youtube' && item.embedUrl) {
            return (
              <div 
                key={item.id || idx} 
                className="relative rounded-xl overflow-hidden border border-cipher-accent/40 bg-black/90 shadow-lg group"
              >
                <div className="flex items-center justify-between px-3 py-1.5 bg-cipher-surface border-b border-gray-800 text-[10px] font-mono text-cipher-accent">
                  <span className="flex items-center gap-1.5 font-bold">
                    <Film className="w-3 h-3 text-rose-400" />
                    <span>DEBATE FOOTAGE / VIDEO EXHIBIT</span>
                  </span>
                  <a 
                    href={item.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-cipher-accent-hover flex items-center gap-1"
                  >
                    <span>External</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                </div>

                <div className="aspect-video w-full">
                  <iframe
                    src={item.embedUrl}
                    title={item.title || 'Investigative Video Footage'}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>

                {item.caption && (
                  <p className="p-2 text-[11px] font-mono text-gray-400 bg-cipher-panel border-t border-gray-800/80">
                    {item.caption}
                  </p>
                )}
              </div>
            );
          }

          if (item.type === 'video') {
            return (
              <div 
                key={item.id || idx} 
                className="relative rounded-xl overflow-hidden border border-cipher-accent/40 bg-black/90 shadow-lg"
              >
                <div className="flex items-center justify-between px-3 py-1.5 bg-cipher-surface border-b border-gray-800 text-[10px] font-mono text-cipher-accent">
                  <span className="flex items-center gap-1.5 font-bold">
                    <Film className="w-3 h-3 text-cipher-accent" />
                    <span>RECORDED CLIP / TELEMETRY</span>
                  </span>
                </div>

                <div className="relative aspect-video w-full bg-black flex items-center justify-center">
                  <video
                    src={item.url}
                    controls
                    preload="metadata"
                    className="w-full h-full object-contain"
                  />
                </div>

                {item.caption && (
                  <p className="p-2 text-[11px] font-mono text-gray-400 bg-cipher-panel border-t border-gray-800/80">
                    {item.caption}
                  </p>
                )}
              </div>
            );
          }

          // Image item
          return (
            <div 
              key={item.id || idx} 
              className="group relative rounded-xl overflow-hidden border border-gray-800 hover:border-cipher-accent/50 bg-cipher-panel shadow-md transition-all cursor-pointer"
              onClick={() => {
                if (allowZoom) {
                  sound.click();
                  setSelectedLightboxMedia(item);
                }
              }}
            >
              <div className="relative aspect-video sm:aspect-4/3 w-full overflow-hidden bg-black/60 flex items-center justify-center">
                <img
                  src={item.url}
                  alt={item.title || 'Evidence Exhibit'}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  referrerPolicy="no-referrer"
                  loading="lazy"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-3">
                  <span className="text-[10px] font-mono text-cipher-accent-hover font-bold flex items-center gap-1">
                    <ImageIcon className="w-3 h-3" />
                    <span>CLICK TO ENLARGE EXHIBIT</span>
                  </span>
                  <div className="p-1.5 rounded-lg bg-black/70 border border-cipher-accent/40 text-cipher-accent">
                    <Maximize2 className="w-3.5 h-3.5" />
                  </div>
                </div>

                <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/80 border border-cipher-accent/30 text-[9px] font-mono font-bold text-cipher-accent backdrop-blur-sm">
                  EXHIBIT #{idx + 1}
                </div>
              </div>

              {item.caption && (
                <div className="p-2.5 bg-cipher-surface border-t border-gray-800 text-[11px] font-mono text-gray-300 line-clamp-2">
                  {item.caption}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Lightbox Modal for HD Inspection */}
      {selectedLightboxMedia && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-md animate-in fade-in duration-150"
          onClick={() => setSelectedLightboxMedia(null)}
        >
          <div 
            className="relative max-w-4xl w-full max-h-[90vh] flex flex-col rounded-2xl border border-cipher-accent/50 bg-cipher-surface overflow-hidden shadow-[0_0_50px_rgba(0,229,255,0.2)]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Lightbox Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-cipher-base border-b border-cipher-accent/30">
              <div className="flex items-center gap-2 text-xs font-mono text-cipher-accent font-bold">
                <ShieldAlert className="w-4 h-4 text-cipher-accent" />
                <span>PRIMARY EVIDENCE HIGH-RESOLUTION INSPECTION</span>
              </div>
              <button
                onClick={() => setSelectedLightboxMedia(null)}
                className="p-1 rounded-lg hover:bg-gray-800 text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Lightbox Body */}
            <div className="flex-1 overflow-auto bg-black p-2 flex items-center justify-center min-h-[300px]">
              <img
                src={selectedLightboxMedia.url}
                alt={selectedLightboxMedia.title || 'High Resolution Exhibit'}
                className="max-h-[70vh] w-auto object-contain rounded-lg shadow-2xl"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Lightbox Footer */}
            {selectedLightboxMedia.caption && (
              <div className="p-3.5 bg-cipher-panel border-t border-gray-800 text-xs font-mono text-gray-300">
                <span className="text-cipher-accent font-bold mr-2">FORENSIC CAPTION:</span>
                <span>{selectedLightboxMedia.caption}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
