import React from 'react';
import { renderToString } from 'react-dom/server';

const TestComponent = () => {
  const aiBriefContent = "### Forensic Assessment\nLine 2";
  return (
    <div className="text-xs font-sans text-gray-300 space-y-2 leading-relaxed bg-black/40 p-3 border border-amber-500/20 rounded">
      {aiBriefContent?.split('\n').map((line, i) => (
        <p key={i} className={line.startsWith('#') ? 'font-bold text-amber-400 font-mono text-[11px] mt-2 mb-1' : ''}>
          {line.replace(/#/g, '')}
        </p>
      ))}
    </div>
  );
};

console.log(renderToString(<TestComponent />));
