import type { SceneDef } from './types';
import { wall, floor, rug, bookcase, archWindow, ray, pillar, table, bookStack, glow, C } from '../engine/svg';
import { rng } from '../rng';

const W = 3600;

/** Hanging lantern with a warm glow. */
function lantern(x: number, y: number) {
  return `<g><line x1="${x}" y1="0" x2="${x}" y2="${y - 34}" stroke="#1a0f08" stroke-width="3"/>${glow(x, y, 170)}
    <circle cx="${x}" cy="${y - 38}" r="7" fill="none" stroke="${C.gold2}" stroke-width="3"/>
    <path d="M${x - 20} ${y - 30}h40l-6 -6h-28z" fill="${C.wood1}"/>
    <path d="M${x - 18} ${y - 28}q-4 28 0 54h36q4 -26 0 -54z" fill="#ffcf7a" opacity=".85" stroke="${C.wood1}" stroke-width="4"/>
    <path d="M${x} ${y - 28}v54" stroke="${C.wood1}" stroke-width="3"/><path d="M${x - 22} ${y + 26}h44" stroke="${C.wood1}" stroke-width="6" stroke-linecap="round"/>
    <circle cx="${x}" cy="${y}" r="7" fill="#fff6d8" class="flicker"/></g>`;
}

/** Ivy garland drooping along the top. */
function ivy(x1: number, x2: number, y: number, seed: number) {
  const r = rng(seed);
  let s = `<path d="M${x1} ${y}Q${(x1 + x2) / 2} ${y + 70} ${x2} ${y}" stroke="#3b5a2a" stroke-width="4" fill="none"/>`;
  for (let i = 0; i <= 22; i++) {
    const t = i / 22;
    const px = x1 + (x2 - x1) * t;
    const py = (1 - t) * (1 - t) * y + 2 * (1 - t) * t * (y + 70) + t * t * y;
    const a = (r() - 0.5) * 120;
    s += `<path transform="translate(${px.toFixed(1)} ${py.toFixed(1)}) rotate(${a.toFixed(0)})" d="M0 0q10 -12 0 -24q-10 12 0 24z" fill="${r() < 0.5 ? '#4f7f42' : '#6aa255'}"/>`;
    if (r() < 0.3) {
      const len = 40 + r() * 90;
      s += `<path class="sway" style="animation-delay:${(-r() * 5).toFixed(1)}s" d="M${px.toFixed(1)} ${py.toFixed(1)}q${(r() - 0.5) * 20} ${len / 2} 0 ${len.toFixed(0)}" stroke="#3b5a2a" stroke-width="3" fill="none"/>`;
      for (let k = 1; k < 5; k++) s += `<path transform="translate(${(px + (k % 2 ? 6 : -6)).toFixed(1)} ${(py + (len * k) / 5).toFixed(1)}) rotate(${k % 2 ? 40 : -40})" d="M0 0q8 -9 0 -18q-8 9 0 18z" fill="#5f8f4e"/>`;
    }
  }
  return `<g>${s}</g>`;
}

/** Big round green door set into a bookcase wall. */
function roundDoor(cx: number, cy: number) {
  let stones = '';
  for (let i = 0; i < 18; i++) {
    const a = (i / 18) * Math.PI * 2;
    stones += `<rect x="-14" y="-10" width="28" height="20" rx="4" fill="${i % 2 ? '#8a7a6a' : '#9a8a7a'}" transform="translate(${(cx + Math.cos(a) * 128).toFixed(1)} ${(cy + Math.sin(a) * 128).toFixed(1)}) rotate(${((a * 180) / Math.PI + 90).toFixed(0)})"/>`;
  }
  let planks = '';
  for (let i = -3; i <= 3; i++) planks += `<line x1="${cx + i * 30}" y1="${cy - 110}" x2="${cx + i * 30}" y2="${cy + 110}" stroke="#1e5a30" stroke-width="2"/>`;
  return `<g>${glow(cx, cy, 220)}<circle cx="${cx}" cy="${cy}" r="140" fill="#1a1208"/>${stones}
    <clipPath id="rdclip"><circle cx="${cx}" cy="${cy}" r="112"/></clipPath>
    <g clip-path="url(#rdclip)"><rect x="${cx - 120}" y="${cy - 120}" width="240" height="240" fill="#2f8a4a"/>${planks}</g>
    <circle cx="${cx}" cy="${cy}" r="112" fill="none" stroke="#1e5a30" stroke-width="5"/>
    <circle cx="${cx}" cy="${cy}" r="16" fill="url(#g-gold)" stroke="${C.gold2}" stroke-width="2"/><circle cx="${cx - 4}" cy="${cy - 4}" r="4" fill="#fff6c8"/>
    <rect x="${cx - 150}" y="${cy + 118}" width="300" height="14" fill="${C.wood2}"/></g>`;
}

