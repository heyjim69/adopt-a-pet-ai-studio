import { useEffect, useRef } from 'react';

/**
 * Generates a soft arctic-pad ambient drone via WebAudio. No external assets;
 * starts silent and ramps up only when `on` flips true (requires user gesture
 * upstream to satisfy autoplay policies).
 */
export function useAmbient(on: boolean) {
  const ctxRef = useRef<AudioContext | null>(null);
  const masterRef = useRef<GainNode | null>(null);
  const nodesRef = useRef<{ osc: OscillatorNode; gain: GainNode }[]>([]);
  const startedRef = useRef(false);

  useEffect(() => {
    if (!on && !ctxRef.current) return;

    if (!ctxRef.current) {
      const Ctx = (window as any).AudioContext || (window as any).webkitAudioContext;
      if (!Ctx) return;
      const ctx: AudioContext = new Ctx();
      ctxRef.current = ctx;

      const master = ctx.createGain();
      master.gain.value = 0;
      master.connect(ctx.destination);
      masterRef.current = master;

      // gentle pad: three detuned sines + low filtered noise
      const freqs = [110, 164.81, 220];
      freqs.forEach((f) => {
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.value = f;
        const g = ctx.createGain();
        g.gain.value = 0.04;
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 800;
        osc.connect(g);
        g.connect(filter);
        filter.connect(master);
        osc.start();
        nodesRef.current.push({ osc, gain: g });
      });

      // pink noise via buffer source
      const bufferSize = 2 * ctx.sampleRate;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = noiseBuffer.getChannelData(0);
      let b0 = 0, b1 = 0, b2 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99765 * b0 + white * 0.0990460;
        b1 = 0.96300 * b1 + white * 0.2965164;
        b2 = 0.57000 * b2 + white * 1.0526913;
        data[i] = (b0 + b1 + b2 + white * 0.1848) * 0.06;
      }
      const noise = ctx.createBufferSource();
      noise.buffer = noiseBuffer;
      noise.loop = true;
      const noiseGain = ctx.createGain();
      noiseGain.gain.value = 0.18;
      const noiseFilter = ctx.createBiquadFilter();
      noiseFilter.type = 'lowpass';
      noiseFilter.frequency.value = 400;
      noise.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(master);
      noise.start();

      startedRef.current = true;
    }

    const ctx = ctxRef.current;
    const master = masterRef.current;
    if (!ctx || !master) return;

    if (ctx.state === 'suspended' && on) {
      ctx.resume().catch(() => {});
    }

    const target = on ? 0.35 : 0.0;
    master.gain.cancelScheduledValues(ctx.currentTime);
    master.gain.linearRampToValueAtTime(target, ctx.currentTime + 0.8);
  }, [on]);

  useEffect(() => {
    return () => {
      const ctx = ctxRef.current;
      if (ctx) {
        try { ctx.close(); } catch {}
      }
    };
  }, []);
}
