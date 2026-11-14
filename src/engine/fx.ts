import type { Emitter } from '../content/types';

/** Camera info needed to map scene coordinates to the screen. */
export interface Cam { x: number; scale: number; top: number }

type Space = 'scene' | 'screen';
interface P {
  x: number; y: number; vx: number; vy: number; ax: number; ay: number;
  life: number; max: number; size: number; color: string; space: Space;
  glyph?: string; spin?: number; rot?: number; kind: 'dot' | 'glyph' | 'leaf';
}

const GLYPHS = 'aäbcdeéfghijklmnoöpqrsßtuüvwxyz&?!'.split('');

function sprite(color: string): HTMLCanvasElement {
  const c = document.createElement('canvas');
  c.width = c.height = 64;
  const g = c.getContext('2d')!;
  const grd = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  grd.addColorStop(0, '#ffffff');
  grd.addColorStop(0.2, color);
  grd.addColorStop(1, 'rgba(0,0,0,0)');
  g.fillStyle = grd;
  g.fillRect(0, 0, 64, 64);
  return c;
}

/** Full-screen particle layer above the scene. */
export class FX {
  canvas: HTMLCanvasElement;
  private g: CanvasRenderingContext2D;
  private ps: P[] = [];
  private sprites = new Map<string, HTMLCanvasElement>();
  private emitters: (Emitter & { acc: number })[] = [];
  private dpr = 1;
  /** 0..1, lowered automatically when frames get slow */
  quality = 1;
  private slowFrames = 0;

  constructor(parent: HTMLElement) {
    this.canvas = document.createElement('canvas');
    this.canvas.className = 'fx';
    parent.appendChild(this.canvas);
    this.g = this.canvas.getContext('2d')!;
    this.resize();
    addEventListener('resize', () => this.resize());
  }

  resize() {
    this.dpr = Math.min(2, devicePixelRatio || 1);
    this.canvas.width = innerWidth * this.dpr;
    this.canvas.height = innerHeight * this.dpr;
  }

  private spr(color: string) {
    let s = this.sprites.get(color);
    if (!s) { s = sprite(color); this.sprites.set(color, s); }
    return s;
  }

  setEmitters(list: Emitter[]) {
    this.emitters = list.map((e) => ({ ...e, acc: 0 }));
    this.ps = this.ps.filter((p) => p.space === 'screen');
  }

  clear() { this.ps = []; }

  add(p: Partial<P> & { x: number; y: number }) {
    if (this.ps.length > 900 * this.quality + 100) return;
    this.ps.push({ vx: 0, vy: 0, ax: 0, ay: 0, life: 0, max: 1, size: 6, color: '#ffd98a', space: 'scene', kind: 'dot', ...p });
  }

  /** Little burst of sparkles (scene coordinates). */
  burst(x: number, y: number, n = 24, color = '#ffd98a', speed = 160) {
    for (let i = 0; i < n * this.quality; i++) {
      const a = Math.random() * Math.PI * 2, s = speed * (0.3 + Math.random());
      this.add({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s - 40, ay: 60, max: 0.6 + Math.random() * 0.8, size: 4 + Math.random() * 8, color });
    }
  }

  /** Glowing letters streaming from one point into another (the "back into the book" trail). */
  letterTrail(x: number, y: number, tx: number, ty: number) {
    for (let i = 0; i < 26 * this.quality + 6; i++) {
      const d = Math.random() * 0.5;
      const t = 0.9 + Math.random() * 0.5;
      this.add({
        kind: 'glyph', glyph: GLYPHS[Math.floor(Math.random() * GLYPHS.length)],
        x: x + (Math.random() - 0.5) * 60, y: y + (Math.random() - 0.5) * 60,
        vx: (tx - x) / t + (Math.random() - 0.5) * 80, vy: (ty - y) / t - 60 - Math.random() * 60, ay: 120,
        life: -d, max: t, size: 18 + Math.random() * 12, color: '#ffe9a8', rot: (Math.random() - 0.5) * 0.6, spin: (Math.random() - 0.5) * 3,
      });
    }
  }

  /** Soft trail while a wanderer flies. */
  trail(x: number, y: number) {
    if (Math.random() > 0.55 * this.quality + 0.1) return;
    this.add({ x: x + (Math.random() - 0.5) * 30, y: y + (Math.random() - 0.5) * 30, vy: -20, max: 0.9, size: 5 + Math.random() * 6, color: '#ffe3a0' });
  }

  /** A small sad-but-cute puff for taps on nothing. */
  puff(x: number, y: number) {
    for (let i = 0; i < 8; i++) {
      const a = Math.random() * Math.PI * 2;
      this.add({ x, y, vx: Math.cos(a) * 50, vy: Math.sin(a) * 50, max: 0.5, size: 5, color: '#b9c6ff' });
    }
  }