/** Cozy corner: round table, tablecloth, the second breakfast. */
function breakfastTable(x: number, top: number) {
  const cx = x + 140;
  return `<g>${glow(cx, top - 60, 200)}
    <rect x="${cx - 10}" y="${top}" width="20" height="${820 - top}" fill="${C.wood1}"/><path d="M${cx - 70} 820q70 -30 140 0" fill="${C.wood1}"/>
    <ellipse cx="${cx}" cy="${top}" rx="150" ry="22" fill="#f1e6cc"/>
    <path d="M${cx - 150} ${top}q-6 50 10 70q10 -18 26 0q14 -20 30 0q14 -20 30 0q14 -20 30 0q14 -20 30 0q14 -20 30 0q14 -20 30 0q16 -20 26 0q16 -20 10 -70" fill="#e9dcc0"/>
    ${[-120, -80, -40, 0, 40, 80, 120].map((dx) => `<rect x="${cx + dx - 6}" y="${top + 8}" width="12" height="12" fill="#c43c3c" opacity=".55"/>`).join('')}
    <!-- teapot -->
    <g transform="translate(${cx - 90} ${top - 30})"><ellipse cx="0" cy="8" rx="30" ry="24" fill="#3f8fb6"/><path d="M26 0q20 -6 24 -20" stroke="#3f8fb6" stroke-width="7" fill="none"/>
      <path d="M-28 -2q-16 0 -14 16q2 10 12 8" stroke="#3f8fb6" stroke-width="6" fill="none"/><ellipse cx="0" cy="-14" rx="14" ry="5" fill="#2f6f96"/><circle cx="0" cy="-20" r="5" fill="${C.gold}"/>
      <path d="M-10 -26q-6 -12 2 -22M4 -26q-6 -12 2 -22" stroke="#fff" stroke-opacity=".55" stroke-width="3" fill="none"/></g>
    <!-- bread, jam, cheese -->
    <g transform="translate(${cx + 90} ${top - 18})"><path d="M-30 14q0 -34 30 -34q30 0 30 34z" fill="#c7883a"/><path d="M-18 -4q6 -6 12 0M2 -10q6 -6 12 0" stroke="#8a5a2a" stroke-width="3" fill="none"/></g>
    <g transform="translate(${cx - 30} ${top - 22})"><rect x="-12" y="0" width="24" height="24" rx="4" fill="#c43c5a" opacity=".85"/><rect x="-13" y="-6" width="26" height="8" rx="2" fill="#f1e6cc"/></g>
    <g transform="translate(${cx + 32} ${top - 10})"><path d="M-18 10l18 -22l18 22z" fill="#f2c94c"/><circle cx="-4" cy="2" r="3" fill="#d9a73a"/></g>
    <ellipse cx="${cx}" cy="${top - 2}" rx="26" ry="7" fill="#fff" stroke="#c9b48a"/>
    <rect x="${cx - 112}" y="${top - 44}" width="10" height="38" fill="${C.cream}"/><path d="M${cx - 107} ${top - 58}q-5 7 0 11q5 -4 0 -11z" fill="${C.amber}" class="flame"/>${glow(cx - 107, top - 50, 40)}
    </g>`;
}

/** A framed parchment map on the wall. */
function frame(x: number, y: number, w: number, h: number, inner: string, id: string) {
  return `<g><rect x="${x - 18}" y="${y - 18}" width="${w + 36}" height="${h + 36}" rx="6" fill="${C.wood2}" stroke="${C.wood3}" stroke-width="6"/>
    <clipPath id="${id}"><rect x="${x}" y="${y}" width="${w}" height="${h}"/></clipPath>
    <g clip-path="url(#${id})"><rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#ecdcae"/><rect x="${x}" y="${y}" width="${w}" height="${h}" fill="url(#g-glow)" opacity=".2"/>${inner}</g>
    <rect x="${x}" y="${y}" width="${w}" height="${h}" fill="none" stroke="#a88a5a" stroke-width="5"/></g>`;
}

