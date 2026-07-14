import React, { useEffect, useState } from 'react';

/**
 * Boot sequence: animated brand mark with rotating tech rings and a progress
 * meter. Calls onDone after a fixed minimum dwell so the entry feels considered.
 */
export const LoadingScreen: React.FC<{ onDone: () => void }> = ({ onDone }) => {
  const [progress, setProgress] = useState(0);
  const [hint, setHint] = useState('INITIALISING_CRYOFIELD');

  useEffect(() => {
    const start = performance.now();
    const duration = 2400;
    let raf = 0;
    const tick = () => {
      const elapsed = performance.now() - start;
      const p = Math.min(1, elapsed / duration);
      setProgress(p);
      if (p < 0.35) setHint('INITIALISING_CRYOFIELD');
      else if (p < 0.7) setHint('CARVING_BRICKS');
      else if (p < 0.95) setHint('IGNITING_PORTFOLIO');
      else setHint('READY');
      if (p < 1) raf = requestAnimationFrame(tick);
      else setTimeout(onDone, 350);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [onDone]);

  const pct = Math.round(progress * 100);

  return (
    <div className="fixed inset-0 z-[80] bg-arctic flex flex-col items-center justify-center text-ice-100">
      <div className="absolute inset-0 grid-bg opacity-40" />
      <div className="absolute top-6 left-6 font-mono text-xs tracking-[0.3em] text-ice-300/80">
        // SYS_BOOT
      </div>
      <div className="absolute top-6 right-6 font-mono text-xs tracking-[0.3em] text-ice-300/80">
        v1.0.0
      </div>

      <div className="relative w-[280px] h-[280px] md:w-[360px] md:h-[360px]">
        {/* outer rotating ring */}
        <div className="absolute inset-0 rounded-full border border-ice-200/30 animate-spin-slower" style={{
          maskImage: 'radial-gradient(circle, transparent 70%, black 73%)'
        }}>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-ice-100 rounded-full" />
        </div>

        {/* mid ring with notches */}
        <div className="absolute inset-6 rounded-full border border-dashed border-ice-300/40 animate-spin-reverse" />

        {/* inner ring */}
        <div className="absolute inset-14 rounded-full border border-ice-100/60 animate-spin-slow" />

        {/* center mark */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="font-display font-bold text-5xl md:text-6xl text-glow tracking-tight">
            J69
          </div>
        </div>

        {/* corner brackets */}
        <div className="absolute -inset-2 corner-bracket" />
      </div>

      <div className="mt-12 flex items-center gap-4 font-mono text-xs tracking-[0.25em] text-ice-200">
        <span className="text-ice-400">[</span>
        <span className="w-56 h-[2px] bg-ice-700/60 rounded overflow-hidden relative">
          <span
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-ice-300 to-ice-100"
            style={{ width: `${pct}%`, transition: 'width 80ms linear' }}
          />
        </span>
        <span className="text-ice-400">]</span>
        <span className="tabular-nums">{String(pct).padStart(3, '0')}%</span>
      </div>

      <div className="mt-6 font-mono text-[10px] md:text-xs tracking-[0.35em] text-ice-300/70">
        {hint}
      </div>

      <div className="absolute bottom-6 left-6 font-mono text-[10px] tracking-[0.3em] text-ice-400/70">
        // JIM69_PORTFOLIO_OS
      </div>
      <div className="absolute bottom-6 right-6 font-mono text-[10px] tracking-[0.3em] text-ice-400/70">
        SECURE_ENCLAVE
      </div>
    </div>
  );
};
