import type { SceneDef, SecretDef, WandererDef } from '../content/types';
import { ART } from '../content/art';
import { createWanderer, stepWanderer, type Wanderer, type ViewRange } from './wanderer';
import { defs, homeBook, glow } from './svg';
import type { Cam, FX } from './fx';
import { sound } from './audio';

export interface RoomEvents {
  onWake(def: WandererDef): void;
  onArrive(def: WandererDef): void;
  onSecret(def: SecretDef, firstTime: boolean): void;
  onPuzzle(): void;
  onBusy(): void;
}

interface Live { def: WandererDef; w: Wanderer; el: SVGGElement; body: SVGGElement; book: SVGGElement }

const HIT = (r: number) => `<circle r="${r}" fill="#000" fill-opacity="0.001"/>`;

/** One panoramic room: draws the scene, handles panning, taps and the wanderers. */
export class Room {
  el: HTMLDivElement;
  svg!: SVGSVGElement;
  private layers: SVGSVGElement[] = [];
  private applied = NaN;
  cam = 0;
  private camTarget = 0;
  scale = 1;
  viewW = 1000;
  live = new Map<string, Live>();
  travelling: string | null = null;
  /** -1/1 when the travelling wanderer waits at the left/right edge */
  waitingDir = 0;
  private down: { x: number; y: number; cam: number; target: Element | null; t: number; id: number } | null = null;
  private dragging = false;
  private vel = 0;
  private lastMove = { x: 0, t: 0 };
  private hoverT = 0;
  private secretsFound: Set<string>;

  constructor(
    public def: SceneDef,
    found: Set<string>,
    secretsFound: Set<string>,
    private puzzleSolved: boolean,
    private fx: FX,
    private ev: RoomEvents,
    startCam = 0,
  ) {
    this.secretsFound = secretsFound;
    this.el = document.createElement('div');
    this.el.className = 'room';
    this.build(found);
    this.resize();
    this.cam = this.camTarget = this.clamp(startCam);
    this.apply();
    this.bindInput();
  }

  private build(found: Set<string>) {
    const d = this.def;
    const books = d.wanderers.map((w) => homeBook(w.id, w.home.x, w.home.y, ART[w.id], w.homeColor ?? '#6b4f9e')).join('');
    const oddities = d.secrets.filter((s) => s.kind === 'oddity').map((s) => `<g class="secret" data-hit="s:${s.id}" transform="translate(${s.at.x} ${s.at.y})">${HIT(s.r)}</g>`).join('');
    const items = d.secrets.filter((s) => s.kind !== 'oddity' && !(s.kind === 'brief' && this.secretsFound.has(s.id)))
      .map((s) => `<g class="secret" data-hit="s:${s.id}" transform="translate(${s.at.x} ${s.at.y}) scale(${s.scale ?? 0.6})">${HIT(s.r / (s.scale ?? 0.6))}${s.art ?? ART[s.kind]}</g>`).join('');
    const p = d.puzzle;
    const spot = `<g class="puzzle-spot ${this.puzzleSolved ? 'solved' : ''}" data-hit="p" transform="translate(${p.at.x} ${p.at.y})">${glow(0, 0, 120, 'violet', 'spot-glow')}${HIT(90)}${p.art}</g>`;
    const wanderers = d.wanderers.filter((w) => !found.has(w.id)).map((w) => `
      <g class="wanderer" data-hit="w:${w.id}" data-id="${w.id}" transform="translate(${w.at.x} ${w.at.y})">
        <g class="wbody" style="transform-box:fill-box;transform-origin:center"><g class="pose" transform="rotate(${w.rot ?? 0}) scale(${w.scale ?? 0.8})">${HIT(60)}${ART[w.id]}</g></g>
        <path class="glint" d="M30 -34l3 9l9 3l-9 3l-3 9l-3 -9l-9 -3l9 -3z" fill="#fff8d8" style="animation-delay:${(-Math.random() * 9).toFixed(1)}s;transform-box:fill-box;transform-origin:center"/>
        <path class="wait-arrow" d="M58 -14l14 14l-14 14" stroke="#ffe39a" stroke-width="6" fill="none" stroke-linecap="round"/>
      </g>`).join('');
    const svgOpen = (cls: string) => `<svg class="pano ${cls}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${d.width} 1000" preserveAspectRatio="xMinYMin meet">`;
    this.el.innerHTML = `${svgOpen('far')}${defs()}<g>${d.far}</g></svg>
      ${svgOpen('main')}${defs()}<g class="main">${d.main}${books}${oddities}${items}${spot}${wanderers}</g><g class="over">${d.over ?? ''}</g></svg>
      ${d.fore ? `${svgOpen('fore')}<g>${d.fore}</g></svg>` : ''}<div class="vignette"></div>`;
    this.svg = this.el.querySelector('svg.main')!;
    this.layers = [...this.el.querySelectorAll('svg.pano')] as SVGSVGElement[];
    for (const w of d.wanderers) {
      const book = this.svg.querySelector(`[data-home="${w.id}"]`) as SVGGElement;
      if (found.has(w.id)) { book.classList.add('filled'); continue; }
      const el = this.svg.querySelector(`.wanderer[data-id="${w.id}"]`) as SVGGElement;
      this.live.set(w.id, { def: w, w: createWanderer(w.at, w.home), el, body: el.querySelector('.pose')!, book });
    }
  }