/** The living map: a floor plan of THIS room, with a dot that is you. */
function livingMap(x: number, y: number) {
  const w = 500, h = 420;
  const inner = `
    <text x="${x + w / 2}" y="${y + 50}" text-anchor="middle" font-family="Georgia" font-style="italic" font-size="34" fill="#5a3a22">Der Kartensaal</text>
    <rect x="${x + 30}" y="${y + 90}" width="${w - 60}" height="${h - 140}" fill="none" stroke="#5a3a22" stroke-width="4"/>
    <circle cx="${x + 70}" cy="${y + 230}" r="16" fill="none" stroke="#2f8a4a" stroke-width="4"/>
    <ellipse cx="${x + 120}" cy="${y + 300}" rx="22" ry="10" fill="none" stroke="#5a3a22" stroke-width="3"/>
    <rect x="${x + 160}" y="${y + 100}" width="70" height="30" fill="#c9b48a" stroke="#5a3a22" stroke-width="2"/>
    <circle cx="${x + 255}" cy="${y + 290}" r="14" fill="none" stroke="#355c8c" stroke-width="3"/>
    <rect x="${x + 270}" y="${y + 250}" width="60" height="34" fill="none" stroke="#5a3a22" stroke-width="3"/>
    <path d="M${x + 300} ${y + 160}q-3 -14 0 -20M${x + 306} ${y + 160}q-3 -14 0 -20" stroke="#5a3a22" stroke-width="3"/>
    <rect x="${x + 350}" y="${y + 100}" width="70" height="30" fill="#c9b48a" stroke="#5a3a22" stroke-width="2"/>
    <rect x="${x + 420}" y="${y + 300}" width="8" height="14" fill="#5a3a22"/>
    ${Array.from({ length: 8 }, (_, i) => `<path d="M${x + 60 + i * 50} ${y + 330}l6 -8l6 8" stroke="#a88a5a" stroke-width="2" fill="none"/>`).join('')}
    <g><circle cx="${x + 140}" cy="${y + 250}" r="9" fill="#c43c3c"><animate attributeName="cx" values="${x + 120};${x + 380};${x + 260};${x + 120}" dur="22s" repeatCount="indefinite"/></circle>
      <circle cx="${x + 140}" cy="${y + 250}" r="20" fill="none" stroke="#c43c3c" stroke-width="2" opacity=".6" class="twinkle"><animate attributeName="cx" values="${x + 120};${x + 380};${x + 260};${x + 120}" dur="22s" repeatCount="indefinite"/></circle>
      <text x="${x + 140}" y="${y + 232}" text-anchor="middle" font-family="Georgia" font-style="italic" font-size="20" fill="#c43c3c">du<animate attributeName="x" values="${x + 120};${x + 380};${x + 260};${x + 120}" dur="22s" repeatCount="indefinite"/></text></g>
    <g transform="translate(${x + w - 60} ${y + h - 50})"><circle r="24" fill="none" stroke="#5a3a22" stroke-width="2"/><path d="M0 -22l5 22l-5 22l-5 -22z" fill="#5a3a22"/></g>`;
  return frame(x, y, w, h, inner, 'lmclip');
}

/** Landscape wall map: hills, a river, a far mountain, the long road — and an okapi drawn into it. */
function landMap(x: number, y: number) {
  const w = 470, h = 380;
  const inner = `
    <path d="M${x} ${y + 260}q120 -40 200 10t270 -20" stroke="#7fb6c8" stroke-width="12" fill="none"/>
    ${[[60, 120], [100, 90], [130, 140], [40, 170], [90, 180]].map(([dx, dy]) => `<path d="M${x + dx} ${y + dy}l16 -32l16 32z" fill="#5f8f4e"/>`).join('')}
    <path d="M${x + 300} ${y + 160}l60 -120l60 120z" fill="#9a8a7a"/><path d="M${x + 340} ${y + 80}l20 -40l20 40l-20 -8z" fill="#fff"/>
    <path d="M${x + 380} ${y + 100}q14 -14 28 0" stroke="#d23c3c" stroke-width="3" fill="none"/>
    <path d="M${x + 50} ${y + 330}C${x + 120} ${y + 280} ${x + 200} ${y + 300} ${x + 240} ${y + 220}S${x + 330} ${y + 180} ${x + 360} ${y + 140}" stroke="#8c2f39" stroke-width="5" stroke-dasharray="3 10" stroke-linecap="round" fill="none"/>
    <g transform="translate(${x + 50} ${y + 330})"><circle r="14" fill="#5fae6a"/><circle r="6" fill="#2f8a4a"/></g>
    <text x="${x + w / 2}" y="${y + 40}" text-anchor="middle" font-family="Georgia" font-style="italic" font-size="28" fill="#5a3a22">Hin und zurück</text>
    <text x="${x + 330}" y="${y + 200}" font-family="Georgia" font-size="13" fill="#5a3a22" opacity=".7">Hier wohnen Drachen</text>
    <text x="${x + 60}" y="${y + 230}" font-family="Georgia" font-size="13" fill="#5a3a22" opacity=".7">sehr ruhige Wiese</text>`;
  return frame(x, y, w, h, inner, 'landclip');
}

