import React, { useState } from 'react';
import { UserProfile, InvestigatorRank, UserRole } from '../types';
import { TACTICAL_AVATAR_PRESETS } from '../data/avatarPresets';

interface UserAvatarProps {
  profile?: Partial<UserProfile> | null;
  avatarUrl?: string;
  avatarPreset?: string;
  name?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showBadge?: boolean;
}

export const UserAvatar: React.FC<UserAvatarProps> = ({
  profile,
  avatarUrl: customAvatarUrl,
  avatarPreset: customAvatarPreset,
  name: customName,
  size = 'md',
  className = '',
  showBadge = false
}) => {
  const [imgError, setImgError] = useState(false);

  const url = customAvatarUrl || profile?.avatarUrl;
  const preset = customAvatarPreset || profile?.avatarPreset;
  const displayName = customName || profile?.displayName || profile?.callsign || 'Researcher';
  const role = profile?.role;

  const sizeClasses = {
    xs: 'w-5 h-5 text-[9px]',
    sm: 'w-7 h-7 text-[10px]',
    md: 'w-9 h-9 text-xs',
    lg: 'w-12 h-12 text-sm font-bold',
    xl: 'w-20 h-20 text-lg font-bold'
  };

  const badgeSizeClasses = {
    xs: 'w-2 h-2 -bottom-0.5 -right-0.5',
    sm: 'w-2.5 h-2.5 -bottom-0.5 -right-0.5',
    md: 'w-3 h-3 -bottom-1 -right-1',
    lg: 'w-4 h-4 bottom-0 right-0',
    xl: 'w-5 h-5 bottom-1 right-1'
  };

  const presetObj = preset ? TACTICAL_AVATAR_PRESETS.find(p => p.id === preset) : undefined;
  const initials = displayName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(n => n[0])
    .join('')
    .toUpperCase() || 'CF';

  return (
    <div className={`relative inline-flex shrink-0 ${sizeClasses[size]} ${className}`}>
      <div className="w-full h-full rounded-lg overflow-hidden border border-cipher-accent/30 bg-cipher-elevated flex items-center justify-center font-mono text-cipher-accent-hover shadow-sm select-none">
        {url && !imgError ? (
          <img
            src={url}
            alt={displayName}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        ) : presetObj ? (
          <span className="text-base sm:text-lg select-none" title={presetObj.name}>
            {presetObj.icon}
          </span>
        ) : (
          <span className="font-bold tracking-wider text-cyan-200">
            {initials}
          </span>
        )}
      </div>

      {showBadge && role && (
        <span
          className={`absolute rounded-full border-2 border-cipher-base ${
            role === 'admin'
              ? 'bg-amber-400'
              : role === 'moderator'
              ? 'bg-cipher-accent'
              : role === 'archivist'
              ? 'bg-emerald-400'
              : 'bg-blue-400'
          } ${badgeSizeClasses[size]}`}
          title={`Role: ${role.toUpperCase()}`}
        />
      )}
    </div>
  );
};
