/** Generative, gentle sound. Nothing loads from files. */
import { Music, type Mood } from './music';
const hz = (m: number) => 440 * Math.pow(2, (m - 69) / 12);

class Sound {
  ctx: AudioContext | null = null;
  master!: GainNode;
  private padBus!: GainNode;
  private enabled = true;
  private music: Music | null = null;
  private pendingMood: Mood = 'title';
  private noise!: AudioBuffer;

  /** Must be called from a user gesture. */
  unlock() {
    if (this.ctx) { void this.ctx.resume(); return; }
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AC) return;
    this.ctx = new AC();
    this.master = this.ctx.createGain();
    this.master.gain.value = this.enabled ? 0.8 : 0;
    const comp = this.ctx.createDynamicsCompressor();
    this.master.connect(comp).connect(this.ctx.destination);
    // simple feedback-delay "reverb"
    const delay = this.ctx.createDelay(1);
    delay.delayTime.value = 0.33;
    const fb = this.ctx.createGain(); fb.gain.value = 0.38;
    const lp = this.ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 2400;
    this.padBus = this.ctx.createGain(); this.padBus.gain.value = 0.5;
    this.padBus.connect(this.master);
    this.padBus.connect(delay); delay.connect(lp).connect(fb).connect(delay); lp.connect(this.master);
    this.noise = this.ctx.createBuffer(1, this.ctx.sampleRate, this.ctx.sampleRate);
    const d = this.noise.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    this.music = new Music(this.ctx, this.master);
    this.music.setMood(this.pendingMood);
    this.music.start();
  }

  setEnabled(on: boolean) {
    this.enabled = on;
    if (this.ctx) this.master.gain.setTargetAtTime(on ? 0.8 : 0, this.ctx.currentTime, 0.3);
  }

  setMood(m: Mood) {
    this.pendingMood = m;
    this.music?.setMood(m);
  }

  private bell(freq: number, vol = 0.12, when = 0) {
    if (!this.ctx) return;
    const t = this.ctx.currentTime + when;
    for (const [mul, v] of [[1, 1], [2.01, 0.4], [3.98, 0.15]]) {
      const o = this.ctx.createOscillator(); o.frequency.value = freq * mul;
      const g = this.ctx.createGain();
      g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(vol * v, t + 0.01); g.gain.exponentialRampToValueAtTime(0.0001, t + 2.2 / mul);
      o.connect(g).connect(this.padBus); o.start(t); o.stop(t + 2.5);
    }
  }

  private hiss(dur: number, f0: number, f1: number, vol: number) {
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    const src = this.ctx.createBufferSource(); src.buffer = this.noise;
    const bp = this.ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.Q.value = 1.4;
    bp.frequency.setValueAtTime(f0, t); bp.frequency.exponentialRampToValueAtTime(f1, t + dur);
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(vol, t + dur * 0.3); g.gain.linearRampToValueAtTime(0, t + dur);
    src.connect(bp).connect(g).connect(this.master); src.start(t); src.stop(t + dur);
  }

  play(name: 'wake' | 'arrive' | 'tap' | 'nothing' | 'page' | 'bookmark' | 'solve' | 'rotate' | 'hint' | 'rustle' | 'door' | 'click') {
    if (!this.ctx || !this.enabled) return;
    switch (name) {
      case 'wake': this.bell(hz(76), 0.08); this.bell(hz(83), 0.06, 0.12); this.hiss(0.6, 800, 3000, 0.05); break;
      case 'arrive': [72, 76, 79, 84].forEach((m, i) => this.bell(hz(m), 0.09, i * 0.09)); this.hiss(0.8, 3000, 900, 0.06); break;
      case 'tap': this.bell(hz(88), 0.04); break;
      case 'nothing': this.bell(hz(64), 0.03); break;
      case 'page': this.hiss(0.35, 2500, 5000, 0.12); break;
      case 'rustle': this.hiss(0.25, 3500, 6000, 0.05); break;
      case 'bookmark': [79, 83, 86, 91].forEach((m, i) => this.bell(hz(m), 0.08, i * 0.07)); break;
      case 'solve': [60, 64, 67, 72, 76, 79, 84].forEach((m, i) => this.bell(hz(m), 0.08, i * 0.11)); break;
      case 'rotate': this.bell(hz(67 + Math.floor(Math.random() * 3) * 2), 0.05); this.hiss(0.12, 1200, 600, 0.05); break;
      case 'hint': this.bell(hz(81), 0.05); this.bell(hz(88), 0.04, 0.2); break;
      case 'door': this.hiss(1.4, 300, 120, 0.1); this.bell(hz(55), 0.05, 0.6); break;
      case 'click': this.bell(hz(84), 0.03); break;
    }
  }
}

export const sound = new Sound();
export type { Mood };