/** Wide map cabinet with many shallow drawers; one is half open. */
function mapCabinet(x: number, w: number, openY: number) {
  const top = 600;
  let drawers = '';
  for (let r = 0; r < 4; r++)
    for (let c = 0; c < 3; c++) {
      const dx = x + 14 + c * ((w - 28) / 3), dy = top + 22 + r * 46, dw = (w - 28) / 3 - 8;
      drawers += `<rect x="${dx}" y="${dy}" width="${dw}" height="38" rx="3" fill="${C.wood2}" stroke="${C.wood1}" stroke-width="2"/>
        <rect x="${dx + dw / 2 - 16}" y="${dy + 15}" width="32" height="8" rx="4" fill="${C.gold2}"/><rect x="${dx + 8}" y="${dy + 6}" width="22" height="12" fill="${C.paper}" opacity=".5"/>`;
    }
  return `<g><rect x="${x}" y="${top}" width="${w}" height="220" fill="url(#g-wood-v)"/><rect x="${x - 10}" y="${top - 14}" width="${w + 20}" height="18" rx="3" fill="${C.wood3}"/>${drawers}
    <!-- half open drawer, papers spilling -->
    <g transform="translate(${x + w - 170} ${openY})"><rect x="-10" y="0" width="170" height="40" fill="${C.wood1}"/><path d="M-10 0l-20 30v20h190v-20l-20 -30z" fill="${C.wood2}"/>
      <path d="M0 4l40 -18l60 6l40 12z" fill="${C.paper}"/><path d="M20 4l30 -26l50 10z" fill="#e6d4a8"/></g>
    <!-- rolled scrolls on top -->
    ${[0, 1, 2, 3].map((i) => `<g transform="translate(${x + 40 + i * 52} ${top - 22}) rotate(${-8 + i * 5})"><rect x="-6" y="-6" width="56" height="18" rx="9" fill="${i % 2 ? '#efe0bb' : '#e6d4a8'}"/><circle cx="-2" cy="3" r="9" fill="#d6c294" stroke="#a88a5a"/><rect x="18" y="-6" width="5" height="18" fill="#8c2f39"/></g>`).join('')}
  </g>`;
}

/** Big standing globe. */
function globe(x: number, base: number) {
  const cy = base - 210;
  return `<g><path d="M${x - 60} ${base}h120l-20 -18h-80z" fill="${C.wood1}"/><rect x="${x - 8}" y="${cy + 100}" width="16" height="${base - cy - 110}" fill="${C.wood2}"/>
    <path d="M${x - 70} ${cy + 108}q70 30 140 0" stroke="${C.wood2}" stroke-width="10" fill="none"/>
    <g class="spin-slow"><circle cx="${x}" cy="${cy}" r="96" fill="#3b6f8c"/>
      <path d="M${x - 70} ${cy - 30}q30 -40 70 -10t40 40q-20 30 -60 10t-50 -40z" fill="#6aa255"/><path d="M${x + 20} ${cy + 30}q30 -10 50 20q-20 30 -40 20z" fill="#6aa255"/>
      <path d="M${x - 50} ${cy + 40}q20 -10 30 10q-10 20 -30 10z" fill="#c7a86a"/></g>
    <ellipse cx="${x}" cy="${cy}" rx="96" ry="30" fill="none" stroke="#fff" stroke-opacity=".15" stroke-width="2"/>
    <circle cx="${x}" cy="${cy}" r="110" fill="none" stroke="url(#g-gold)" stroke-width="8"/><circle cx="${x - 30}" cy="${cy - 40}" r="18" fill="#fff" opacity=".12"/></g>`;
}

