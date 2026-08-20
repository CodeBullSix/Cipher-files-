// Media processing, validation, and embed URL parsing for Cipher Files

export interface ParsedMedia {
  type: 'image' | 'video' | 'youtube';
  url: string;
  embedUrl?: string;
  thumbnailUrl?: string;
}

/**
 * Parses user-pasted URL to determine if it's an image, direct video, YouTube, or Vimeo.
 */
export function parseMediaUrl(inputUrl: string): ParsedMedia | null {
  if (!inputUrl || typeof inputUrl !== 'string') return null;
  const url = inputUrl.trim();
  if (!url) return null;

  // 1. YouTube Link (standard, shortened, or shorts)
  const ytMatch = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/i);
  if (ytMatch && ytMatch[1]) {
    const videoId = ytMatch[1];
    return {
      type: 'youtube',
      url,
      embedUrl: `https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1`,
      thumbnailUrl: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
    };
  }

  // 2. Vimeo Link
  const vimeoMatch = url.match(/(?:vimeo\.com\/)(\d+)/i);
  if (vimeoMatch && vimeoMatch[1]) {
    const vimeoId = vimeoMatch[1];
    return {
      type: 'youtube', // can use iframe embed
      url,
      embedUrl: `https://player.vimeo.com/video/${vimeoId}`,
      thumbnailUrl: undefined
    };
  }

  // 3. Direct Video File (mp4, webm, ogg, mov, or data:video)
  if (
    url.startsWith('data:video/') || 
    url.startsWith('blob:') || 
    /\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(url)
  ) {
    return {
      type: 'video',
      url
    };
  }

  // 4. Image File (png, jpg, jpeg, webp, gif, svg, avif, or data:image)
  if (
    url.startsWith('data:image/') || 
    /\.(png|jpe?g|webp|gif|svg|avif)(\?.*)?$/i.test(url) ||
    url.includes('images.unsplash.com') ||
    url.includes('imgur.com')
  ) {
    return {
      type: 'image',
      url
    };
  }

  // Default fallback if it's a generic web image or valid http url
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return {
      type: 'image',
      url
    };
  }

  return null;
}

/**
 * Process uploaded video file (limit max size ~25MB for local storage/dataURL or blob)
 */
export async function processVideoUpload(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('video/')) {
      return reject(new Error('Selected file must be a video format (MP4, WebM, OGG).'));
    }

    if (file.size > 25 * 1024 * 1024) {
      return reject(new Error('Video file size exceeds 25MB limit. Consider using a YouTube or external video URL.'));
    }

    const reader = new FileReader();
    reader.onload = () => {
      resolve(reader.result as string);
    };
    reader.onerror = () => reject(new Error('Failed to read video file.'));
    reader.readAsDataURL(file);
  });
}
