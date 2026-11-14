/**
 * Generative background music: two reverb-soaked "guitars" — a fingerpicked arpeggio
 * (Karplus-Strong plucks) and a gliding slide melody — with a slow tape wobble that keeps
 * everything warm but a little bit off. Quiet by design.
 */
export type Mood = 'title' | 'hall' | 'magic' | 'maps' | 'forest' | 'heart';

// Chords as MIDI notes (bass first). Progressions lean on the warm Andalusian / modal sound.
const PROGRESSIONS: Record<Mood, number[][]> = {
  title: [[45, 57, 60, 64], [43, 55, 59, 62], [41, 53, 57, 60], [40, 52, 56, 59]],
  hall: [[45, 57, 60, 64], [43, 55, 59, 62], [41, 53, 57, 60], [40, 52, 56, 59]],
  magic: [[38, 50, 53, 57, 64], [46, 50, 53, 58], [43, 50, 55, 58], [45, 49, 52, 57]],
  maps: [[43, 55, 59, 62], [40, 52, 55, 59], [36, 52, 55, 60], [38, 54, 57, 62]],
  forest: [[40, 52, 55, 59], [36, 52, 55, 59], [45, 52, 57, 60], [47, 51, 54, 59]],
  heart: [[41, 53, 57, 60], [36, 52, 55, 60], [38, 50, 53, 57], [46, 53, 58, 62]],
};
// Melody scales (MIDI offsets around each mood); one "odd" note per mood for gentle strangeness.
const SCALES: Record<Mood, { notes: number[]; odd: number }> = {
  title: { notes: [64, 65, 67, 69, 71, 72, 76], odd: 68 },
  hall: { notes: [64, 65, 67, 69, 71, 72, 76], odd: 68 },
  magic: { notes: [62, 64, 65, 67, 69, 70, 72], odd: 63 },
  maps: { notes: [62, 64, 66, 67, 69, 71, 74], odd: 65 },
  forest: { notes: [59, 62, 64, 66, 67, 71, 74], odd: 63 },
  heart: { notes: [60, 62, 64, 65, 67, 69, 72], odd: 66 },
};
const PATTERN = [0, 2, 1, 3, 2, 1]; // 6/8 fingerpicking over chord tones (index into upper notes)

const hz = (m: number) => 440 * Math.pow(2, (m - 69) / 12);

export class Music {
  private ctx: AudioContext;
  private out: GainNode;
  private wet: ConvolverNode;
  private dry: GainNode;
  private wobble: { value: number } = { value: 0 };
  private mood: Mood = 'title';
  private nextTime = 0;
  private step = 0;
  private bar = 0;
  private timer = 0;
  private cache = new Map<number, AudioBuffer>();
  private beat = 60 / 64 / 2; // eighth notes at a calm 64 bpm (6/8)
  private wobT = 0;

  constructor(ctx: AudioContext, dest: AudioNode) {
    this.ctx = ctx;
    this.out = ctx.createGain();
    this.out.gain.value = 0.0;
    this.out.connect(dest);
    // warm tone: gentle low-pass and a long, generated reverb
    const tone = ctx.createBiquadFilter();
    tone.type = 'lowpass'; tone.frequency.value = 3200; tone.Q.value = 0.3;
    tone.connect(this.out);
    this.dry = ctx.createGain(); this.dry.gain.value = 0.55; this.dry.connect(tone);
    this.wet = ctx.createConvolver(); this.wet.buffer = this.impulse(3.8);
    const wetGain = ctx.createGain(); wetGain.gain.value = 0.85;
    this.wet.connect(wetGain).connect(tone);
  }

