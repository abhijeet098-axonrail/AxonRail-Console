import React, { useState, useEffect } from 'react';

export const BootScreen: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const iv = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(iv);
          setTimeout(onComplete, 250);
          return 100;
        }
        return p + 10;
      });
    }, 150);
    return () => clearInterval(iv);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-[#020617] flex flex-col items-center justify-center font-mono z-50 p-6">
      <div className="relative w-20 h-20 flex items-center justify-center mb-6">
        <div className="absolute inset-0 rounded-full border-2 border-cyan-500/20"></div>
        <div className="absolute inset-0 rounded-full border-t-2 border-r-2 border-cyan-400 animate-spin"></div>
        <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-400/40 flex items-center justify-center text-cyan-400 font-sans font-black text-sm">
          AR
        </div>
      </div>

      <h1 className="font-sans text-2xl font-black tracking-tight text-white">
        AxonRail <span className="text-cyan-400">Console</span>
      </h1>
      <p className="text-[11px] text-neutral-400 mt-1">
        {progress < 40 ? 'Mounting M2M Settlement Gateway...' : progress < 80 ? 'Syncing 6 Utility Agent Nodes...' : 'Developer Sandbox Ready // ₹0.12 Toll'}
      </p>

      <div className="w-60 h-1.5 bg-neutral-900 rounded-full overflow-hidden mt-5 border border-cyan-950">
        <div className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 transition-all duration-150" style={{ width: `${progress}%` }} />
      </div>
      <div className="text-[10px] text-emerald-400 font-bold mt-2">{progress}%</div>
    </div>
  );
};
