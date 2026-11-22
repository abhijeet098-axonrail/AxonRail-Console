import React, { useState, useEffect } from 'react';

export const BootScreen: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setExpanded(true), 600);
    const t2 = setTimeout(() => onComplete(), 2200);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-neutral-950 flex items-center justify-center z-50 overflow-hidden font-mono text-5xl font-black text-white select-none">
      <div className="flex items-center">
        <span className="text-cyan-400">A</span>
        <div className="overflow-hidden transition-all duration-1000 flex items-center" style={{ maxWidth: expanded ? '150px' : '0px', opacity: expanded ? 1 : 0 }}>
          <span className="text-neutral-200 font-medium">xon</span>
        </div>
        <span className="text-cyan-500">R</span>
        <div className="overflow-hidden transition-all duration-1000 flex items-center" style={{ maxWidth: expanded ? '150px' : '0px', opacity: expanded ? 1 : 0 }}>
          <span className="text-neutral-400 font-medium">ail</span>
        </div>
      </div>
    </div>
  );
};