  /** Synthetic hall reverb: decaying stereo noise. */
  private impulse(secs: number) {
    const rate = this.ctx.sampleRate, len = rate * secs;
    const b = this.ctx.createBuffer(2, len, rate);
    for (let ch = 0; ch < 2; ch++) {
      const d = b.getChannelData(ch);
      for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2.6);
    }
    return b;
  }

  /** Karplus-Strong plucked string, rendered once per pitch and cached. */
  private pluckBuffer(midi: number) {
    let b = this.cache.get(midi);
    if (b) return b;
    const rate = this.ctx.sampleRate, len = Math.floor(rate * 3.2);
    b = this.ctx.createBuffer(1, len, rate);
    const d = b.getChannelData(0);
    const period = Math.round(rate / hz(midi));
    const line = new Float32Array(period);
    for (let i = 0; i < period; i++) line[i] = (Math.random() * 2 - 1) * 0.5;
    // soften the attack (nylon-ish)
    for (let k = 0; k < 2; k++) for (let i = 1; i < period; i++) line[i] = (line[i] + line[i - 1]) / 2;
    const damp = 0.4965 + Math.min(0.0032, (72 - midi) * 0.00006);
    let idx = 0;
    for (let i = 0; i < len; i++) {
      const cur = line[idx], nxt = line[(idx + 1) % period];
      d[i] = cur;
      line[idx] = (cur + nxt) * damp;
      idx = (idx + 1) % period;
    }
    this.cache.set(midi, b);
    return b;
  }

  private pluck(midi: number, t: number, vol: number, pan = 0) {
    const src = this.ctx.createBufferSource();
    src.buffer = this.pluckBuffer(midi);
    // slightly off: a slow tape drift plus a tiny random detune per note
    src.detune.value = this.wobble.value + (Math.random() - 0.5) * 9;
    const g = this.ctx.createGain(); g.gain.value = vol;
    const p = this.ctx.createStereoPanner(); p.pan.value = pan;
    src.connect(g).connect(p);
    p.connect(this.dry); p.connect(this.wet);
    src.start(t); src.stop(t + 3.2);
  }

  /** Gliding "slide guitar" phrase. */
  private slide(notes: number[], t: number, noteLen: number) {
    const ctx = this.ctx;
    const o1 = ctx.createOscillator(), o2 = ctx.createOscillator();
    o1.type = 'triangle'; o2.type = 'sine';
    o2.detune.value = 7;
    const vib = ctx.createOscillator(), vibG = ctx.createGain();
    vib.frequency.value = 4.6; vibG.gain.value = 0;
    vib.connect(vibG); vibG.connect(o1.detune); vibG.connect(o2.detune);
    const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 1600; lp.Q.value = 2;
    const g = ctx.createGain(); g.gain.value = 0;
    o1.connect(lp); o2.connect(lp); lp.connect(g);
    const p = ctx.createStereoPanner(); p.pan.value = 0.25;
    g.connect(p); p.connect(this.wet); p.connect(this.dry);
    const end = t + notes.length * noteLen + 1.5;
    notes.forEach((m, i) => {
      const at = t + i * noteLen;
      const f = hz(m + this.wobble.value / 100);
      if (i === 0) { o1.frequency.setValueAtTime(f, at); o2.frequency.setValueAtTime(f / 2, at); }
      else { o1.frequency.setTargetAtTime(f, at, 0.09); o2.frequency.setTargetAtTime(f / 2, at, 0.09); }
      g.gain.setTargetAtTime(0.05, at, 0.08);
      g.gain.setTargetAtTime(0.028, at + noteLen * 0.5, 0.3);
      vibG.gain.setTargetAtTime(9, at + noteLen * 0.35, 0.25);
      vibG.gain.setTargetAtTime(0, at + noteLen * 0.95, 0.05);
    });
    g.gain.setTargetAtTime(0, end - 1.5, 0.5);
    for (const o of [o1, o2, vib]) { o.start(t); o.stop(end + 1); }
  }

  private schedule() {
    const ahead = this.ctx.currentTime + 0.4;
    while (this.nextTime < ahead) {
      const t = this.nextTime;
      const prog = PROGRESSIONS[this.mood];
      const chord = prog[this.bar % prog.length];
      const upper = chord.slice(1);
      // the tape wobble drifts slowly (a few cents), giving the dreamy, slightly off feel
      this.wobT += this.beat;
      this.wobble.value = Math.sin(this.wobT * 0.37) * 9 + Math.sin(this.wobT * 0.11) * 6;
      const humanize = (Math.random() - 0.5) * 0.02;
      if (this.step === 0) this.pluck(chord[0], t, 0.5, -0.15);
      const n = upper[PATTERN[this.step] % upper.length];
      const skip = Math.random() < 0.12 && this.step !== 0;
      if (!skip) this.pluck(n + (this.step === 3 && Math.random() < 0.3 ? 12 : 0), t + humanize, 0.26 + Math.random() * 0.08, -0.3 + this.step * 0.1);
      // melody: an unhurried phrase every few bars
      if (this.step === 0 && this.bar % 4 === 2 && Math.random() < 0.85) {
        const sc = SCALES[this.mood];
        const len = 3 + Math.floor(Math.random() * 3);
        let i = Math.floor(Math.random() * sc.notes.length);
        const phrase: number[] = [];
        for (let k = 0; k < len; k++) {
          i = Math.max(0, Math.min(sc.notes.length - 1, i + Math.floor(Math.random() * 3) - 1));
          phrase.push(k === len - 2 && Math.random() < 0.25 ? sc.odd : sc.notes[i]);
        }
        phrase.push(chord[1] + 12); // always resolve warmly onto the chord
        this.slide(phrase, t + this.beat, this.beat * 2.5);
      }
      this.nextTime += this.beat * (this.step === 5 ? 1.15 : 1); // a lazy breath at the end of each bar
      this.step = (this.step + 1) % 6;
      if (this.step === 0) this.bar++;
    }
  }

  start() {
    this.nextTime = this.ctx.currentTime + 0.2;
    this.out.gain.setTargetAtTime(0.32, this.ctx.currentTime, 2.5);
    clearInterval(this.timer);
    this.timer = window.setInterval(() => this.schedule(), 100);
  }

  setMood(m: Mood) {
    if (m === this.mood) return;
    // fade, switch, fade back in so the change feels like turning a page
    const t = this.ctx.currentTime;
    this.out.gain.setTargetAtTime(0.05, t, 0.6);
    setTimeout(() => {
      this.mood = m; this.bar = 0; this.step = 0;
      this.out.gain.setTargetAtTime(0.32, this.ctx.currentTime, 2);
    }, 1600);
  }
}