/** Astrolabe on a little stand: rings within rings. */
function astrolabe(x: number, y: number) {
  return `<g transform="translate(${x} ${y})">${glow(0, 0, 120)}
    <circle r="70" fill="none" stroke="url(#g-gold)" stroke-width="8"/>
    <g class="spin-slow"><ellipse rx="70" ry="22" fill="none" stroke="${C.gold}" stroke-width="5"/><path d="M-70 0h140" stroke="${C.gold2}" stroke-width="3"/></g>
    <g class="spin-back" style="transform-origin:center"><ellipse rx="22" ry="70" fill="none" stroke="${C.gold2}" stroke-width="5"/></g>
    <circle r="10" fill="${C.gold}"/><path d="M0 70v40M-30 120h60" stroke="${C.wood2}" stroke-width="10"/></g>`;
}

/** A rack of rolled-up maps, seen from the end. */
function scrollRack(x: number, w: number) {
  const top = 620;
  let s = `<rect x="${x}" y="${top}" width="${w}" height="200" fill="${C.wood1}"/><rect x="${x - 8}" y="${top - 12}" width="${w + 16}" height="14" rx="3" fill="${C.wood3}"/>`;
  const r = rng(77);
  for (let row = 0; row < 3; row++)
    for (let c = 0; c < Math.floor(w / 56); c++) {
      const cx = x + 30 + c * 56, cy = top + 34 + row * 60;
      s += `<rect x="${cx - 26}" y="${cy - 26}" width="52" height="52" fill="#1a0f08"/>`;
      if (r() < 0.85) {
        const col = ['#efe0bb', '#e6d4a8', '#d6c294'][Math.floor(r() * 3)];
        s += `<circle cx="${cx}" cy="${cy}" r="${16 + r() * 6}" fill="${col}" stroke="#a88a5a" stroke-width="2"/><circle cx="${cx}" cy="${cy}" r="5" fill="none" stroke="#a88a5a" stroke-width="2"/>`;
        if (r() < 0.3) s += `<rect x="${cx - 20}" y="${cy - 3}" width="40" height="6" fill="#8c2f39" opacity=".8"/>`;
      }
    }
  return `<g>${s}</g>`;
}

/** The comma chandelier: punctuation floating in a ring of light. */
function commaChandelier(x: number, y: number) {
  const r = rng(31);
  let commas = '';
  for (let i = 0; i < 16; i++) {
    const a = (i / 16) * Math.PI * 2;
    const rx = 120, ry = 34;
    const px = x + Math.cos(a) * rx, py = y + Math.sin(a) * ry + (i % 2 ? 26 : 0);
    commas += `<g class="bob" style="animation-delay:${(-r() * 5).toFixed(1)}s">${glow(px, py - 10, 40, '', 'twinkle')}<text x="${px.toFixed(1)}" y="${py.toFixed(1)}" text-anchor="middle" font-family="Georgia" font-size="${46 + Math.round(r() * 20)}" fill="${C.gold}" transform="rotate(${(r() - 0.5) * 30} ${px.toFixed(1)} ${py.toFixed(1)})">,</text></g>`;
  }
  return `<g><line x1="${x}" y1="0" x2="${x}" y2="${y - 70}" stroke="#1a0f08" stroke-width="3"/>
    <ellipse cx="${x}" cy="${y - 60}" rx="24" ry="8" fill="${C.gold2}"/>
    ${[-1, 1].map((sd) => `<path d="M${x} ${y - 60}q${sd * 60} 10 ${sd * 120} 40" stroke="${C.gold2}" stroke-width="2" fill="none" stroke-dasharray="2 8" opacity=".6"/>`).join('')}
    ${glow(x, y, 200)}${commas}</g>`;
}

