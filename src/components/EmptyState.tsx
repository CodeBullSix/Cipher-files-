import React from 'react';
import { LucideIcon } from 'lucide-react';

interface Props {
  icon: LucideIcon;
  title: string;
  message?: string;
  action?: React.ReactNode;
}

export const EmptyState: React.FC<Props> = ({ icon: Icon, title, message, action }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center bg-cipher-surface border border-gray-800/60 rounded-xl border-dashed">
      <Icon className="w-8 h-8 text-gray-600 mb-4" />
      <h3 className="font-mono text-sm font-bold text-white uppercase tracking-widest mb-2">{title}</h3>
      {message && <p className="font-mono text-xs text-gray-500 max-w-md">{message}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
};
