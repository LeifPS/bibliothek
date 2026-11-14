import type { PuzzleKind } from '../content/types';
import { app, h, icon, ICONS } from '../engine/ui';
import { sound } from '../engine/audio';
import { defs, C } from '../engine/svg';
import { SEALS } from '../content/art';
import { randSeed } from '../rng';
import { createUntangle, crossingPairs, moveNode, untangleHint, type Untangle } from './logic/untangle';
import { createStairs, rotateTile, stairsSolved, stairsHint, litTiles, N, E, S, W, type Stairs } from './logic/stairs';
import { createOrder, swap, orderSolved, orderHint, type Order } from './logic/order';
import { createRings, turnRing, ringsSolved, ringsHint, RING_STEPS, type Rings } from './logic/rings';

export interface PuzzleOpts { title: string; intro: string; onSolved(noHint: boolean): void; onClose?(): void }

interface Board { el: SVGSVGElement; hint(): void; solved(): boolean; wide?: boolean }

// unsolved puzzle states survive closing the modal (within one session)
const saved = new Map<PuzzleKind, { state: unknown; hintUsed: boolean }>();

export function openPuzzle(kind: PuzzleKind, o: PuzzleOpts) {
  const keep = saved.get(kind);
  let hintUsed = keep?.hintUsed ?? false;
  const root = h('div', 'puzzle');
  const bar = h('div', 'pbar');
  const back = h('button', 'chip-btn', `${icon(ICONS.close)}<span>Später</span>`);
  const hintBtn = h('button', 'chip-btn', `${icon(ICONS.lantern)}<span>Laterne</span>`);
  bar.append(back, hintBtn);
  root.append(bar, h('h3', '', o.title), h('div', 'instr', o.intro));
  const boardWrap = h('div', 'board');
  root.appendChild(boardWrap);
  let done = false;
  const check = () => {
    if (done || !board.solved()) return;
    done = true;
    saved.delete(kind);
    root.classList.add('solved');
    sound.play('solve');
    setTimeout(() => { root.remove(); o.onSolved(!hintUsed); }, 2200);
  };
  const board = BUILDERS[kind](keep?.state, check, (st) => saved.set(kind, { state: st, hintUsed }));
  if (board.wide) boardWrap.classList.add('wide');
  boardWrap.appendChild(board.el);
  back.onclick = () => { sound.play('click'); saved.set(kind, { state: saved.get(kind)?.state ?? keep?.state, hintUsed }); root.remove(); o.onClose?.(); };
  hintBtn.onclick = () => { hintUsed = true; const s = saved.get(kind); if (s) s.hintUsed = true; sound.play('hint'); board.hint(); };
  app().appendChild(root);
}

const NS = 'http://www.w3.org/2000/svg';
function svgEl(viewBox: string, inner: string): SVGSVGElement {
  const s = document.createElementNS(NS, 'svg');
  s.setAttribute('viewBox', viewBox);
  s.innerHTML = defs() + inner;
  return s;
}
function svgPoint(svg: SVGSVGElement, e: PointerEvent) {
  const pt = svg.createSVGPoint();
  pt.x = e.clientX; pt.y = e.clientY;
  return pt.matrixTransform(svg.getScreenCTM()!.inverse());
}
function flash(el: Element | null) {
  if (!el) return;
  el.classList.remove('noticed'); void (el as SVGGElement).getBoundingClientRect(); el.classList.add('noticed');
}

type Builder = (state: unknown, check: () => void, save: (s: unknown) => void) => Board;

const RIBBONS = ['#c43c5a', '#3f8fb6', '#e0a43a', '#6b4f9e', '#3e9a6f', '#d0643a'];