/** A tiny door with an enormous, bright hall behind it. */
function tinyDoor(x: number, base: number) {
  return `<g>${glow(x + 20, base - 30, 90)}
    <clipPath id="tdclip"><path d="M${x} ${base}v-44a20 20 0 0 1 40 0v44z"/></clipPath>
    <g clip-path="url(#tdclip)"><rect x="${x}" y="${base - 70}" width="40" height="70" fill="#fff3cf"/>
      ${[-3, -2, -1, 0, 1, 2, 3].map((i) => `<line x1="${x + 20}" y1="${base - 30}" x2="${x + 20 + i * 18}" y2="${base}" stroke="#d6b77a" stroke-width="1"/>`).join('')}
      ${[0, 1, 2, 3].map((i) => `<rect x="${x + 6 + i * 2}" y="${base - 46 + i * 3}" width="${2 - i * 0.3}" height="${18 + i * 6}" fill="#c9a86a"/><rect x="${x + 32 - i * 2}" y="${base - 46 + i * 3}" width="${2 - i * 0.3}" height="${18 + i * 6}" fill="#c9a86a"/>`).join('')}
      <circle cx="${x + 20}" cy="${base - 36}" r="3" fill="${C.gold}"/><rect x="${x + 16}" y="${base - 30}" width="8" height="4" fill="#8c2f39" opacity=".6"/></g>
    <path d="M${x} ${base}v-44a20 20 0 0 1 40 0v44" fill="none" stroke="${C.wood3}" stroke-width="5"/>
    <path d="M${x + 40} ${base}l14 -6v-40l-14 -8z" fill="#2f6b4f" stroke="${C.wood1}" stroke-width="2"/><circle cx="${x + 50}" cy="${base - 24}" r="2" fill="${C.gold}"/>
    <rect x="${x - 6}" y="${base - 2}" width="70" height="4" fill="${C.wood1}"/></g>`;
}

/** The torn map on a map table (puzzle spot). */
function mapTable(x: number) {
  const pieces = [[-110, -18, -8], [-40, -26, 6], [30, -16, -4], [96, -24, 10], [-70, 4, 3]];
  return `${table(x - 160, 690, 320)}<g transform="translate(${x} 690)">
    ${pieces.map(([dx, dy, a]) => `<g transform="translate(${dx} ${dy}) rotate(${a})"><path d="M-34 -14l8 -6l14 4l12 -5l18 3l16 8l-6 10l4 8h-60l-8 -10z" fill="#ecdcae" stroke="#a88a5a" stroke-width="2"/>
      <path d="M-24 -6q10 -4 20 2t20 0" stroke="#7fb6c8" stroke-width="3" fill="none"/><path d="M-10 4l6 -10l6 10z" fill="#5f8f4e"/></g>`).join('')}
    <g transform="translate(130 -30)"><circle r="16" fill="none" stroke="${C.gold2}" stroke-width="4"/><path d="M10 10l18 18" stroke="${C.wood2}" stroke-width="6" stroke-linecap="round"/></g>
    <g transform="translate(-150 -14) rotate(-20)"><rect x="0" y="-4" width="40" height="8" fill="${C.wood3}"/><path d="M40 -4l12 4l-12 4z" fill="#2a1a10"/></g></g>`;
}

const far = `${wall(W, '#24301f', '#3a2a18', 3)}
  ${[180, 1400, 2300, 3200].map((x) => archWindow(x, 60, 150, 400, '#1f3a5a')).join('')}
  <g opacity=".55">${[-500, 380, 1000, 1700, 2500, 3100].map((x, i) => bookcase(x, 120, 520, 600, 500 + i, { rows: 5 })).join('')}</g>
  <rect x="-800" y="0" width="${W + 1600}" height="1000" fill="#120d06" opacity=".45"/>
  ${[180, 1400, 2300, 3200].map((x) => ray(x, 80, 150, x - 140, 900, 400)).join('')}`;

const main = `
  ${floor(W)}
  ${rug(700, 890, 600, '#3e5a2a')}${rug(1800, 885, 800, '#6a3a1a')}${rug(3000, 895, 640, '#2f4f6a')}
  ${bookcase(60, 150, 520, 650, 41, { rows: 5, trinkets: 0.07 })}
  ${roundDoor(320, 680)}
  ${ivy(40, 600, 130, 1)}
  ${breakfastTable(580, 700)}
  ${pillar(900)}
  ${livingMap(1010, 110)}
  ${mapCabinet(1000, 480, 735)}
  ${globe(1580, 820)}
  ${mapTable(1840)}
  ${commaChandelier(1840, 190)}
  ${pillar(2010)}
  ${bookcase(2110, 150, 380, 650, 42, { rows: 5, trinkets: 0.09 })}
  ${tinyDoor(2530, 820)}
  ${landMap(2650, 130)}
  ${astrolabe(2560, 520)}
  ${scrollRack(2650, 470)}
  ${pillar(3140)}
  ${bookcase(3240, 150, 330, 650, 43, { rows: 5, trinkets: 0.08 })}
  ${ivy(2090, 2510, 118, 2)}${ivy(3220, 3600, 118, 5)}
  ${[700, 1560, 2580, 3400].map((x, i) => lantern(x, 90 + (i % 2) * 50)).join('')}
  ${bookStack(1460, 820, 4, 21)}
`;

