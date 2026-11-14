import { rng } from '../rng';

/** Shared palette for all drawn art. */
export const C = {
  night0: '#0b1030', night1: '#18205a', night2: '#2a2f78',
  wood0: '#2c190e', wood1: '#4a2c18', wood2: '#6e4526', wood3: '#93633a',
  gold: '#f3c969', gold2: '#d99a35', amber: '#ffcf7a', cream: '#f6e8c8', paper: '#efe0bb',
  teal: '#3fb6a8', violet: '#8a6fd1', rose: '#e58aa0', moss: '#5f8f4e', ink: '#1d1630',
};
export const BOOK_COLORS = ['#8c2f39', '#2f5d62', '#6b4f9e', '#c7883a', '#355c8c', '#7a3b5e', '#3e7a4f', '#b5543c', '#2b3f6b', '#9a7b3a', '#5b6c8f', '#a34e6b'];

export type R = () => number;
export const pick = <T>(r: R, a: T[]) => a[Math.floor(r() * a.length)];
export const between = (r: R, a: number, b: number) => a + r() * (b - a);
export const f = (n: number) => Math.round(n * 10) / 10;

/** Gradients and filters every scene shares. */
export function defs(): string {
  return `<defs>
  <linearGradient id="g-wood" x1="0" x2="1"><stop offset="0" stop-color="${C.wood1}"/><stop offset=".5" stop-color="${C.wood2}"/><stop offset="1" stop-color="${C.wood1}"/></linearGradient>
  <linearGradient id="g-wood-v" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${C.wood2}"/><stop offset="1" stop-color="${C.wood0}"/></linearGradient>
  <linearGradient id="g-shelf-back" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1c1022"/><stop offset="1" stop-color="#2a1a1a"/></linearGradient>
  <radialGradient id="g-glow"><stop offset="0" stop-color="${C.amber}" stop-opacity=".85"/><stop offset=".35" stop-color="${C.amber}" stop-opacity=".35"/><stop offset="1" stop-color="${C.amber}" stop-opacity="0"/></radialGradient>
  <radialGradient id="g-glow-teal"><stop offset="0" stop-color="#9ff5e6" stop-opacity=".8"/><stop offset=".4" stop-color="${C.teal}" stop-opacity=".3"/><stop offset="1" stop-color="${C.teal}" stop-opacity="0"/></radialGradient>
  <radialGradient id="g-glow-violet"><stop offset="0" stop-color="#d9c8ff" stop-opacity=".8"/><stop offset=".4" stop-color="${C.violet}" stop-opacity=".3"/><stop offset="1" stop-color="${C.violet}" stop-opacity="0"/></radialGradient>
  <radialGradient id="g-moon"><stop offset="0" stop-color="#fffbe6"/><stop offset=".6" stop-color="#f1e7c2"/><stop offset="1" stop-color="#d8cc9e"/></radialGradient>
  <radialGradient id="g-vignette" cx=".5" cy=".5" r=".75"><stop offset=".55" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#05030f" stop-opacity=".75"/></radialGradient>
  <linearGradient id="g-ray" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff4cf" stop-opacity=".5"/><stop offset="1" stop-color="#fff4cf" stop-opacity="0"/></linearGradient>
  <linearGradient id="g-ray-blue" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#bcd6ff" stop-opacity=".45"/><stop offset="1" stop-color="#bcd6ff" stop-opacity="0"/></linearGradient>
  <linearGradient id="g-floor" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3a2216"/><stop offset="1" stop-color="#170c08"/></linearGradient>
  <linearGradient id="g-gold" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff0b8"/><stop offset=".45" stop-color="${C.gold}"/><stop offset="1" stop-color="${C.gold2}"/></linearGradient>
  <linearGradient id="g-water" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#8fe3ff" stop-opacity=".9"/><stop offset="1" stop-color="#d8f6ff" stop-opacity="0"/></linearGradient>
  <linearGradient id="g-glass" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#e8fbff" stop-opacity=".7"/><stop offset=".5" stop-color="#a9d8ea" stop-opacity=".25"/><stop offset="1" stop-color="#e8fbff" stop-opacity=".55"/></linearGradient>
  <filter id="f-glow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="6" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
  <filter id="f-soft" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="3"/></filter>
  <filter id="f-blur" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="14"/></filter>
</defs>`;
}