/* ---------------- Untangle: bookmark ribbons ---------------- */
const untangle: Builder = (state, check, save) => {
  const u: Untangle = (state as Untangle) ?? createUntangle(randSeed());
  save(u);
  const svg = svgEl('0 0 1000 1000', `<circle cx="500" cy="500" r="490" fill="#f3e6c4" opacity=".1"/><g class="edges"></g><g class="nodes"></g>`);
  const eg = svg.querySelector('.edges')!, ng = svg.querySelector('.nodes')!;
  let hinted = -1;
  const draw = () => {
    const bad = new Set(crossingPairs(u).flat());
    eg.innerHTML = u.edges.map(([a, b], i) => {
      const A = u.nodes[a], B = u.nodes[b];
      const mx = (A.x + B.x) / 2 + (A.y - B.y) * 0.06, my = (A.y + B.y) / 2 + (B.x - A.x) * 0.06;
      const col = bad.has(i) ? RIBBONS[i % RIBBONS.length] : C.gold;
      return `<path d="M${A.x} ${A.y}Q${mx} ${my} ${B.x} ${B.y}" stroke="#000" stroke-opacity=".35" stroke-width="22" fill="none" transform="translate(4 6)"/>
        <path d="M${A.x} ${A.y}Q${mx} ${my} ${B.x} ${B.y}" stroke="${col}" stroke-width="16" fill="none" stroke-linecap="round" ${bad.has(i) ? '' : 'filter="url(#f-glow)"'}/>
        <path d="M${A.x} ${A.y}Q${mx} ${my} ${B.x} ${B.y}" stroke="#fff" stroke-opacity=".25" stroke-width="4" fill="none"/>`;
    }).join('');
    ng.innerHTML = u.nodes.map((p, i) => `<g data-n="${i}" transform="translate(${p.x} ${p.y})" style="cursor:grab">
      ${i === hinted ? '<circle r="70" fill="url(#g-glow)" class="flicker"/>' : ''}
      <circle r="42" fill="url(#g-gold)" stroke="#8a5a1a" stroke-width="4"/><circle r="22" fill="#5a3418"/><circle r="10" fill="#f6e8c8" opacity=".8"/></g>`).join('');
  };
  draw();
  let drag: number | null = null;
  svg.addEventListener('pointerdown', (e) => {
    const g = (e.target as Element).closest('[data-n]');
    if (!g) return;
    drag = +g.getAttribute('data-n')!;
    svg.setPointerCapture(e.pointerId);
    sound.play('tap');
  });
  svg.addEventListener('pointermove', (e) => {
    if (drag === null) return;
    const p = svgPoint(svg, e);
    moveNode(u, drag, p.x, p.y);
    draw();
  });
  const end = () => { if (drag === null) return; drag = null; hinted = -1; draw(); check(); };
  svg.addEventListener('pointerup', end);
  svg.addEventListener('pointercancel', end);
  return { el: svg, solved: () => crossingPairs(u).length === 0, hint: () => { hinted = untangleHint(u) ?? -1; draw(); } };
};