const over = `
  ${bookStack(2290, 822, 3, 22)}
  <g transform="translate(3520 830)">${[-40, -10, 25, 55].map((a, i) => `<path class="sway" style="animation-delay:${-i}s" d="M0 0q${-30 + i * 20} -80 ${Math.sin((a * Math.PI) / 180) * 120} -150q-14 70 0 150" fill="${i % 2 ? '#4f7f42' : '#6aa255'}"/>`).join('')}</g>
  <g transform="translate(660 693)"><path d="M-14 0q-4 -22 14 -26q18 4 14 26z" fill="#e6d4a8" stroke="#c9b48a"/><path d="M-8 -26q8 -10 16 0" stroke="#c9b48a" stroke-width="2" fill="none"/></g>
`;

const fore = `
  <g fill="#0a0618" opacity=".85" filter="url(#f-blur)">
    <path d="M-200 1000q60 -220 200 -260q-40 120 30 260z"/><path d="M-120 1000q120 -160 260 -170q-80 80 -60 170z"/>
    <path d="M2000 1000q30 -200 160 -240q-30 120 20 240z"/><path d="M2080 1000q90 -120 220 -140q-60 60 -40 140z"/>
    <path d="M4200 1000q60 -220 200 -260q-40 120 30 260z"/>
  </g>`;

/** Okapi drawn in sepia ink, grazing on the wall map. */
const INK_OKAPI = `<g opacity=".9"><path d="M-30 -2q-4 -14 10 -16h34q12 0 14 12l-2 22h-56z" fill="#7a5232"/>
  <path d="M18 -12q8 6 18 26q6 4 10 0l2 -6q-8 -8 -14 -20l-4 -6z" fill="#7a5232"/>
  <path d="M36 14l-2 -8M42 12l4 -8" stroke="#5a3a22" stroke-width="3"/>
  <path d="M40 16q4 6 10 6" stroke="#5a3a22" stroke-width="2" fill="none"/>
  ${[-26, -8, 6, 22].map((x) => `<g transform="translate(${x} 16)"><rect x="-3" y="0" width="6" height="26" fill="#efe0bb" stroke="#5a3a22" stroke-width="1.5"/>${[4, 10, 16].map((y) => `<rect x="-3" y="${y}" width="6" height="3" fill="#5a3a22"/>`).join('')}</g>`).join('')}
  <path d="M-30 0q-8 6 -6 14" stroke="#5a3a22" stroke-width="2.5" fill="none"/><path d="M44 30q8 -6 16 0" stroke="#5f8f4e" stroke-width="3" fill="none"/></g>`;