  resize() {
    this.scale = innerHeight / 1000;
    this.viewW = innerWidth / this.scale;
    for (const l of this.layers) {
      l.setAttribute('width', String(this.def.width * this.scale));
      l.setAttribute('height', String(innerHeight));
    }
    this.applied = NaN;
    this.camTarget = this.clamp(this.camTarget);
    this.cam = this.clamp(this.cam);
    this.apply();
  }

  private clamp(x: number) {
    const max = this.def.width - this.viewW;
    if (max < 0) return max / 2;
    return Math.max(0, Math.min(max, x));
  }

  get view(): ViewRange { return { x0: this.cam, x1: this.cam + this.viewW }; }
  get camInfo(): Cam { return { x: this.cam, scale: this.scale, top: 0 }; }
  get canLeft() { return this.camTarget > 1; }
  get canRight() { return this.camTarget < this.def.width - this.viewW - 1; }

  panBy(dx: number) { this.camTarget = this.clamp(this.camTarget + dx); }
  panTo(x: number) { this.camTarget = this.clamp(x - this.viewW / 2); }

  private apply() {
    if (Math.abs(this.cam - this.applied) < 0.05) return;
    this.applied = this.cam;
    const px = this.cam * this.scale;
    // far layer drifts slower, foreground faster: all compositor-only transforms
    const factors: Record<string, number> = { far: 0.65, main: 1, fore: 1.3 };
    for (const l of this.layers) {
      const k = factors[l.classList[1]] ?? 1;
      l.style.transform = `translate3d(${(-px * k).toFixed(2)}px,0,0)`;
    }
  }

  private toScene(cx: number, cy: number) {
    return { x: cx / this.scale + this.cam, y: cy / this.scale };
  }

  private bindInput() {
    const el = this.el;
    el.addEventListener('pointerdown', (e) => {
      if (this.down) return;
      this.down = { x: e.clientX, y: e.clientY, cam: this.cam, target: e.target as Element, t: performance.now(), id: e.pointerId };
      this.dragging = false;
      this.vel = 0;
      this.lastMove = { x: e.clientX, t: performance.now() };
    });
    el.addEventListener('pointermove', (e) => {
      if (!this.down || e.pointerId !== this.down.id) { if (e.pointerType === 'mouse') this.hover(e.clientX, e.clientY); return; }
      const dx = e.clientX - this.down.x;
      if (!this.dragging && Math.hypot(dx, e.clientY - this.down.y) > 8) {
        this.dragging = true;
        el.classList.add('dragging');
        try { el.setPointerCapture(e.pointerId); } catch { /* ignore */ }
      }
      if (this.dragging) {
        const now = performance.now();
        const dt = Math.max(1, now - this.lastMove.t);
        this.vel = 0.8 * this.vel + 0.2 * ((e.clientX - this.lastMove.x) / dt);
        this.lastMove = { x: e.clientX, t: now };
        this.cam = this.camTarget = this.clamp(this.down.cam - dx / this.scale);
      }
    });
    const up = (e: PointerEvent) => {
      if (!this.down || e.pointerId !== this.down.id) return;
      if (!this.dragging && e.type === 'pointerup') this.tap(this.down.target, e.clientX, e.clientY);
      else if (this.dragging) this.camTarget = this.clamp(this.cam - (this.vel * 260) / this.scale);
      this.down = null;
      this.dragging = false;
      el.classList.remove('dragging');
    };
    el.addEventListener('pointerup', up);
    el.addEventListener('pointercancel', up);
    el.addEventListener('wheel', (e) => {
      e.preventDefault();
      const d = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      this.panBy(d / this.scale);
    }, { passive: false });
  }

  private tap(target: Element | null, cx: number, cy: number) {
    const p = this.toScene(cx, cy);
    const hit = target?.closest('[data-hit]')?.getAttribute('data-hit');
    if (!hit) { this.fx.puff(p.x, p.y); sound.play('nothing'); return; }
    if (hit === 'p') { sound.play('tap'); this.ev.onPuzzle(); return; }
    const [kind, id] = hit.split(':');
    if (kind === 'w') return this.wake(id);
    if (kind === 's') {
      const def = this.def.secrets.find((s) => s.id === id)!;
      const first = !this.secretsFound.has(id);
      this.secretsFound.add(id);
      const g = target!.closest('[data-hit]') as SVGGElement;
      if (def.kind === 'brief') g.classList.add('found-letter');
      else { g.classList.remove('noticed'); void g.getBoundingClientRect(); g.classList.add('noticed'); }
      if (first) this.fx.burst(def.at.x, def.at.y, 30, '#ffe39a');
      this.ev.onSecret(def, first);
    }
  }