/* ---------------- Stairs: rotate stair pieces ---------------- */
const TILE = 180;
function stairShape(mask: number) {
  // draw a stair "arm" from the centre to each connected edge
  const arms = [[N, 0], [E, 90], [S, 180], [W, 270]].filter(([b]) => mask & b).map(([, a]) =>
    `<g transform="rotate(${a})"><rect x="-30" y="-92" width="60" height="92" fill="#8a6a9e"/>${[0, 1, 2, 3, 4].map((k) => `<rect x="-30" y="${-92 + k * 18}" width="60" height="9" fill="#a88abf"/>`).join('')}</g>`).join('');
  return `${arms}<circle r="36" fill="#7a5a90"/><circle r="26" fill="#a88abf"/>`;
}
const stairs: Builder = (state, check, save) => {
  const st: Stairs & { turns?: number[]; base?: number[] } = (state as Stairs) ?? createStairs(randSeed());
  st.turns ??= st.tiles.map(() => 0);
  st.base ??= [...st.tiles];
  save(st);
  const w = st.w * TILE, hgt = st.h * TILE, ox = 100, oy = 40;
  let tilesSvg = '';
  st.tiles.forEach((_, i) => {
    const x = ox + (i % st.w) * TILE + TILE / 2, y = oy + Math.floor(i / st.w) * TILE + TILE / 2;
    tilesSvg += `<g data-t="${i}" transform="translate(${x} ${y})" style="cursor:pointer"><rect x="-86" y="-86" width="172" height="172" rx="16" fill="#241a40" stroke="#3b2f66" stroke-width="3"/>
      <g class="lit-glow" opacity="0"><rect x="-86" y="-86" width="172" height="172" rx="16" fill="url(#g-glow)"/></g>
      <g class="rot" style="transition:transform .35s cubic-bezier(.3,1.5,.5,1);transform:rotate(${st.turns![i] * 90}deg)">${stairShape(st.base![i])}</g></g>`;
  });
  const door = (x: number, y: number, flip: boolean) => `<g transform="translate(${x} ${y}) ${flip ? 'scale(-1 1)' : ''}"><path d="M-10 70v-110a40 40 0 0 1 80 0v110z" fill="${C.wood2}" stroke="${C.gold}" stroke-width="4"/><circle cx="52" cy="14" r="6" fill="${C.gold}"/>${'<circle cx="30" cy="-10" r="40" fill="url(#g-glow)"/>'}</g>`;
  const svg = svgEl(`0 0 ${w + 200} ${hgt + 80}`, `${door(20, oy + st.startRow * TILE + TILE / 2 - 20, false)}${door(w + 180, oy + st.endRow * TILE + TILE / 2 - 20, true)}${tilesSvg}`);
  const paint = () => {
    const lit = litTiles(st);
    svg.querySelectorAll('[data-t]').forEach((g) => {
      const i = +g.getAttribute('data-t')!;
      (g.querySelector('.lit-glow') as SVGGElement).setAttribute('opacity', lit.has(i) ? '.8' : '0');
    });
  };
  paint();
  svg.addEventListener('click', (e) => {
    const g = (e.target as Element).closest('[data-t]');
    if (!g) return;
    const i = +g.getAttribute('data-t')!;
    rotateTile(st, i);
    st.turns![i]++;
    (g.querySelector('.rot') as SVGGElement).style.transform = `rotate(${st.turns![i] * 90}deg)`;
    sound.play('rotate');
    paint();
    check();
  });
  return {
    el: svg, wide: true, solved: () => stairsSolved(st),
    hint: () => { const i = stairsHint(st); if (i !== null) flash(svg.querySelector(`[data-t="${i}"] .rot`)); },
  };
};

/* ---------------- Tiles: the torn map ---------------- */
const MAP_ART = `<g id="mapart"><rect width="900" height="900" fill="#ecdcae"/><rect width="900" height="900" fill="url(#g-glow)" opacity=".25"/>
  <path d="M0 620q160 -60 260 20t260 -10t380 40" stroke="#7fb6c8" stroke-width="22" fill="none"/>
  ${[[120, 170], [200, 130], [170, 230], [90, 260], [260, 210]].map(([x, y]) => `<path d="M${x} ${y}l26 -50l26 50z" fill="#5f8f4e"/><rect x="${x + 22}" y="${y}" width="8" height="12" fill="#6e4526"/>`).join('')}
  <path d="M600 260l70 -150l70 150z" fill="#9a8a7a"/><path d="M650 152l20 -42l20 42l-20 -8z" fill="#fff"/><path d="M700 280l60 -120l60 120z" fill="#8a7a6a"/>
  <path d="M720 200q20 -18 40 0" stroke="#d23c3c" stroke-width="4" fill="none"/>
  <g transform="translate(150 760)"><circle r="40" fill="#5fae6a"/><circle r="22" fill="#2f8a4a"/><circle r="5" fill="${C.gold}"/></g>
  <g transform="translate(470 420)"><path d="M-40 30q40 -80 80 0z" fill="#b5543c"/><rect x="-6" y="0" width="12" height="30" fill="#6e4526"/></g>
  <path class="route" d="M150 760C260 700 300 620 330 520S470 420 470 440S560 320 640 260S720 190 740 200" stroke="#8c2f39" stroke-width="9" stroke-dasharray="4 18" stroke-linecap="round" fill="none"/>
  <path class="route-gold" d="M150 760C260 700 300 620 330 520S470 420 470 440S560 320 640 260S720 190 740 200" stroke="${C.gold}" stroke-width="10" stroke-linecap="round" fill="none" stroke-dasharray="1400" stroke-dashoffset="1400" filter="url(#f-glow)"/>
  <text x="450" y="80" text-anchor="middle" font-family="Georgia" font-style="italic" font-size="48" fill="#5a3a22">Hin und zurück</text>
  <g transform="translate(820 820)"><circle r="44" fill="none" stroke="#5a3a22" stroke-width="3"/><path d="M0 -40l8 40l-8 40l-8 -40z" fill="#5a3a22"/><text y="-50" text-anchor="middle" font-size="20" fill="#5a3a22">N</text></g>
  <path d="M0 0h900v900h-900z" fill="none" stroke="#a88a5a" stroke-width="14"/></g>`;