/** A pool of warm light. */
export function glow(x: number, y: number, rad: number, kind: '' | 'teal' | 'violet' = '', cls = 'flicker') {
  const id = kind ? `g-glow-${kind}` : 'g-glow';
  return `<circle class="${cls}" cx="${f(x)}" cy="${f(y)}" r="${f(rad)}" fill="url(#${id})" style="mix-blend-mode:screen"/>`;
}

/** Back wall with a subtle diamond wallpaper. */
export function wall(w: number, top: string, bottom: string, seed = 1) {
  const r = rng(seed);
  let pat = '';
  for (let x = -40; x < w + 80; x += 80)
    for (let y = 40; y < 820; y += 90) {
      const o = (Math.floor(y / 90) % 2) * 40;
      pat += `<path d="M${x + o} ${y}l10 -14l10 14l-10 14z" fill="#ffffff" opacity="${f(0.025 + r() * 0.03)}"/>`;
    }
  return `<linearGradient id="g-wall-${seed}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${top}"/><stop offset="1" stop-color="${bottom}"/></linearGradient>
  <rect x="-800" y="0" width="${w + 1600}" height="1000" fill="url(#g-wall-${seed})"/>${pat}`;
}

export function floor(w: number, y = 820) {
  let boards = '';
  for (let x = -800; x < w + 800; x += 120) boards += `<line x1="${x}" y1="${y}" x2="${x - 60}" y2="1000" stroke="#000" stroke-opacity=".18" stroke-width="2"/>`;
  return `<rect x="-800" y="${y}" width="${w + 1600}" height="${1000 - y}" fill="url(#g-floor)"/>${boards}
  <rect x="-800" y="${y - 6}" width="${w + 1600}" height="10" fill="${C.wood2}"/><rect x="-800" y="${y + 4}" width="${w + 1600}" height="3" fill="#000" opacity=".3"/>`;
}

export function rug(cx: number, y: number, w: number, color = '#7a2f43', trim = C.gold) {
  return `<g opacity=".95"><ellipse cx="${cx}" cy="${y}" rx="${w / 2}" ry="${w / 9}" fill="${color}"/>
  <ellipse cx="${cx}" cy="${y}" rx="${w / 2 - 14}" ry="${w / 9 - 6}" fill="none" stroke="${trim}" stroke-width="3" stroke-dasharray="10 6" opacity=".7"/>
  <ellipse cx="${cx}" cy="${y}" rx="${w / 4}" ry="${w / 22}" fill="none" stroke="${trim}" stroke-width="2" opacity=".5"/></g>`;
}

/** One book spine. */
export function spine(x: number, base: number, w: number, h: number, color: string, r: R, lean = 0) {
  const band = r() < 0.7;
  const label = r() < 0.5;
  const tr = lean ? ` transform="rotate(${lean} ${f(x + (lean > 0 ? w : 0))} ${base})"` : '';
  return `<g${tr}><rect x="${f(x)}" y="${f(base - h)}" width="${f(w)}" height="${f(h)}" rx="2" fill="${color}"/>
  <rect x="${f(x)}" y="${f(base - h)}" width="${f(w * 0.28)}" height="${f(h)}" fill="#fff" opacity=".08"/>
  ${band ? `<rect x="${f(x)}" y="${f(base - h + 8)}" width="${f(w)}" height="3" fill="${C.gold}" opacity=".75"/><rect x="${f(x)}" y="${f(base - 12)}" width="${f(w)}" height="3" fill="${C.gold}" opacity=".6"/>` : ''}
  ${label ? `<rect x="${f(x + w * 0.2)}" y="${f(base - h * 0.62)}" width="${f(w * 0.6)}" height="${f(h * 0.18)}" fill="${C.paper}" opacity=".55"/>` : ''}</g>`;
}

