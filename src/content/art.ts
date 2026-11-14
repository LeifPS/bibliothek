/** Hand-drawn SVG icons, each centred on (0,0) and roughly 90 units across. */
import { C } from '../engine/svg';

/** Seal symbols, used on pages, in notes, on the map. */
export const SEALS: Record<string, string> = {
  feder: `<path d="M18 -30q-34 6 -36 46l6 2q4 -28 30 -48z" fill="${C.cream}" stroke="${C.gold2}" stroke-width="2"/><path d="M-16 22l26 -44" stroke="${C.gold2}" stroke-width="2"/>`,
  schluessel: `<circle cx="0" cy="-16" r="10" fill="none" stroke="${C.gold}" stroke-width="5"/><rect x="-3" y="-6" width="6" height="34" fill="${C.gold}"/><rect x="3" y="16" width="10" height="5" fill="${C.gold}"/><rect x="3" y="24" width="7" height="4" fill="${C.gold}"/>`,
  blatt: `<path d="M0 -30q26 14 0 60q-26 -46 0 -60z" fill="#6aa255" stroke="${C.gold}" stroke-width="2"/><path d="M0 -26v54" stroke="${C.gold}" stroke-width="1.5"/>`,
  stern: `<path d="M0 -30l8 20l22 2l-17 14l6 22l-19 -12l-19 12l6 -22l-17 -14l22 -2z" fill="url(#g-gold)" stroke="${C.gold2}" stroke-width="1.5"/>`,
};

