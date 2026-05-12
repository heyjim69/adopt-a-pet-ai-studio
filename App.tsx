import React, { useEffect, useRef, useState } from 'react';
import {
  ArrowUpRight, Github, Linkedin, Twitter, Mail, ChevronDown
} from 'lucide-react';
import { PointCloudHero } from './components/PointCloudHero';
import { CrystalView } from './components/CrystalView';
import { IglooScene } from './components/IglooScene';
import { LoadingScreen } from './components/LoadingScreen';
import { Header, SoundToggle, Reveal, Bracket, SideMeta, Marquee } from './components/UI';
import { useAmbient } from './components/useAmbient';
import { PORTFOLIO_ITEMS, STATS, SKILLS, PortfolioItem } from './data';

const App: React.FC = () => {
  const [booted, setBooted] = useState(false);
  const [sound, setSound] = useState(false);
  const [active, setActive] = useState<PortfolioItem | null>(null);
  const [heroIndex, setHeroIndex] = useState(0);
  const [now, setNow] = useState<string>('');

  useAmbient(sound);

  useEffect(() => {
    const tick = () => {
      const d = new Date();
      setNow(
        `${String(d.getUTCHours()).padStart(2,'0')}:${String(d.getUTCMinutes()).padStart(2,'0')}:${String(d.getUTCSeconds()).padStart(2,'0')} UTC`
      );
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const heroSubjects = ['BUILDER', 'DESIGNER', 'ENGINEER', 'EXPLORER'];

  useEffect(() => {
    const id = setInterval(() => {
      setHeroIndex((i) => (i + 1) % heroSubjects.length);
    }, 2200);
    return () => clearInterval(id);
  }, []);

  if (!booted) {
    return <LoadingScreen onDone={() => setBooted(true)} />;
  }

  return (
    <div className="relative min-h-screen bg-arctic text-ice-100 overflow-x-hidden">
      {/* Grid background */}
      <div className="fixed inset-0 grid-bg opacity-30 pointer-events-none" />
      {/* Vignette */}
      <div className="fixed inset-0 vignette pointer-events-none" />

      <Header onNav={scrollTo} />

      {/* Bottom UI bar */}
      <div className="fixed bottom-0 left-0 right-0 z-30 px-5 md:px-8 py-4 flex justify-between items-end pointer-events-none">
        <div className="pointer-events-auto">
          <SoundToggle on={sound} onToggle={() => setSound(s => !s)} />
        </div>
        <div className="hidden md:flex items-end gap-6 pointer-events-auto font-mono text-[10px] tracking-[0.3em] text-ice-300/80">
          <SideMeta label="// LOC" value="DHAKA / BD" />
          <SideMeta label="// CLOCK" value={now} />
          <SideMeta label="// STATUS" value="AVAILABLE_FOR_WORK" />
        </div>
      </div>

      {/* ============================== HERO ============================== */}
      <section id="hero" className="relative min-h-screen flex flex-col items-center justify-center px-5">
        {/* corner brackets framing the hero subject */}
        <div className="relative w-full max-w-[820px] aspect-[3/4] md:aspect-[4/5]">
          <Bracket />
          <PointCloudHero paused={!booted} />

          {/* halo */}
          <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-ice-200/10 to-transparent blur-xl pointer-events-none" />
          {/* ground reflection */}
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-ice-300/10 to-transparent blur-xl pointer-events-none" />

          {/* corner navigation arrows */}
          <button
            onClick={() => scrollTo('portfolio')}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center text-ice-200 hover:text-ice-50 hover:scale-110 transition"
          >
            <span className="font-mono text-2xl">‹</span>
          </button>
          <button
            onClick={() => scrollTo('portfolio')}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center text-ice-200 hover:text-ice-50 hover:scale-110 transition"
          >
            <span className="font-mono text-2xl">›</span>
          </button>

          {/* subject ticker */}
          <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 px-4 py-1 flex items-center gap-3">
            <span className="font-mono text-[10px] text-ice-400">[</span>
            <span className="font-mono text-xs tracking-[0.4em] text-ice-100 min-w-[110px] text-center inline-block">
              {heroSubjects[heroIndex]}
            </span>
            <span className="font-mono text-[10px] text-ice-400">]</span>
          </div>
        </div>

        {/* Hero name & tagline */}
        <div className="relative z-10 mt-16 text-center max-w-3xl">
          <div className="font-mono text-xs tracking-[0.4em] text-ice-300/80 mb-3">
            // PORTFOLIO_OS — V1.0
          </div>
          <h1 className="font-display font-bold text-5xl md:text-7xl tracking-tight leading-[0.95] text-glow">
            JIM<span className="text-ice-300">69</span>
          </h1>
          <p className="mt-5 font-mono text-sm md:text-base text-ice-200/80 tracking-wide">
            Builder at the intersection of <span className="text-ice-50">community</span>,
            <span className="text-ice-50"> AI</span> &amp;
            <span className="text-ice-50"> crypto</span>.
          </p>

          <button
            onClick={() => scrollTo('manifesto')}
            className="mt-10 inline-flex items-center gap-2 text-xs tracking-[0.3em] text-ice-200 hover:text-ice-50 font-mono"
          >
            Scroll down to discover
            <ChevronDown className="w-4 h-4 animate-bounce" />
          </button>
        </div>
      </section>

      <Marquee items={['DESIGN', 'CODE', 'AI', 'CRYPTO', 'COMMUNITY', '3D / WEBGL', 'PRODUCT']} />

      {/* ============================== MANIFESTO ============================== */}
      <section id="manifesto" className="relative py-32 px-5 md:px-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="relative aspect-square w-full max-w-[560px] mx-auto">
            <Bracket />
            <IglooScene />
          </div>
          <Reveal>
            <div className="font-mono text-xs tracking-[0.4em] text-ice-300/80 mb-4">////// MANIFESTO</div>
            <h2 className="font-display font-bold text-4xl md:text-6xl leading-[1.05] text-glow">
              I build small, calm things — that quietly compound.
            </h2>
            <p className="mt-8 text-ice-200/85 leading-relaxed md:text-lg max-w-xl">
              My mission is to build the next generation of consumer brands at the intersection of
              <span className="text-ice-50"> community</span>,
              <span className="text-ice-50"> AI</span> and
              <span className="text-ice-50"> crypto</span> —
              with software that feels considered, fast, and a little bit magic.
            </p>
            <div className="mt-10 grid grid-cols-2 gap-x-10 gap-y-6 max-w-md">
              {STATS.map(s => (
                <div key={s.label} className="border-l border-ice-300/40 pl-4">
                  <div className="font-display text-4xl text-ice-50 font-bold tabular-nums">{s.value}</div>
                  <div className="font-mono text-[10px] tracking-[0.3em] text-ice-300/70 mt-1">{s.label}</div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============================== PORTFOLIO ============================== */}
      <section id="portfolio" className="relative py-24 px-5 md:px-10">
        <div className="max-w-7xl mx-auto">
          <Reveal>
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
              <div>
                <div className="font-mono text-xs tracking-[0.4em] text-ice-300/80 mb-3">////// PORTFOLIO_ARCHIVE</div>
                <h2 className="font-display font-bold text-4xl md:text-6xl text-glow">Specimens, frozen in time.</h2>
              </div>
              <p className="font-mono text-xs text-ice-300/70 tracking-widest max-w-sm">
                Each project is preserved as a crystalline shard — click any to explore the artefact and its readings.
              </p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
            {PORTFOLIO_ITEMS.map((item, idx) => (
              <Reveal key={item.id} delay={idx * 90}>
                <button
                  onClick={() => setActive(item)}
                  className="group relative w-full aspect-[3/4] glass rounded-md overflow-hidden text-left transition-all duration-500 hover:border-ice-200/40 hover:shadow-[0_0_60px_-10px_rgba(199,214,226,0.15)]"
                >
                  <Bracket />

                  {/* 3d crystal */}
                  <div className="absolute inset-0">
                    <CrystalView hue={item.hue} seed={idx * 27 + 13} />
                  </div>

                  {/* subtle scan line */}
                  <div className="absolute inset-0 pointer-events-none opacity-40 mix-blend-overlay"
                    style={{ background: 'repeating-linear-gradient(0deg, transparent 0 2px, rgba(255,255,255,0.05) 2px 3px)' }} />

                  {/* labels */}
                  <div className="absolute top-6 left-6 right-6 flex justify-between font-mono text-[10px] tracking-[0.3em] text-ice-200/85">
                    <div className="leading-relaxed">
                      <div>{item.index}</div>
                      <div className="text-ice-50 text-xs mt-1">{item.title}</div>
                    </div>
                    <div className="text-right">
                      <div>TEMP <span className="text-ice-50">{item.temp}</span></div>
                      <div className="text-ice-300/70">{item.delta}</div>
                    </div>
                  </div>

                  {/* readout lines */}
                  <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-60" preserveAspectRatio="none" viewBox="0 0 100 100">
                    <line x1="14" y1="22" x2="38" y2="48" stroke="rgba(230,238,245,0.6)" strokeWidth="0.15" />
                    <line x1="38" y1="48" x2="46" y2="50" stroke="rgba(230,238,245,0.6)" strokeWidth="0.15" />
                    <circle cx="38" cy="48" r="0.6" fill="rgba(230,238,245,0.85)" />
                    <line x1="86" y1="74" x2="62" y2="62" stroke="rgba(230,238,245,0.6)" strokeWidth="0.15" />
                    <circle cx="62" cy="62" r="0.6" fill="rgba(230,238,245,0.85)" />
                  </svg>

                  {/* bottom label */}
                  <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end font-mono text-[10px] tracking-[0.3em] text-ice-200/90">
                    <span>D {item.date}</span>
                    <span className="inline-flex items-center gap-1 group-hover:text-ice-50">
                      CLICK TO EXPLORE <ArrowUpRight className="w-3 h-3" />
                    </span>
                  </div>
                </button>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============================== SKILLS ============================== */}
      <section id="skills" className="relative py-32 px-5 md:px-10">
        <div className="max-w-7xl mx-auto">
          <Reveal>
            <div className="font-mono text-xs tracking-[0.4em] text-ice-300/80 mb-3">////// CAPABILITIES</div>
            <h2 className="font-display font-bold text-4xl md:text-6xl text-glow max-w-3xl">A toolkit refined by winters.</h2>
          </Reveal>

          <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {SKILLS.map((s, i) => (
              <Reveal key={s.category} delay={i * 80}>
                <div className="relative glass rounded-md p-6 h-full">
                  <Bracket />
                  <div className="font-mono text-xs tracking-[0.3em] text-ice-300/80 mb-5">{s.category}</div>
                  <ul className="space-y-3 font-display text-lg text-ice-50">
                    {s.items.map(item => (
                      <li key={item} className="flex items-center gap-3">
                        <span className="w-1.5 h-1.5 rounded-full bg-ice-200" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <Marquee items={['LET\'S BUILD', 'JIM69', 'AVAILABLE_2026', 'REMOTE_OK', 'TYPESCRIPT', 'WEBGL']} />

      {/* ============================== CONTACT ============================== */}
      <section id="contact" className="relative py-32 px-5 md:px-10">
        <div className="max-w-4xl mx-auto text-center">
          <Reveal>
            <div className="font-mono text-xs tracking-[0.4em] text-ice-300/80 mb-3">////// SIGNAL</div>
            <h2 className="font-display font-bold text-5xl md:text-7xl text-glow leading-[0.95]">
              Got an idea worth freezing in time?
            </h2>
            <p className="mt-6 text-ice-200/85 max-w-xl mx-auto">
              I&apos;m open to selective collaborations on consumer products, AI tools and on-chain experiences.
            </p>

            <a
              href="mailto:hello@jim69.com"
              className="mt-10 inline-flex items-center gap-3 px-6 py-3 border border-ice-300/50 rounded-sm font-mono tracking-[0.3em] text-sm text-ice-50 hover:bg-ice-100 hover:text-ice-950 transition"
            >
              <Mail className="w-4 h-4" />
              HELLO@JIM69.COM
            </a>

            <div className="mt-12 flex justify-center gap-6 text-ice-200">
              <a href="#" className="p-3 hover:text-ice-50 transition"><Twitter className="w-5 h-5" /></a>
              <a href="#" className="p-3 hover:text-ice-50 transition"><Linkedin className="w-5 h-5" /></a>
              <a href="#" className="p-3 hover:text-ice-50 transition"><Github className="w-5 h-5" /></a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============================== FOOTER ============================== */}
      <footer className="relative px-5 md:px-10 py-12 border-t border-ice-700/40">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 font-mono text-[11px] tracking-[0.3em] text-ice-300/80">
          <div>
            <div className="font-display font-bold text-3xl text-ice-50 tracking-tight">jim<span className="text-ice-300">69</span></div>
            <div className="mt-3 text-ice-400/80">// Copyright © {new Date().getFullYear()}</div>
            <div className="text-ice-400/80">Jim69, All Rights Reserved.</div>
          </div>
          <div className="space-y-2">
            <div className="text-ice-400/70">/// MANIFESTO</div>
            <div className="text-ice-200/80 text-[12px] leading-relaxed max-w-xs">
              Building the next generation of consumer brands at the intersection of community, AI and crypto.
            </div>
          </div>
          <div className="space-y-2 md:text-right">
            <div className="text-ice-400/70">/// CONTACT</div>
            <div>HELLO@JIM69.COM</div>
            <div className="flex md:justify-end gap-4 mt-3">
              <a href="#" className="hover:text-ice-50">X</a>
              <a href="#" className="hover:text-ice-50">LinkedIn</a>
              <a href="#" className="hover:text-ice-50">GitHub</a>
            </div>
          </div>
        </div>
      </footer>

      {/* ============================== ACTIVE PROJECT MODAL ============================== */}
      {active && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-ice-950/80 backdrop-blur-xl animate-[reveal_0.5s_ease-out]"
          onClick={() => setActive(null)}
        >
          <div
            className="relative w-full max-w-4xl glass rounded-md p-6 md:p-10 grid grid-cols-1 md:grid-cols-2 gap-8"
            onClick={(e) => e.stopPropagation()}
          >
            <Bracket />
            <div className="relative aspect-square">
              <CrystalView hue={active.hue} seed={11} />
            </div>
            <div className="flex flex-col">
              <div className="font-mono text-[10px] tracking-[0.3em] text-ice-300/80 mb-2">{active.index}</div>
              <h3 className="font-display font-bold text-4xl md:text-5xl text-glow">{active.title}</h3>
              <div className="mt-1 text-ice-300 font-mono text-sm tracking-widest">{active.subtitle}</div>
              <p className="mt-6 text-ice-200/85 leading-relaxed">{active.description}</p>

              <div className="mt-6 grid grid-cols-2 gap-3 font-mono text-[10px] tracking-[0.3em] text-ice-300/80">
                <div><div className="text-ice-400/70">DATE</div><div className="text-ice-50">{active.date}</div></div>
                <div><div className="text-ice-400/70">TEMP</div><div className="text-ice-50">{active.temp}</div></div>
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                {active.tags.map(t => (
                  <span key={t} className="px-3 py-1 border border-ice-300/40 rounded-sm font-mono text-[10px] tracking-[0.25em] text-ice-100">
                    {t}
                  </span>
                ))}
              </div>

              <div className="mt-auto pt-8 flex gap-3">
                <a
                  href={active.link || '#'}
                  className="inline-flex items-center gap-2 px-5 py-2 bg-ice-100 text-ice-950 rounded-sm font-mono tracking-[0.3em] text-xs hover:bg-ice-50 transition"
                >
                  EXPLORE <ArrowUpRight className="w-3 h-3" />
                </a>
                <button
                  onClick={() => setActive(null)}
                  className="inline-flex items-center gap-2 px-5 py-2 border border-ice-300/40 rounded-sm font-mono tracking-[0.3em] text-xs text-ice-100 hover:bg-white/5 transition"
                >
                  CLOSE
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