/** Tiny decoy objects that make shelves feel full (and hide things). */
export function trinket(x: number, base: number, r: R): string {
  const k = Math.floor(r() * 6);
  switch (k) {
    case 0: // jar with glow
      return `<g><rect x="${x}" y="${base - 30}" width="22" height="30" rx="5" fill="url(#g-glass)" stroke="#cfe" stroke-opacity=".4"/><rect x="${x + 3}" y="${base - 34}" width="16" height="6" fill="${C.wood2}"/><circle cx="${x + 11}" cy="${base - 13}" r="5" fill="${pick(r, [C.teal, C.amber, C.rose])}" class="twinkle" opacity=".9"/></g>`;
    case 1: // hourglass
      return `<g><rect x="${x}" y="${base - 36}" width="24" height="4" fill="${C.wood3}"/><rect x="${x}" y="${base - 4}" width="24" height="4" fill="${C.wood3}"/><path d="M${x + 3} ${base - 32}h18l-8 14l8 14h-18l8 -14z" fill="url(#g-glass)"/><path d="M${x + 8} ${base - 6}h8l-4 -6z" fill="${C.gold}"/></g>`;
    case 2: // little globe
      return `<g><circle cx="${x + 13}" cy="${base - 22}" r="12" fill="#3b6f8c"/><path d="M${x + 6} ${base - 26}q6 -6 12 0t2 8q-6 4 -10 -2z" fill="${C.moss}"/><path d="M${x + 13} ${base - 8}v8M${x + 5} ${base}h16" stroke="${C.gold2}" stroke-width="3"/></g>`;
    case 3: // candle
      return `<g><rect x="${x + 6}" y="${base - 28}" width="10" height="28" fill="${C.cream}"/><path d="M${x + 11} ${base - 40}q-5 7 0 11q5 -4 0 -11z" fill="${C.amber}" class="flame"/>${glow(x + 11, base - 34, 26)}</g>`;
    case 4: // potted sprout
      return `<g><path d="M${x + 2} ${base - 16}h22l-3 16h-16z" fill="#b5543c"/><path d="M${x + 13} ${base - 16}q-10 -18 -2 -26q2 12 2 26q2 -20 12 -22q-2 14 -12 22" fill="${C.moss}"/></g>`;
    default: // small stacked books lying flat
      return `<g><rect x="${x}" y="${base - 8}" width="34" height="8" fill="${pick(r, BOOK_COLORS)}"/><rect x="${x + 3}" y="${base - 15}" width="28" height="7" fill="${pick(r, BOOK_COLORS)}"/><rect x="${x + 1}" y="${base - 21}" width="30" height="6" fill="${pick(r, BOOK_COLORS)}"/></g>`;
  }
}

export interface BookcaseOpts { rows?: number; arch?: boolean; trinkets?: number; breathe?: number; gaps?: number }

/** A full bookcase filled with spines and trinkets. */
export function bookcase(x: number, y: number, w: number, h: number, seed: number, o: BookcaseOpts = {}) {
  const r = rng(seed);
  const rows = o.rows ?? Math.max(3, Math.round(h / 130));
  const rowH = (h - 40) / rows;
  let s = `<g class="bookcase">`;
  const top = o.arch
    ? `<path d="M${x} ${y + 60}Q${x} ${y} ${x + w / 2} ${y - 20}Q${x + w} ${y} ${x + w} ${y + 60}z" fill="url(#g-wood-v)"/>`
    : `<rect x="${x - 8}" y="${y - 18}" width="${w + 16}" height="22" rx="3" fill="${C.wood2}"/>`;
  s += top;
  s += `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="url(#g-shelf-back)"/>`;
  for (let i = 0; i < rows; i++) {
    const base = y + 20 + rowH * (i + 1) - 6;
    let cx = x + 12;
    const end = x + w - 12;
    while (cx < end - 10) {
      const roll = r();
      if (roll < (o.trinkets ?? 0.06)) {
        s += trinket(cx, base, r);
        cx += 36;
        continue;
      }
      if (roll < (o.trinkets ?? 0.06) + (o.gaps ?? 0.03)) { cx += 22 + r() * 30; continue; }
      const bw = between(r, 13, 26);
      if (cx + bw > end) break;
      const bh = rowH * between(r, 0.55, 0.9);
      const lean = r() < 0.04 ? between(r, -14, 14) : 0;
      const breathe = r() < (o.breathe ?? 0.02);
      const sp = spine(cx, base, bw, bh, pick(r, BOOK_COLORS), r, lean);
      s += breathe ? `<g class="breathe" style="animation-delay:${f(-r() * 4)}s">${sp}</g>` : sp;
      cx += bw + (r() < 0.2 ? 2 : 0.5);
    }
    s += `<rect x="${x}" y="${base}" width="${w}" height="12" fill="url(#g-wood-v)"/><rect x="${x}" y="${base + 12}" width="${w}" height="4" fill="#000" opacity=".35"/>`;
  }
  s += `<rect x="${x - 14}" y="${y - 4}" width="18" height="${h + 8}" fill="url(#g-wood)"/><rect x="${x + w - 4}" y="${y - 4}" width="18" height="${h + 8}" fill="url(#g-wood)"/>`;
  s += `<rect x="${x - 18}" y="${y + h}" width="${w + 36}" height="16" fill="${C.wood1}"/></g>`;
  return s;
}