export const KARTEN: SceneDef = {
  id: 'karten',
  title: 'Der Kartensaal',
  width: W,
  far, main, over, fore,
  ambience: 'maps',
  seal: 'blatt',
  emitters: [
    { kind: 'motes', x: 0, y: 100, w: W, h: 700 },
    { kind: 'letters', x: 1700, y: 600, w: 280, h: 30 },
  ],
  wanderers: [
    { id: 'ring', name: 'der Ring', at: { x: 2262, y: 800 }, home: { x: 160, y: 296 }, scale: 0.4, homeColor: '#c7883a', line: 'Der Ring ist wieder in seiner Geschichte – hin und zurück, wie es sich gehört.' },
    { id: 'gruenetuer', name: 'die runde grüne Tür', at: { x: 3420, y: 560 }, home: { x: 470, y: 296 }, scale: 0.42, homeColor: '#3e7a4f', line: 'Die kleine runde Tür ist wieder zu Hause. Dahinter riecht es nach Tee und Kuchen.' },
    { id: 'blattbrosche', name: 'die Blattbrosche', at: { x: 1090, y: 588 }, home: { x: 3420, y: 427 }, scale: 0.4, rot: -20, homeColor: '#2f5d62', line: 'Die Blattbrosche glänzt wieder an ihrem Platz. Sie hält einen ganz besonderen Umhang zusammen.' },
    { id: 'fruehstueck', name: 'das zweite Frühstück', at: { x: 760, y: 682 }, home: { x: 2420, y: 553 }, scale: 0.42, homeColor: '#b5543c', line: 'Das zweite Frühstück ist zurück. Gleich nach dem ersten und kurz vor dem Elfuhrtee.' },
    { id: 'wanderstab', name: 'der Wanderstab', at: { x: 1700, y: 760 }, home: { x: 3280, y: 296 }, scale: 0.5, rot: 12, homeColor: '#5b6c8f', line: 'Der Wanderstab lehnt wieder in seiner Geschichte. Er hat schon viele Wege gesehen.' },
    { id: 'kettenhemd', name: 'das Silberhemd', at: { x: 2960, y: 614 }, home: { x: 120, y: 427 }, scale: 0.38, rot: -12, homeColor: '#6b4f9e', line: 'Das Silberhemd ist wieder im Buch. Leicht wie eine Feder und fester als Stahl.' },
  ],
  secrets: [
    { id: 'okapi', kind: 'okapi', at: { x: 2770, y: 444 }, r: 46, scale: 0.42, art: INK_OKAPI, title: 'Ein Okapi auf der Landkarte', text: 'Jemand hat ein Okapi auf die Karte gezeichnet. Es grast auf der sehr ruhigen Wiese. Laut Legende gibt es dort gar keins.', teaser: 'Auf einer der Wandkarten im Kartensaal grast etwas, das dort eigentlich nicht hingehört.' },
    { id: 'brief', kind: 'brief', at: { x: 1400, y: 725 }, r: 40, scale: 0.4, title: 'Kann man denselben Weg zweimal gehen?', text: 'Der Umschlag steckte zwischen alten Karten. Kein Absender. Nur die Frage – und das Gefühl, dass sie schwerer ist, als sie aussieht.', teaser: 'Im Kartensaal steht eine Schublade offen. Was liegt zwischen den Karten?' },
    { id: 'lebendekarte', kind: 'oddity', at: { x: 1260, y: 330 }, r: 150, title: 'Eine Karte, die dich kennt', text: 'Die große Karte zeigt diesen Raum. Und den kleinen roten Punkt da – das bist du. Er wandert mit.', teaser: 'Hast du im Kartensaal schon nachgesehen, wo du gerade bist?' },
    { id: 'kleinetuer', kind: 'oddity', at: { x: 2550, y: 790 }, r: 50, title: 'Eine winzige Tür', text: 'Die Tür ist kaum größer als deine Hand. Dahinter liegt ein Saal, so groß, dass man das Ende nicht sieht.', teaser: 'Im Kartensaal gibt es eine Tür, die viel zu klein ist für das, was dahinter liegt.' },
    { id: 'kommaleuchter', kind: 'oddity', at: { x: 1840, y: 200 }, r: 120, title: 'Ein Leuchter aus Kommas', text: 'Lauter goldene Kommas schweben im Kreis und leuchten. Hier oben macht die Geschichte eine kleine Pause, bevor sie weitergeht.', teaser: 'Schau im Kartensaal mal nach oben. Dort schwebt etwas, das sonst in Sätzen wohnt.' },
  ],
  puzzle: {
    kind: 'tiles', at: { x: 1840, y: 650 }, art: '',
    title: 'Die zerrissene Karte',
    intro: 'Die große Reisekarte ist in Stücke gerissen. Tippe zwei Kartenstücke an, um sie zu tauschen – so lange, bis die Karte wieder ganz ist.',
    teaser: 'Die zerrissene Karte ganz ohne Laterne zusammensetzen.',
  },
  intro: {
    title: 'Der Kartensaal',
    text: [
      'Es riecht nach altem Papier, Tee und ein bisschen nach Abenteuer. An den Wänden hängen Karten von Ländern, die es nur in Büchern gibt.',
      'Hier sind <b>sechs Dinge</b> von einer sehr langen Reise ausgebüxt. Begleite sie nach Hause – hin und zurück.',
    ],
  },
  note: {
    title: 'Ein Zettel von Oda',
    text: [
      'Die Karte ist wieder ganz! Jetzt finden auch die Reisenden in den Büchern ihren Weg.',
      'Mein drittes Zeichen ist das <b>Blatt</b>. Ein Blatt zeigt den Weg – es gehört an die <b>dritte</b> Stelle.',
      'Ich bin jetzt ganz nah. Hörst du das Rascheln? Das bin ich. Oder ein Wald.',
    ],
  },
};