const tiles: Builder = (state, check, save) => {
  const o: Order = (state as Order) ?? createOrder(9, randSeed());
  save(o);
  const P = 300;
  const svg = svgEl('-20 -20 940 940', `<defs>${MAP_ART}<clipPath id="tileclip"><rect width="${P}" height="${P}"/></clipPath></defs><g class="tiles"></g><g class="grid" pointer-events="none" style="transition:opacity 1s">${[1, 2].map((k) => `<path d="M${k * P} 0v${3 * P}M0 ${k * P}h${3 * P}" stroke="#5a3a22" stroke-width="5" stroke-dasharray="14 10"/>`).join('')}<rect width="${3 * P}" height="${3 * P}" fill="none" stroke="#5a3a22" stroke-width="6"/></g>`);
  const tg = svg.querySelector('.tiles')!;
  let sel: number | null = null;
  // one element per piece, positioned at its slot
  const pieces = Array.from({ length: 9 }, (_, piece) => {
    const g = document.createElementNS(NS, 'g');
    g.setAttribute('data-piece', String(piece));
    g.style.transition = 'transform .45s cubic-bezier(.3,1.3,.5,1)';
    g.style.cursor = 'pointer';
    g.innerHTML = `<g clip-path="url(#tileclip)"><use href="#mapart" x="${-(piece % 3) * P}" y="${-Math.floor(piece / 3) * P}"/></g><rect class="sel" x="6" y="6" width="${P - 12}" height="${P - 12}" fill="none" stroke="${C.gold}" stroke-width="10" opacity="0"/>`;
    tg.appendChild(g);
    return g;
  });
  const place = () => o.perm.forEach((piece, slot) => {
    pieces[piece].style.transform = `translate(${(slot % 3) * P}px, ${Math.floor(slot / 3) * P}px)`;
    (pieces[piece].querySelector('.sel') as SVGRectElement).setAttribute('opacity', sel === slot ? '1' : '0');
  });
  place();
  svg.addEventListener('click', (e) => {
    const g = (e.target as Element).closest('[data-piece]');
    if (!g) return;
    const slot = o.perm.indexOf(+g.getAttribute('data-piece')!);
    if (sel === null) { sel = slot; sound.play('tap'); }
    else if (sel === slot) sel = null;
    else { swap(o, sel, slot); sel = null; sound.play('page'); }
    place();
    if (orderSolved(o)) {
      svg.querySelector('.grid')!.setAttribute('opacity', '0');
      const route = svg.querySelector('.route-gold') as SVGPathElement;
      route.style.transition = 'stroke-dashoffset 2s ease-in-out';
      requestAnimationFrame(() => { route.style.strokeDashoffset = '0'; });
    }
    check();
  });
  return {
    el: svg, solved: () => orderSolved(o),
    hint: () => { const hnt = orderHint(o); if (hnt) { sel = hnt[0]; place(); flash(pieces[o.perm[hnt[1]]]); } },
  };
};