/** Tall arched window with moonlight. */
export function archWindow(x: number, y: number, w: number, h: number, sky = '#1d3474', moon = true) {
  const r = rng(Math.round(x));
  let stars = '';
  for (let i = 0; i < 18; i++) stars += `<circle class="twinkle" style="animation-delay:${f(-r() * 5)}s" cx="${f(x + r() * w)}" cy="${f(y + r() * h * 0.7)}" r="${f(0.8 + r() * 1.8)}" fill="#fff"/>`;
  return `<g><clipPath id="cw-${Math.round(x)}"><path d="M${x} ${y + w / 2}A${w / 2} ${w / 2} 0 0 1 ${x + w} ${y + w / 2}V${y + h}H${x}z"/></clipPath>
  <g clip-path="url(#cw-${Math.round(x)})"><rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${sky}"/>${stars}
  ${moon ? `<circle cx="${x + w * 0.68}" cy="${y + w * 0.45}" r="${w * 0.14}" fill="url(#g-moon)"/>` : ''}</g>
  <path d="M${x} ${y + w / 2}A${w / 2} ${w / 2} 0 0 1 ${x + w} ${y + w / 2}V${y + h}H${x}z" fill="none" stroke="${C.wood2}" stroke-width="12"/>
  <path d="M${x + w / 2} ${y}V${y + h}M${x} ${y + h * 0.55}H${x + w}" stroke="${C.wood2}" stroke-width="6"/>
  <rect x="${x - 16}" y="${y + h}" width="${w + 32}" height="14" fill="${C.wood2}"/></g>`;
}

/** A soft beam of light falling into the room. */
export function ray(x1: number, y1: number, topW: number, x2: number, y2: number, botW: number, blue = false) {
  return `<path class="ray" d="M${x1} ${y1}h${topW}L${x2 + botW} ${y2}h${-botW}z" fill="url(#${blue ? 'g-ray-blue' : 'g-ray'})" style="mix-blend-mode:screen"/>`;
}

export function pillar(x: number, w = 70) {
  return `<g><rect x="${x}" y="60" width="${w}" height="760" fill="url(#g-wood)"/><rect x="${x - 12}" y="40" width="${w + 24}" height="34" rx="6" fill="${C.wood3}"/>
  <rect x="${x - 12}" y="790" width="${w + 24}" height="30" rx="4" fill="${C.wood3}"/>
  <path d="M${x + w * 0.3} 80V790M${x + w * 0.7} 80V790" stroke="#000" stroke-opacity=".2" stroke-width="4"/></g>`;
}

/** Hanging or standing lamp with a warm pool of light. */
export function lamp(x: number, y: number, hanging = true) {
  const cord = hanging ? `<line x1="${x}" y1="0" x2="${x}" y2="${y - 20}" stroke="#1a0f08" stroke-width="3"/>` : '';
  return `<g>${cord}${glow(x, y + 10, 190)}<path d="M${x - 34} ${y + 6}q34 -40 68 0z" fill="${C.teal}" opacity=".9"/><path d="M${x - 34} ${y + 6}h68" stroke="${C.gold}" stroke-width="3"/>
  <circle cx="${x}" cy="${y + 12}" r="8" fill="#fff6d8" class="flicker"/></g>`;
}

export function readingLamp(x: number, base: number) {
  return `<g>${glow(x + 30, base - 70, 130)}<path d="M${x} ${base}h40M${x + 20} ${base}v-60l20 -10" stroke="${C.gold2}" stroke-width="5" fill="none"/>
  <path d="M${x + 22} ${base - 78}l40 -6l6 22l-36 10z" fill="#2f6b4f"/><circle cx="${x + 46}" cy="${base - 58}" r="6" fill="#fff4cc" class="flicker"/></g>`;
}

export function table(x: number, y: number, w: number) {
  return `<g><rect x="${x}" y="${y}" width="${w}" height="16" rx="4" fill="${C.wood3}"/><rect x="${x}" y="${y + 14}" width="${w}" height="6" fill="#000" opacity=".3"/>
  <rect x="${x + 16}" y="${y + 16}" width="14" height="${820 - y - 16}" fill="${C.wood1}"/><rect x="${x + w - 30}" y="${y + 16}" width="14" height="${820 - y - 16}" fill="${C.wood1}"/></g>`;
}