export const ART: Record<string, string> = {
  // ---------- Lesesaal ----------
  teetasse: `<path d="M-30 -14h52q2 34 -26 36q-28 -2 -26 -36z" fill="#f4f1ff" stroke="#8a6fd1" stroke-width="3"/>
    <path d="M22 -6q18 -2 16 12q-2 12 -18 10" fill="none" stroke="#8a6fd1" stroke-width="5"/>
    <ellipse cx="-4" cy="-14" rx="26" ry="5" fill="#b07a4a"/><path d="M-22 4q18 6 36 0" stroke="#e58aa0" stroke-width="4" fill="none"/>
    <ellipse cx="-4" cy="24" rx="40" ry="7" fill="#f4f1ff" stroke="#8a6fd1" stroke-width="3"/>
    <path d="M-10 -24q-6 -10 2 -18M2 -24q-6 -10 2 -18" stroke="#fff" stroke-opacity=".6" stroke-width="3" fill="none"/>`,
  taschenuhr: `<path d="M0 -42v-8" stroke="${C.gold2}" stroke-width="5"/><circle cx="0" cy="-52" r="6" fill="none" stroke="${C.gold2}" stroke-width="4"/>
    <circle r="34" fill="url(#g-gold)" stroke="${C.gold2}" stroke-width="3"/><circle r="27" fill="#fffbea"/>
    <g stroke="#2a1a10" stroke-width="2">${Array.from({ length: 12 }, (_, i) => `<line x1="0" y1="-23" x2="0" y2="-19" transform="rotate(${i * 30})"/>`).join('')}</g>
    <line x1="0" y1="0" x2="0" y2="-17" stroke="#2a1a10" stroke-width="3" class="tick-hand"/><line x1="0" y1="0" x2="11" y2="5" stroke="#2a1a10" stroke-width="3"/><circle r="3" fill="#2a1a10"/>`,
  rose: `<ellipse cx="0" cy="36" rx="30" ry="7" fill="${C.wood2}"/><path d="M-24 34v-44a24 24 0 0 1 48 0v44" fill="url(#g-glass)" stroke="#d8f6ff" stroke-opacity=".6" stroke-width="2"/>
    <path d="M0 32v-30" stroke="#3e7a4f" stroke-width="3"/><path d="M0 14q-12 -2 -12 -10q10 0 12 10M0 20q12 -4 10 -12q-10 2 -10 12" fill="#5f8f4e"/>
    <circle cx="0" cy="-8" r="11" fill="#d23c55"/><path d="M-6 -10q6 -8 12 0q-6 6 -12 0z" fill="#ff7a8e"/><path d="M-12 -24l4 4M14 -20l-4 2" stroke="#fff" stroke-width="2" opacity=".7"/>`,
  kompass: `<circle r="34" fill="${C.wood2}" stroke="${C.gold}" stroke-width="4"/><circle r="27" fill="#f6ecd2"/>
    <path d="M0 -24l7 24l-7 24l-7 -24z" fill="#c43c3c"/><path d="M0 0l7 0l-7 24l-7 -24z" fill="#355c8c"/><circle r="4" fill="${C.gold}"/>
    <text y="-13" text-anchor="middle" font-size="9" font-family="Georgia" fill="#3b2414">N</text>`,
  papierschiff: `<path d="M-40 6h80l-14 22h-52z" fill="#f6f1e2" stroke="#9aa6b8" stroke-width="2"/><path d="M-16 6l16 -40l16 40z" fill="#fffdf4" stroke="#9aa6b8" stroke-width="2"/>
    <path d="M-30 14h60" stroke="#c9d1dd" stroke-width="2"/><path d="M-6 -8h10M-8 -2h16" stroke="#6b7a90" stroke-width="1.5"/><path d="M-46 30q12 -6 24 0t24 0t24 0t24 0" stroke="#7fc8e8" stroke-width="3" fill="none"/>`,
  glasschuh: `<path d="M-38 18q-2 -20 14 -24q20 -4 30 -22q6 -8 14 -2q6 8 4 28l4 22h-10l-4 -14q-20 2 -30 14z" fill="url(#g-glass)" stroke="#bff2ff" stroke-width="2.5"/>
    <path d="M18 -26q4 4 2 14" stroke="#fff" stroke-width="2" opacity=".8"/><circle cx="-14" cy="-2" r="2" fill="#fff"/><circle cx="20" cy="-30" r="3" fill="#fff" class="twinkle"/>`,

  // ---------- Zauberflügel ----------
  eule: `<ellipse cx="0" cy="8" rx="26" ry="32" fill="#8a6a4a"/><ellipse cx="0" cy="16" rx="16" ry="20" fill="#d9c09a"/>
    <path d="M-26 -10l-6 -20l16 10zM26 -10l6 -20l-16 10z" fill="#6e5236"/><circle cx="-11" cy="-8" r="10" fill="#fff6dc"/><circle cx="11" cy="-8" r="10" fill="#fff6dc"/>
    <circle cx="-11" cy="-8" r="5" fill="#1d1630" class="blink"/><circle cx="11" cy="-8" r="5" fill="#1d1630" class="blink"/><path d="M-4 0l4 8l4 -8z" fill="#e0a43a"/>
    <path d="M-26 8q-14 16 -4 30M26 8q14 16 4 30" stroke="#6e5236" stroke-width="7" fill="none"/>
    <g transform="translate(6 34) rotate(-8)"><rect x="-16" y="-9" width="32" height="20" fill="${C.paper}" stroke="#a88a5a"/><path d="M-16 -9l16 12l16 -12" stroke="#a88a5a" fill="none"/><circle cy="3" r="4" fill="#b5243c"/></g>`,
  brille: `<circle cx="-20" cy="0" r="16" fill="url(#g-glass)" stroke="#2a1a10" stroke-width="4"/><circle cx="20" cy="0" r="16" fill="url(#g-glass)" stroke="#2a1a10" stroke-width="4"/>
    <path d="M-4 -2q4 -6 8 0" stroke="#2a1a10" stroke-width="4" fill="none"/><path d="M-36 -2l-10 -6M36 -2l10 -6" stroke="#2a1a10" stroke-width="4"/><path d="M-26 -6l6 -4M14 -6l6 -4" stroke="#fff" stroke-width="2" opacity=".8"/>`,
  besen: `<g transform="rotate(-30)"><rect x="-4" y="-48" width="8" height="64" rx="3" fill="${C.wood3}"/><path d="M-6 14h12l14 34h-40z" fill="#d6a95a"/>
    <path d="M-10 22l-6 26M0 22v26M10 22l6 26" stroke="#a87a32" stroke-width="2"/><rect x="-8" y="12" width="16" height="6" fill="#8c2f39"/></g>`,
  blitz: `<rect x="-14" y="-44" width="28" height="88" rx="3" fill="#8c2f39"/><path d="M-14 44l14 -12l14 12" fill="#8c2f39"/>
    <path d="M4 -30l-14 26h10l-8 24l18 -30h-10l8 -20z" fill="url(#g-gold)" stroke="${C.gold2}"/>`,
  schluessel: `<g class="flutter"><path d="M-8 -12q-30 -26 -36 -4q12 0 36 10z" fill="#e8f4ff" opacity=".85"/><path d="M8 -12q30 -26 36 -4q-12 0 -36 10z" fill="#e8f4ff" opacity=".85"/></g>
    <circle cx="0" cy="-12" r="12" fill="none" stroke="url(#g-gold)" stroke-width="6"/><rect x="-3" y="-2" width="6" height="40" fill="${C.gold}"/>
    <rect x="3" y="22" width="12" height="5" fill="${C.gold}"/><rect x="3" y="31" width="9" height="5" fill="${C.gold}"/>`,
  zauberstab: `<g transform="rotate(35)"><rect x="-4" y="-46" width="8" height="84" rx="4" fill="#3b2414"/><rect x="-5" y="18" width="10" height="20" rx="3" fill="#6e4526"/>
    <circle cy="-46" r="4" fill="#fff" class="twinkle"/></g><path d="M-26 -36l3 7l7 3l-7 3l-3 7l-3 -7l-7 -3l7 -3z" fill="${C.gold}" class="twinkle"/>`,
  schal: `<path d="M-30 -30q30 14 60 0l-6 14q-24 10 -48 0z" fill="#9b1f2e"/><path d="M-30 -30l-4 74h18l6 -60z" fill="#9b1f2e"/>
    ${[-20, -6, 8, 22, 36].map((y) => `<rect x="-34" y="${y}" width="20" height="6" fill="${C.gold}" transform="skewX(-3)"/>`).join('')}
    <path d="M-34 44v8M-28 44v8M-22 44v8M-16 44v8" stroke="${C.gold}" stroke-width="3"/>`,

  // ---------- Kartensaal ----------
  ring: `<ellipse cx="0" cy="6" rx="30" ry="26" fill="none" stroke="url(#g-gold)" stroke-width="10"/><ellipse cx="0" cy="6" rx="30" ry="26" fill="none" stroke="#fff6c8" stroke-width="2" opacity=".7"/>
    <path d="M-20 -6q10 -8 20 -6" stroke="#fff" stroke-width="3" opacity=".8" fill="none"/>`,
  gruenetuer: `<path d="M0 -40a40 40 0 0 1 40 40v32h-80v-32a40 40 0 0 1 40 -40z" fill="#3f6d3a"/><circle r="36" cy="0" fill="#2f8a4a"/>
    <circle r="36" cy="0" fill="none" stroke="#1e5a30" stroke-width="3"/>${[0, 45, 90, 135].map((a) => `<line x1="0" y1="0" x2="${Math.cos((a * Math.PI) / 180) * 36}" y2="${Math.sin((a * Math.PI) / 180) * 36}" stroke="#1e5a30" stroke-width="1.5"/>`).join('')}
    <circle r="7" fill="url(#g-gold)"/><rect x="-46" y="30" width="92" height="8" fill="${C.wood2}"/>`,
  blattbrosche: `<path d="M0 -40q32 18 0 80q-32 -62 0 -80z" fill="#5fae6a" stroke="url(#g-gold)" stroke-width="4"/><path d="M0 -36v74" stroke="${C.gold}" stroke-width="2"/>
    ${[-20, -6, 8, 22].map((y) => `<path d="M0 ${y}l12 -10M0 ${y}l-12 -10" stroke="${C.gold}" stroke-width="1.5"/>`).join('')}<circle cy="-40" r="5" fill="url(#g-gold)"/>`,
  fruehstueck: `<ellipse cx="0" cy="14" rx="44" ry="14" fill="#f6f1e2" stroke="#c9b48a" stroke-width="2"/><ellipse cx="-12" cy="6" rx="12" ry="8" fill="#fff"/><circle cx="-12" cy="6" r="5" fill="#f2b72a"/>
    <path d="M6 10q4 -16 22 -10q4 10 -6 14z" fill="#c7883a"/><path d="M8 0q6 -4 12 0" stroke="#8a5a2a" stroke-width="2" fill="none"/><circle cx="-30" cy="12" r="6" fill="#d23c55"/><circle cx="-26" cy="18" r="5" fill="#d23c55"/>
    <path d="M-8 -14q-4 -10 2 -16M2 -14q-4 -10 2 -16" stroke="#fff" stroke-opacity=".6" stroke-width="3" fill="none"/>`,
  wanderstab: `<path d="M-10 46q4 -44 6 -78q0 -12 10 -14q14 -2 12 14q-2 8 -10 6" fill="none" stroke="${C.wood3}" stroke-width="8" stroke-linecap="round"/>
    <circle cx="8" cy="-34" r="5" fill="#bdf2ff" class="twinkle"/><path d="M-8 -6l12 -4" stroke="#5fae6a" stroke-width="4"/>`,
  kettenhemd: `<path d="M-20 -36l-22 14l8 16l10 -6v52h48v-52l10 6l8 -16l-22 -14q-20 12 -40 0z" fill="#cfd8e6" stroke="#8a9ab0" stroke-width="2"/>
    ${Array.from({ length: 30 }, (_, i) => `<circle cx="${-18 + (i % 6) * 7}" cy="${-14 + Math.floor(i / 6) * 9}" r="2.4" fill="none" stroke="#8a9ab0"/>`).join('')}
    <path d="M-10 -30l6 6" stroke="#fff" stroke-width="3" opacity=".8"/>`,

  // ---------- Katzenwald ----------
  kaetzchen: `<path d="M-26 30q-4 -30 14 -40q20 -6 32 8q10 14 4 32z" fill="#c9a27a"/><circle cx="0" cy="-18" r="18" fill="#c9a27a"/>
    <path d="M-16 -28l-4 -18l14 10zM16 -28l4 -18l-14 10z" fill="#c9a27a"/><path d="M-14 -30l-2 -10l7 6zM14 -30l2 -10l-7 6z" fill="#e8a0a8"/>
    <ellipse cx="-7" cy="-20" rx="3" ry="4" fill="#1d1630" class="blink"/><ellipse cx="7" cy="-20" rx="3" ry="4" fill="#1d1630" class="blink"/><path d="M-3 -12l3 3l3 -3" stroke="#6e4526" stroke-width="2" fill="none"/>
    <path d="M24 26q22 -4 16 -26" stroke="#c9a27a" stroke-width="8" fill="none" stroke-linecap="round" class="tail"/><path d="M-18 4q6 -4 10 0M6 4q6 -4 10 0" stroke="#a37f58" stroke-width="3" fill="none"/>`,
  mondstein: `<path d="M-30 30l8 -48l22 -18l24 14l8 52z" fill="#dfe9ff" stroke="#a9bce8" stroke-width="2"/><path d="M-22 -18l22 6l24 -10M0 -12l2 42" stroke="#a9bce8" stroke-width="2" fill="none"/>
    <path d="M-6 -8q-10 10 0 20q-14 0 -14 -10q0 -10 14 -10z" fill="#fff" opacity=".9" class="twinkle"/>`,
  kraeuter: `<path d="M0 40v-44" stroke="#5f8f4e" stroke-width="4"/><path d="M0 6q-30 -10 -26 -34q20 6 26 34M0 6q30 -10 26 -34q-20 6 -26 34M0 -4q-6 -30 0 -42q6 12 0 42" fill="#6aa255"/>
    <circle cx="-18" cy="-24" r="4" fill="#d9a7ff"/><circle cx="18" cy="-24" r="4" fill="#d9a7ff"/><circle cx="0" cy="-42" r="4" fill="#ffe08a"/><rect x="-8" y="14" width="16" height="8" fill="#b5543c"/>`,
  moos: `<ellipse cx="0" cy="14" rx="44" ry="22" fill="#4f7f42"/><ellipse cx="0" cy="8" rx="38" ry="16" fill="#6aa255"/>
    ${Array.from({ length: 14 }, (_, i) => `<circle cx="${-30 + i * 4.6}" cy="${4 + Math.sin(i) * 5}" r="${3 + (i % 3)}" fill="#8cc46e"/>`).join('')}<path d="M-20 -2l6 -12M14 -4l4 -10" stroke="#c7e6a6" stroke-width="2"/>`,
  wolle: `<circle r="32" fill="#e58aa0"/><path d="M-30 -8q30 -20 58 4M-28 10q30 -24 54 -8M-18 26q20 -36 44 -12M-24 -20q10 20 40 30" stroke="#c96a82" stroke-width="3" fill="none"/>
    <path d="M28 18q20 10 14 30q-6 12 -20 8" stroke="#e58aa0" stroke-width="4" fill="none"/>`,
  gluehglas: `<rect x="-24" y="-30" width="48" height="66" rx="12" fill="url(#g-glass)" stroke="#d8f6ff" stroke-opacity=".6" stroke-width="2"/><rect x="-18" y="-40" width="36" height="12" rx="3" fill="${C.wood2}"/>
    <circle cx="-8" cy="0" r="5" fill="#eaff8a" class="twinkle"/><circle cx="8" cy="14" r="4" fill="#eaff8a" class="twinkle" style="animation-delay:-1s"/><circle cx="4" cy="-14" r="4" fill="#eaff8a" class="twinkle" style="animation-delay:-2s"/>
    <circle cx="0" cy="4" r="22" fill="#eaff8a" opacity=".15"/>`,

  // ---------- Herz: pages with seals ----------
  seite_feder: page('feder'),
  seite_schluessel: page('schluessel'),
  seite_blatt: page('blatt'),
  seite_stern: page('stern'),

  // ---------- Secrets ----------
  okapi: `<g transform="scale(.9)"><path d="M-30 -2q-4 -14 10 -16h34q12 0 14 12l-2 22h-56z" fill="#5a2e22"/>
    <path d="M18 -12q4 -26 10 -40q8 -6 16 0l4 10q-4 8 -12 6l-6 26z" fill="#5a2e22"/><path d="M28 -54l-2 -10M36 -54l4 -10" stroke="#3a1c14" stroke-width="4"/>
    <circle cx="38" cy="-46" r="2.5" fill="#fff"/><circle cx="38.6" cy="-46" r="1.3" fill="#1d1630"/><path d="M44 -40q6 2 4 6" stroke="#f0e3cf" stroke-width="5" fill="none"/>
    ${[-28, -6, 8, 26].map((x) => `<g transform="translate(${x} 16)"><rect x="-3" y="0" width="7" height="30" fill="#f0e3cf"/>${[4, 10, 16, 22].map((y) => `<rect x="-3" y="${y}" width="7" height="3" fill="#3a1c14"/>`).join('')}</g>`).join('')}
    ${[-28, -20, -12].map((x) => `<path d="M${x} -2v16" stroke="#f0e3cf" stroke-width="3"/>`).join('')}<path d="M-32 0q-8 6 -6 14" stroke="#3a1c14" stroke-width="3" fill="none"/></g>`,
  brief: `<g transform="rotate(-8)"><rect x="-30" y="-20" width="60" height="40" rx="3" fill="#fbf3dc" stroke="#c9b48a" stroke-width="2"/><path d="M-30 -20l30 22l30 -22" fill="none" stroke="#c9b48a" stroke-width="2"/>
    <circle cx="0" cy="2" r="7" fill="#6b4f9e"/><path d="M-3 2h6M0 -1v6" stroke="#d9c8ff" stroke-width="1.5"/><text x="-22" y="16" font-size="9" font-family="Georgia" font-style="italic" fill="#8a7a5a">?</text></g>`,
};

function page(seal: string) {
  return `<g transform="rotate(${seal.length % 2 ? -6 : 6})"><path d="M-30 -40h50l10 10v70h-60z" fill="#fbf3dc" stroke="#c9b48a" stroke-width="2"/><path d="M20 -40v10h10" fill="#efe0bb" stroke="#c9b48a" stroke-width="2"/>
    ${[-24, -16, 22, 30].map((y) => `<path d="M-22 ${y}h${30 + (y % 3) * 4}" stroke="#a89a7a" stroke-width="2"/>`).join('')}
    <g transform="translate(0 4) scale(.55)">${SEALS[seal]}</g></g>`;
}