  private wake(id: string) {
    const l = this.live.get(id);
    if (!l || l.w.state !== 'idle') { if (l) this.fx.burst(l.w.x, l.w.y, 8); return; }
    if (this.travelling) { this.ev.onBusy(); const t = this.live.get(this.travelling)!; this.fx.burst(t.w.x, t.w.y, 14); return; }
    l.w.state = 'travel';
    l.w.y -= 10;
    this.travelling = id;
    l.el.classList.add('awake');
    l.body.setAttribute('transform', `rotate(0) scale(${l.def.scale ?? 0.8})`);
    l.book.classList.add('calling');
    this.fx.burst(l.w.x, l.w.y, 36);
    sound.play('wake');
    this.ev.onWake(l.def);
  }

  /** Mouse hover near a hidden thing: pages rustle and a few motes sparkle. */
  private hover(cx: number, cy: number) {
    const now = performance.now();
    if (now - this.hoverT < 1600) return;
    const p = this.toScene(cx, cy);
    const near = [
      ...[...this.live.values()].filter((l) => l.w.state === 'idle').map((l) => ({ x: l.w.x, y: l.w.y })),
      ...this.def.secrets.filter((s) => s.kind !== 'oddity' && !this.secretsFound.has(s.id)).map((s) => s.at),
    ].find((t) => Math.hypot(t.x - p.x, t.y - p.y) < 140);
    if (!near) return;
    this.hoverT = now;
    sound.play('rustle');
    for (let i = 0; i < 4; i++) this.fx.add({ x: near.x + (Math.random() - 0.5) * 90, y: near.y + (Math.random() - 0.5) * 90, vy: -20, max: 1.2, size: 4, color: '#fff0c0' });
  }

  /** Lantern hint: pan to something worth finding and make it glow. */
  hint(): boolean {
    if (this.travelling) {
      const l = this.live.get(this.travelling)!;
      this.panTo(l.w.home.x);
      setTimeout(() => this.ring(l.w.home.x, l.w.home.y), 500);
      return true;
    }
    const idle = [...this.live.values()].filter((l) => l.w.state === 'idle');
    if (idle.length) {
      const mid = this.cam + this.viewW / 2;
      const l = idle.sort((a, b) => Math.abs(a.w.x - mid) - Math.abs(b.w.x - mid))[0];
      this.panTo(l.w.x);
      setTimeout(() => this.ring(l.w.x, l.w.y), 600);
      return true;
    }
    this.panTo(this.def.puzzle.at.x);
    setTimeout(() => this.ring(this.def.puzzle.at.x, this.def.puzzle.at.y), 600);
    return false;
  }

  ring(x: number, y: number) {
    for (let k = 0; k < 3; k++)
      setTimeout(() => {
        for (let i = 0; i < 28; i++) {
          const a = (i / 28) * Math.PI * 2;
          this.fx.add({ x: x + Math.cos(a) * 80, y: y + Math.sin(a) * 80, vx: -Math.cos(a) * 60, vy: -Math.sin(a) * 60, max: 0.9, size: 7, color: '#ffe39a' });
        }
      }, k * 450);
  }

  setPuzzleSolved() {
    this.puzzleSolved = true;
    this.svg.querySelector('.puzzle-spot')?.classList.add('solved');
  }

  update(dt: number) {
    if (!this.dragging) this.cam += (this.camTarget - this.cam) * Math.min(1, dt * 5);
    this.apply();
    this.waitingDir = 0;
    if (!this.travelling) return;
    const l = this.live.get(this.travelling)!;
    const r = stepWanderer(l.w, this.view, dt);
    const dHome = Math.hypot(l.w.home.x - l.w.x, l.w.home.y - l.w.y);
    const s = r === 'arrived' ? 0.3 : dHome < 160 ? 0.35 + (0.65 * dHome) / 160 : 1;
    const bob = l.w.waiting ? Math.sin(l.w.t * 3) * 8 : Math.sin(l.w.t * 6) * 3;
    l.el.setAttribute('transform', `translate(${l.w.x.toFixed(1)} ${(l.w.y + bob).toFixed(1)}) scale(${s.toFixed(3)})`);
    this.fx.trail(l.w.x, l.w.y);
    l.el.classList.toggle('waiting', l.w.waiting);
    if (l.w.waiting) {
      this.waitingDir = l.w.home.x > l.w.x ? 1 : -1;
      const arrow = l.el.querySelector('.wait-arrow')!;
      arrow.setAttribute('transform', this.waitingDir < 0 ? 'scale(-1 1)' : '');
    }
    if (r === 'arrived') {
      this.travelling = null;
      l.el.classList.add('absorbed');
      l.el.classList.remove('awake', 'waiting');
      l.book.classList.remove('calling');
      l.book.classList.add('filled');
      this.fx.letterTrail(l.w.home.x, l.w.home.y, l.w.home.x, l.w.home.y - 200);
      this.fx.burst(l.w.home.x, l.w.home.y, 40);
      sound.play('arrive');
      this.live.delete(l.def.id);
      setTimeout(() => l.el.remove(), 900);
      this.ev.onArrive(l.def);
    }
  }

  destroy() { this.el.remove(); }
}