  private emit(e: Emitter & { acc: number }, dt: number) {
    const rate = { fountain: 26, upleaves: 2.2, fireflies: 3, motes: 4, letters: 1.4, drips: 1.6 }[e.kind] * this.quality;
    e.acc += rate * dt;
    while (e.acc > 1) {
      e.acc -= 1;
      const w = e.w ?? 0, h = e.h ?? 0;
      const x = e.x + Math.random() * w, y = e.y + Math.random() * h;
      switch (e.kind) {
        case 'fountain':
          this.add({ x: e.x + (Math.random() - 0.5) * 18, y: e.y, vx: (Math.random() - 0.5) * 30, vy: -240 - Math.random() * 120, ay: -30, max: 1.8 + Math.random() * 0.8, size: 2 + Math.random() * 2.5, color: '#7fd0e8' });
          break;
        case 'upleaves':
          this.add({ kind: 'leaf', x, y, vx: (Math.random() - 0.5) * 30, vy: -30 - Math.random() * 25, max: 8 + Math.random() * 4, size: 9 + Math.random() * 6, color: Math.random() < 0.5 ? '#e0a43a' : '#c7603a', rot: Math.random() * 6, spin: (Math.random() - 0.5) * 1.6 });
          break;
        case 'fireflies':
          this.add({ x, y, vx: (Math.random() - 0.5) * 30, vy: (Math.random() - 0.5) * 30, max: 4 + Math.random() * 3, size: 7 + Math.random() * 6, color: '#eaff8a' });
          break;
        case 'motes':
          this.add({ x, y, vx: (Math.random() - 0.5) * 8, vy: 6 + Math.random() * 8, max: 6 + Math.random() * 4, size: 3 + Math.random() * 4, color: '#fff2c4' });
          break;
        case 'letters':
          this.add({ kind: 'glyph', glyph: GLYPHS[Math.floor(Math.random() * GLYPHS.length)], x, y, vx: (Math.random() - 0.5) * 16, vy: -14 - Math.random() * 14, max: 7, size: 14 + Math.random() * 10, color: '#ffe9a8', rot: 0, spin: (Math.random() - 0.5) * 0.6 });
          break;
        case 'drips':
          this.add({ x, y, vy: -40, ay: -30, max: 2.4, size: 5, color: '#fff6dc' });
          break;
      }
    }
  }

  frame(dt: number, cam: Cam) {
    if (dt > 0.05) { if (++this.slowFrames > 30) { this.quality = Math.max(0.35, this.quality - 0.15); this.slowFrames = 0; } }
    else this.slowFrames = Math.max(0, this.slowFrames - 1);

    for (const e of this.emitters) this.emit(e, dt);
    const g = this.g, d = this.dpr;
    g.setTransform(1, 0, 0, 1, 0, 0);
    g.clearRect(0, 0, this.canvas.width, this.canvas.height);
    g.globalCompositeOperation = 'lighter';
    const alive: P[] = [];
    for (const p of this.ps) {
      p.life += dt;
      if (p.life < 0) { alive.push(p); continue; }
      if (p.life > p.max) continue;
      p.vx += p.ax * dt; p.vy += p.ay * dt;
      p.x += p.vx * dt; p.y += p.vy * dt;
      if (p.spin) p.rot = (p.rot ?? 0) + p.spin * dt;
      alive.push(p);
      const sc = p.space === 'scene' ? cam.scale : 1;
      const sx = p.space === 'scene' ? (p.x - cam.x) * cam.scale : p.x;
      const sy = p.space === 'scene' ? cam.top + p.y * cam.scale : p.y;
      if (sx < -60 || sx > innerWidth + 60) continue;
      const t = p.life / p.max;
      const a = p.kind === 'dot' ? Math.sin(t * Math.PI) : Math.min(1, t * 6) * (1 - t * t);
      g.globalAlpha = Math.max(0, a);
      const size = p.size * sc;
      if (p.kind === 'dot') {
        g.drawImage(this.spr(p.color), (sx - size * 2) * d, (sy - size * 2) * d, size * 4 * d, size * 4 * d);
      } else if (p.kind === 'glyph') {
        g.save();
        g.translate(sx * d, sy * d);
        g.rotate(p.rot ?? 0);
        g.font = `italic ${size * d}px Georgia, serif`;
        g.fillStyle = p.color;
        g.shadowColor = '#ffcf7a';
        g.shadowBlur = 12 * d;
        g.fillText(p.glyph!, 0, 0);
        g.restore();
      } else {
        g.globalCompositeOperation = 'source-over';
        g.save();
        g.translate(sx * d, sy * d);
        g.rotate(p.rot ?? 0);
        g.fillStyle = p.color;
        g.beginPath();
        g.ellipse(0, 0, size * d, size * 0.45 * d, 0, 0, Math.PI * 2);
        g.fill();
        g.restore();
        g.globalCompositeOperation = 'lighter';
      }
    }
    this.ps = alive;
    g.globalAlpha = 1;
  }
}