/* ---------------- Rings: the star circle ---------------- */
// a sitting cat made of stars; each star belongs to the ring its radius falls in
const CAT_STARS: [number, number][] = [
  [-60, -260], [-20, -200], [30, -200], [70, -260], // ears/head
  [-70, -130], [80, -130], [-110, 20], [120, 10], [-90, 180], [110, 180], [0, 230], [190, 140], [250, 40], [330, -60],
  [-330, -180], [-300, 250], [180, -340], [-400, 40], [340, 280],
];
const CAT_LINES: [number, number][] = [[0, 1], [1, 2], [2, 3], [0, 4], [3, 5], [4, 6], [5, 7], [6, 8], [7, 9], [8, 10], [10, 9], [9, 11], [11, 12], [12, 13]];
const RADII = [[0, 190], [190, 300], [300, 460]];
const ringOf = ([x, y]: [number, number]) => RADII.findIndex(([a, b]) => Math.hypot(x, y) >= a && Math.hypot(x, y) < b);
const rings: Builder = (state, check, save) => {
  const r: Rings = (state as Rings) ?? createRings(randSeed());
  save(r);
  const ringSvg = RADII.map(([a, b], i) => {
    const stars = CAT_STARS.map((p, k) => ({ p, k })).filter(({ p }) => ringOf(p) === i)
      .map(({ p, k }) => `<g transform="translate(${p[0]} ${p[1]})"><circle r="26" fill="url(#g-glow)"/><circle r="${k % 3 ? 7 : 9}" fill="#fff8e0"/></g>`).join('');
    const moon = `<g transform="translate(0 ${-b + 18})"><path d="M0 -14l12 20h-24z" fill="${C.gold}" stroke="#fff3c4" stroke-width="2"/></g>`;
    let dots = '';
    for (let k = 0; k < 40; k++) { const ang = (k / 40) * Math.PI * 2; const rr = a + 10 + ((k * 37) % Math.max(1, b - a - 20)); dots += `<circle cx="${(Math.cos(ang) * rr).toFixed(0)}" cy="${(Math.sin(ang) * rr).toFixed(0)}" r="1.6" fill="#c9d6ff" opacity=".5"/>`; }
    return `<g data-r="${i}" style="cursor:pointer"><g class="rot" style="transition:transform .5s cubic-bezier(.3,1.4,.5,1);transform:rotate(${r.offsets[i] * (360 / RING_STEPS)}deg)">
      <path d="${annulus(a, b)}" fill="${['#1b1d4a', '#202462', '#252a78'][i]}" stroke="#4a4f9e" stroke-width="3"/>${dots}${moon}${stars}</g></g>`;
  }).join('');
  const svg = svgEl('-560 -560 1120 1120', `<circle r="480" fill="#0d0f2e" stroke="${C.gold}" stroke-width="8"/>${ringSvg}
    <g class="lines" opacity="0" style="transition:opacity 1.5s">${CAT_LINES.map(([a, b]) => `<line x1="${CAT_STARS[a][0]}" y1="${CAT_STARS[a][1]}" x2="${CAT_STARS[b][0]}" y2="${CAT_STARS[b][1]}" stroke="#ffe9a8" stroke-width="4" filter="url(#f-glow)"/>`).join('')}</g>
    <path d="M0 -478l-18 -34h36z" fill="${C.gold}" stroke="#fff3c4" stroke-width="2"/>
    <g transform="translate(470 -470) scale(.2)" opacity=".85"><circle r="300" fill="#0d0f2e" stroke="${C.gold}" stroke-width="10"/>${CAT_LINES.map(([a, b]) => `<line x1="${CAT_STARS[a][0]}" y1="${CAT_STARS[a][1]}" x2="${CAT_STARS[b][0]}" y2="${CAT_STARS[b][1]}" stroke="#ffe9a8" stroke-width="12"/>`).join('')}</g>`);
  svg.addEventListener('click', (e) => {
    const p = svgPoint(svg, e as PointerEvent);
    const i = RADII.findIndex(([a, b]) => Math.hypot(p.x, p.y) >= a && Math.hypot(p.x, p.y) < b);
    if (i < 0) return;
    turnRing(r, i);
    const rot = svg.querySelector(`[data-r="${i}"] .rot`) as SVGGElement;
    const cur = parseFloat(rot.dataset.turn ?? String(r.offsets[i] === 0 ? RING_STEPS - 1 : r.offsets[i] - 1));
    rot.dataset.turn = String(cur + 1);
    rot.style.transform = `rotate(${(cur + 1) * (360 / RING_STEPS)}deg)`;
    sound.play('rotate');
    if (ringsSolved(r)) (svg.querySelector('.lines') as SVGGElement).setAttribute('opacity', '1');
    check();
  });
  return { el: svg, solved: () => ringsSolved(r), hint: () => { const i = ringsHint(r); if (i !== null) flash(svg.querySelector(`[data-r="${i}"]`)); } };
};
function annulus(a: number, b: number) {
  const circ = (rad: number, sweep: number) => rad === 0 ? '' : `M${rad} 0A${rad} ${rad} 0 1 ${sweep} ${-rad} 0A${rad} ${rad} 0 1 ${sweep} ${rad} 0z`;
  return circ(b, 1) + circ(a, 0);
}