export function plant(x: number, base: number, scale = 1) {
  const leaves = [-60, -35, -15, 10, 35, 60, -80, 80]
    .map((a, i) => `<path d="M0 0q${-20 + i * 4} -70 ${Math.sin((a * Math.PI) / 180) * 90} ${-110 - (i % 3) * 25}q-10 60 0 110" fill="${i % 2 ? '#4f7f42' : '#6aa255'}"/>`)
    .join('');
  return `<g transform="translate(${x} ${base}) scale(${scale})"><g transform="translate(0 -70)">${leaves}</g><path d="M-40 -70h80l-12 70h-56z" fill="#a8553a"/><rect x="-44" y="-78" width="88" height="12" rx="4" fill="#c06a48"/></g>`;
}

export function bookStack(x: number, base: number, n: number, seed: number) {
  const r = rng(seed);
  let s = '', y = base;
  for (let i = 0; i < n; i++) {
    const w = between(r, 70, 110), h = between(r, 14, 22), off = between(r, -10, 10);
    s += `<rect x="${f(x + off)}" y="${f(y - h)}" width="${f(w)}" height="${f(h)}" rx="2" fill="${pick(r, BOOK_COLORS)}"/><rect x="${f(x + off + w - 6)}" y="${f(y - h + 2)}" width="4" height="${f(h - 4)}" fill="${C.paper}" opacity=".7"/>`;
    y -= h;
  }
  return `<g>${s}</g>`;
}

export function ladder(x: number, top: number, bottom = 820) {
  let rungs = '';
  for (let y = top + 30; y < bottom; y += 50) rungs += `<line x1="${x + 8}" y1="${y}" x2="${x + 62}" y2="${y}" stroke="${C.wood3}" stroke-width="7"/>`;
  return `<g transform="rotate(-6 ${x} ${bottom})"><rect x="${x}" y="${top}" width="9" height="${bottom - top}" fill="${C.wood2}"/><rect x="${x + 62}" y="${top}" width="9" height="${bottom - top}" fill="${C.wood2}"/>${rungs}</g>`;
}

/** Twinkling stars across a region. */
export function starfield(x: number, y: number, w: number, h: number, n: number, seed: number) {
  const r = rng(seed);
  let s = '';
  for (let i = 0; i < n; i++)
    s += `<circle class="twinkle" style="animation-delay:${f(-r() * 6)}s" cx="${f(x + r() * w)}" cy="${f(y + r() * h)}" r="${f(0.6 + r() * 2)}" fill="#fff8e0"/>`;
  return s;
}

/** Garland of small lights strung between two points. */
export function garland(x1: number, x2: number, y: number, sag: number, seed: number) {
  const r = rng(seed);
  let s = `<path d="M${x1} ${y}Q${(x1 + x2) / 2} ${y + sag * 2} ${x2} ${y}" stroke="#2a1a10" stroke-width="2" fill="none"/>`;
  for (let i = 1; i < 14; i++) {
    const t = i / 14;
    const px = x1 + (x2 - x1) * t;
    const py = (1 - t) * (1 - t) * y + 2 * (1 - t) * t * (y + sag * 2) + t * t * y;
    s += `<circle class="twinkle" style="animation-delay:${f(-r() * 4)}s" cx="${f(px)}" cy="${f(py + 6)}" r="5" fill="${pick(r, [C.amber, C.gold, C.rose, '#bdf2ff'])}"/>`;
  }
  return s;
}

/** The book each wanderer returns to. It glows while its wanderer is travelling. */
export function homeBook(id: string, x: number, y: number, emblem: string, color: string) {
  return `<g class="homebook" data-home="${id}" transform="translate(${x} ${y})">
  <circle class="beacon" r="70" fill="url(#g-glow)"/>
  <rect x="-26" y="-38" width="52" height="72" rx="4" fill="${color}" stroke="${C.gold}" stroke-width="3"/>
  <rect x="-26" y="-38" width="8" height="72" fill="#000" opacity=".2"/>
  <g class="emblem" transform="scale(.36)" opacity=".55">${emblem}</g>
  <rect x="-20" y="26" width="40" height="3" fill="${C.gold}" opacity=".8"/></g>`;
}
