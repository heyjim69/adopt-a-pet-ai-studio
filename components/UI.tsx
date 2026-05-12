import React, { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

/* -----------------------------------------------------------------------------
 * Reveal — viewport-triggered fade/slide for scroll storytelling.
 * -------------------------------------------------------------------------- */
export const Reveal: React.FC<{ children: React.ReactNode; delay?: number; className?: string }> = ({
  children,
  delay = 0,
  className = ''
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setShown(true), delay);
          obs.disconnect();
        }
      },
      { threshold: 0.18 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [delay]);

  return (
    <div ref={ref} className={`reveal ${shown ? 'in' : ''} ${className}`}>
      {children}
    </div>
  );
};

/* -----------------------------------------------------------------------------
 * SoundToggle — bottom-left audio control using WebAudio ambient drone.
 * -------------------------------------------------------------------------- */
export const SoundToggle: React.FC<{ on: boolean; onToggle: () => void }> = ({ on, onToggle }) => {
  return (
    <button
      onClick={onToggle}
      className="group flex items-center gap-2 px-3 py-2 rounded-md hover:bg-white/5 transition font-mono text-xs tracking-[0.25em] text-ice-100"
      aria-label="Toggle ambient sound"
    >
      <span className="relative inline-flex w-5 h-5 items-center justify-center">
        {on ? (
          <Volume2 className="w-4 h-4 text-ice-100 animate-pulse-soft" />
        ) : (
          <VolumeX className="w-4 h-4 text-ice-400" />
        )}
      </span>
      <span className="opacity-90">Sound: <span className={on ? 'text-ice-100' : 'text-ice-400'}>{on ? 'On' : 'Off'}</span></span>
    </button>
  );
};

/* -----------------------------------------------------------------------------
 * Header — brand mark, subtle nav and manifesto column.
 * -------------------------------------------------------------------------- */
export const Header: React.FC<{ onNav: (id: string) => void }> = ({ onNav }) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-40 px-5 md:px-8 py-5 flex justify-between items-start pointer-events-none">
      <button
        onClick={() => onNav('hero')}
        className="font-display font-bold text-3xl md:text-4xl tracking-tight text-ice-50 text-glow pointer-events-auto"
      >
        jim<span className="text-ice-300">69</span>
      </button>

      <nav className="hidden md:flex items-center gap-8 font-mono text-[11px] tracking-[0.3em] text-ice-200 pointer-events-auto">
        <button onClick={() => onNav('manifesto')} className="hover:text-ice-50 transition">/MANIFESTO</button>
        <button onClick={() => onNav('portfolio')} className="hover:text-ice-50 transition">/PORTFOLIO</button>
        <button onClick={() => onNav('skills')} className="hover:text-ice-50 transition">/SKILLS</button>
        <button onClick={() => onNav('contact')} className="hover:text-ice-50 transition">/CONTACT</button>
      </nav>
    </header>
  );
};

/* -----------------------------------------------------------------------------
 * SideMeta — telemetry strip down the right edge of the hero.
 * -------------------------------------------------------------------------- */
export const SideMeta: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="font-mono text-[10px] tracking-[0.3em] text-ice-300/80">
    <div className="text-ice-400/70">{label}</div>
    <div className="text-ice-100">{value}</div>
  </div>
);

/* -----------------------------------------------------------------------------
 * Bracket — corner-bracket framing for hero / portfolio cards.
 * -------------------------------------------------------------------------- */
export const Bracket: React.FC<{ className?: string }> = ({ className = '' }) => (
  <>
    <span className={`absolute top-0 left-0 w-4 h-4 border-l border-t border-ice-200/70 ${className}`} />
    <span className={`absolute top-0 right-0 w-4 h-4 border-r border-t border-ice-200/70 ${className}`} />
    <span className={`absolute bottom-0 left-0 w-4 h-4 border-l border-b border-ice-200/70 ${className}`} />
    <span className={`absolute bottom-0 right-0 w-4 h-4 border-r border-b border-ice-200/70 ${className}`} />
  </>
);

/* -----------------------------------------------------------------------------
 * Marquee — scrolling text band used between sections.
 * -------------------------------------------------------------------------- */
export const Marquee: React.FC<{ items: string[] }> = ({ items }) => {
  const doubled = [...items, ...items];
  return (
    <div className="relative overflow-hidden py-6 border-y border-ice-700/40 bg-ice-950/40">
      <div className="flex marquee whitespace-nowrap gap-12 font-display font-bold text-3xl md:text-5xl text-ice-100/80">
        {doubled.map((s, i) => (
          <span key={i} className="flex items-center gap-12">
            <span>{s}</span>
            <span className="text-ice-400">/</span>
          </span>
        ))}
      </div>
    </div>
  );
};