/* ---------------- Pages: the book without an end ---------------- */
export const PAGE_TEXT: { seal: string; lines: string[] }[] = [
  { seal: 'feder', lines: ['Am Anfang schrieb', 'eine Feder den', 'allerersten Satz.'] },
  { seal: 'schluessel', lines: ['Dann öffnete ein', 'Schlüssel die Tür', 'zu allen Geschichten.'] },
  { seal: 'blatt', lines: ['Ein Blatt zeigte', 'den Weg durch Wald', 'und Karten.'] },
  { seal: 'stern', lines: ['Und ein Stern führte', 'jeden Leser wieder', 'nach Hause.'] },
];
const pages: Builder = (state, check, save) => {
  const o: Order = (state as Order) ?? createOrder(4, randSeed());
  save(o);
  const PW = 250, GAP = 20, X0 = 15;
  const svg = svgEl('0 0 1120 800', `${['I', 'II', 'III', 'IV'].map((n, i) => `<text x="${X0 + i * (PW + GAP) + PW / 2}" y="760" text-anchor="middle" font-family="Georgia" font-size="48" fill="${C.gold}">${n}</text>`).join('')}<g class="pg"></g>`);
  const pg = svg.querySelector('.pg')!;
  let sel: number | null = null;
  const els = PAGE_TEXT.map((p, k) => {
    const g = document.createElementNS(NS, 'g');
    g.setAttribute('data-page', String(k));
    g.style.cursor = 'pointer';
    g.style.transition = 'transform .5s cubic-bezier(.3,1.3,.5,1)';
    g.innerHTML = `<rect x="6" y="10" width="${PW}" height="620" rx="10" fill="#000" opacity=".3"/><rect width="${PW}" height="620" rx="10" fill="#fbf3dc" stroke="#c9b48a" stroke-width="3"/>
      <rect class="sel" x="-8" y="-8" width="${PW + 16}" height="636" rx="14" fill="none" stroke="${C.gold}" stroke-width="8" opacity="0"/>
      <g transform="translate(${PW / 2} 150) scale(1.6)"><circle r="44" fill="#9b1f2e"/><circle r="36" fill="none" stroke="#c9485a" stroke-width="3"/>${SEALS[p.seal]}</g>
      ${p.lines.map((l, j) => `<text x="${PW / 2}" y="${330 + j * 52}" text-anchor="middle" font-family="Georgia" font-style="italic" font-size="29" fill="#3b2414">${l}</text>`).join('')}
      <path d="M40 560h${PW - 80}" stroke="#c9b48a" stroke-width="2"/>`;
    pg.appendChild(g);
    return g;
  });
  const place = () => o.perm.forEach((page, slot) => {
    els[page].style.transform = `translate(${X0 + slot * (PW + GAP)}px, 40px)`;
    els[page].querySelector('.sel')!.setAttribute('opacity', sel === slot ? '1' : '0');
  });
  place();
  svg.addEventListener('click', (e) => {
    const g = (e.target as Element).closest('[data-page]');
    if (!g) return;
    const slot = o.perm.indexOf(+g.getAttribute('data-page')!);
    if (sel === null) { sel = slot; sound.play('tap'); }
    else if (sel === slot) sel = null;
    else { swap(o, sel, slot); sel = null; sound.play('page'); }
    place();
    check();
  });
  return {
    el: svg, wide: true, solved: () => orderSolved(o),
    hint: () => { const hnt = orderHint(o); if (hnt) { sel = hnt[0]; place(); flash(els[o.perm[hnt[1]]]); } },
  };
};

const BUILDERS: Record<PuzzleKind, Builder> = { untangle, stairs, tiles, rings, pages };
