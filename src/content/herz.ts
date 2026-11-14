import type { SceneDef } from './types';
import { wall, floor, rug, bookcase, ray, pillar, lamp, plant, bookStack, garland, glow, starfield, C } from '../engine/svg';

const W = 2800;
const CX = 1400;

function dome() {
  let ribs = '';
  for (let i = -6; i <= 6; i++) ribs += `<path d="M${CX} -200Q${CX + i * 160} 60 ${CX + i * 260} 560" stroke="#3b2c66" stroke-width="10" fill="none" opacity=".7"/>`;
  return `<path d="M${CX - 1700} 600Q${CX - 1700} -500 ${CX} -520Q${CX + 1700} -500 ${CX + 1700} 600z" fill="#1a1450"/>
    ${starfield(CX - 1500, -100, 3000, 560, 220, 21)}${ribs}
    <circle cx="${CX}" cy="-60" r="150" fill="#fff3cf" opacity=".9"/><circle cx="${CX}" cy="-60" r="300" fill="url(#g-glow)"/>`;
}

function clock(x: number, y: number) {
  const nums = ['XII', 'XI', 'X', 'IX', 'VIII', 'VII', 'VI', 'V', 'IV', 'III', 'II', 'I']; // counted backwards
  return `<g transform="translate(${x} ${y})">${glow(0, 0, 200)}
    <circle r="120" fill="#f6ecd2" stroke="${C.gold2}" stroke-width="14"/><circle r="104" fill="none" stroke="#c9b48a" stroke-width="2"/>
    ${nums.map((n, i) => { const a = (i / 12) * Math.PI * 2 - Math.PI / 2; return `<text x="${(Math.cos(a) * 82).toFixed(1)}" y="${(Math.sin(a) * 82 + 8).toFixed(1)}" text-anchor="middle" font-family="Georgia" font-size="20" fill="#4a2c18">${n}</text>`; }).join('')}
    <g class="spin-back" style="transform-origin:0 0;transform-box:view-box"><rect x="-4" y="-80" width="8" height="84" rx="4" fill="#2a1a10"/></g>
    <g style="transform-origin:0 0;transform-box:view-box;animation:spin 120s linear infinite reverse"><rect x="-5" y="-54" width="10" height="58" rx="5" fill="#2a1a10"/></g>
    <circle r="9" fill="${C.gold}"/><path d="M-30 120v80M30 120v80" stroke="${C.gold2}" stroke-width="6"/>
    <g class="sway" style="transform-origin:0 120px;transform-box:view-box"><path d="M0 120v130" stroke="${C.gold2}" stroke-width="4"/><circle cy="260" r="24" fill="url(#g-gold)"/></g></g>`;
}

function bigBook(x: number, base: number) {
  return `<g>
    ${glow(x, base - 200, 420)}
    <path d="M${x - 120} ${base}h240l-40 -160h-160z" fill="${C.wood2}"/><path d="M${x - 140} ${base}h280v16h-280z" fill="${C.wood1}"/>
    <ellipse cx="${x}" cy="${base - 160}" rx="160" ry="20" fill="${C.wood3}"/>
    <g transform="translate(${x} ${base - 190})">
      <path d="M-300 30q150 -80 300 -20q150 -60 300 20l-20 40q-140 -50 -280 10q-140 -60 -280 -10z" fill="#5a1f33"/>
      <path d="M-280 10q140 -80 280 -24q140 -56 280 24l-10 30q-130 -60 -270 0q-140 -60 -270 0z" fill="#fbf3dc" stroke="#c9b48a" stroke-width="3"/>
      ${[0, 1, 2, 3, 4].map((i) => `<path d="M${-250 + i * 6} ${-2 + i * 7}q120 -60 230 -18" stroke="#b8a98a" stroke-width="2" fill="none"/><path d="M${20 - i * 2} ${-16 + i * 7}q120 -42 230 18" stroke="#b8a98a" stroke-width="2" fill="none"/>`).join('')}
      <path d="M0 -40v60" stroke="#c9b48a" stroke-width="3"/>
      <text y="-80" text-anchor="middle" font-family="Georgia" font-style="italic" font-size="34" fill="${C.gold}" opacity=".85">… und dann?</text>
    </g></g>`;
}

function mirror(x: number, y: number) {
  return `<g transform="translate(${x} ${y})"><ellipse rx="110" ry="160" fill="${C.gold2}"/><ellipse rx="96" ry="146" fill="#2a3a6a"/>
    <ellipse rx="96" ry="146" fill="url(#g-glass)" opacity=".6"/><path d="M-60 -100q30 -30 60 -20" stroke="#fff" stroke-width="6" opacity=".5" fill="none"/>
    <rect x="-20" y="160" width="40" height="${820 - y - 160}" fill="${C.wood1}"/></g>`;
}

function upsideBook(x: number, y: number) {
  return `<g transform="translate(${x} ${y}) rotate(180)"><g class="breathe">
    <rect x="-40" y="-56" width="80" height="110" rx="6" fill="#2f5d62" stroke="${C.gold}" stroke-width="4"/><rect x="-40" y="-56" width="12" height="110" fill="#000" opacity=".25"/>
    <circle cx="6" cy="-24" r="12" fill="none" stroke="${C.gold}" stroke-width="3"/><text x="6" y="22" text-anchor="middle" font-family="Georgia" font-size="17" fill="${C.gold}">TRÄUME</text><path d="M-10 54v30q4 6 8 0v-30" fill="#c43c5a"/></g></g>
    <text x="${x + 50}" y="${y + 90}" font-family="Georgia" font-style="italic" font-size="26" fill="${C.cream}" opacity=".7" transform="rotate(180 ${x + 50} ${y + 82})" class="twinkle">z</text>
    <text x="${x + 70}" y="${y + 120}" font-family="Georgia" font-style="italic" font-size="20" fill="${C.cream}" opacity=".6" transform="rotate(180 ${x + 70} ${y + 112})" class="twinkle" style="animation-delay:-1.4s">z</text>`;
}

function armchair(x: number) {
  return `<g><path d="M${x - 90} 820v-110q0 -40 40 -40h100q40 0 40 40v110z" fill="#7a2f43"/><path d="M${x - 70} 700q0 -110 70 -120q70 10 70 120z" fill="#8c3a50"/>
    <rect x="${x - 110}" y="700" width="40" height="110" rx="16" fill="#6a2539"/><rect x="${x + 70}" y="700" width="40" height="110" rx="16" fill="#6a2539"/>
    <rect x="${x - 80}" y="740" width="160" height="40" rx="10" fill="#9b4560"/></g>`;
}

const far = `${wall(W, '#211a55', '#301f4a', 5)}${dome()}
  <g opacity=".5">${[-400, 140, 620, 1900, 2380, 2900].map((x, i) => bookcase(x, 200 + Math.abs(x - CX) / 18, 460, 560, 600 + i, { rows: 4 })).join('')}</g>
  <rect x="-800" y="0" width="${W + 1600}" height="1000" fill="#120a28" opacity=".35"/>
  ${ray(CX - 120, -40, 240, CX - 420, 900, 840)}`;

const main = `
  ${floor(W)}${rug(CX, 900, 1300, '#3b2c66', C.gold)}${rug(CX, 900, 700, '#6b4f9e', C.gold)}
  ${bookcase(120, 220, 460, 580, 31, { rows: 4, trinkets: 0.08 })}
  ${pillar(640)}
  ${clock(900, 330)}
  ${bookcase(1040, 300, 120, 500, 32, { rows: 4 })}${bookcase(1640, 300, 120, 500, 33, { rows: 4 })}
  ${bigBook(CX, 820)}
  ${pillar(2090)}
  ${mirror(2330, 560)}
  ${bookcase(2200 + 360, 240, 220, 560, 34, { rows: 4, breathe: 0.06 })}
  ${upsideBook(2660, 290)}
  ${armchair(300)}${bookStack(420, 820, 6, 41)}
  ${plant(2000, 820, 0.9)}${plant(780, 820, 0.7)}
  ${[400, 1000, 1800, 2450].map((x, i) => lamp(x, 60 + (i % 2) * 50)).join('')}
  ${garland(660, 2110, 70, 40, 8)}
  <!-- a basket of stray pages -->
  <g transform="translate(1950 820)"><path d="M-70 0l-10 -70h160l-10 70z" fill="#b07a4a"/>${[0, 1, 2, 3].map((i) => `<path d="M${-60 + i * 30} -70l14 -40l20 40" fill="#fbf3dc" stroke="#c9b48a"/>`).join('')}<path d="M-80 -70h160" stroke="#8a5a2a" stroke-width="6"/></g>
`;

const over = `<g transform="translate(250 820)"><rect x="-150" y="-40" width="220" height="40" rx="10" fill="#6a2539" opacity=".95"/></g>`;

const fore = '';

export const HERZ: SceneDef = {
  id: 'herz',
  title: 'Das Herz der Bibliothek',
  width: W,
  far, main, over, fore,
  ambience: 'heart',
  seal: 'stern',
  emitters: [
    { kind: 'letters', x: CX - 300, y: 560, w: 600, h: 60 },
    { kind: 'motes', x: 0, y: 100, w: W, h: 700 },
  ],
  wanderers: [
    { id: 'seite_feder', name: 'die Federseite', at: { x: 330, y: 790 }, home: { x: CX - 230, y: 520 }, scale: 0.5, rot: -20, homeColor: '#9b1f2e', line: 'Die erste Seite ist zurück. Sie riecht ein bisschen nach Tinte und Anfang.' },
    { id: 'seite_schluessel', name: 'die Schlüsselseite', at: { x: 2690, y: 520 }, home: { x: CX - 80, y: 470 }, scale: 0.42, rot: 12, homeColor: '#9b1f2e', line: 'Klick – die Schlüsselseite schmiegt sich an das große Buch.' },
    { id: 'seite_blatt', name: 'die Blattseite', at: { x: 1975, y: 735 }, home: { x: CX + 80, y: 470 }, scale: 0.42, rot: 6, homeColor: '#9b1f2e', line: 'Die Blattseite raschelt zufrieden. Sie wusste den Weg ja.' },
    { id: 'seite_stern', name: 'die Sternseite', at: { x: 1100, y: 405 }, home: { x: CX + 230, y: 520 }, scale: 0.38, rot: -10, homeColor: '#9b1f2e', line: 'Die Sternseite leuchtet kurz auf. Fast fertig!' },
  ],
  secrets: [
    { id: 'okapi', kind: 'okapi', at: { x: 2345, y: 600 }, r: 60, scale: 0.75, title: 'Im Spiegel …', text: '… steht ein Okapi und schaut dich freundlich an. Hinter dir steht keins. Du drehst dich trotzdem um.', teaser: 'Im Herz der Bibliothek zeigt ein Spiegel jemanden, der gar nicht da ist.' },
    { id: 'brief', kind: 'brief', at: { x: 1560, y: 812 }, r: 40, scale: 0.42, title: 'Wenn du eine Geschichte liest – liest die Geschichte dann auch dich?', text: 'Der letzte Brief. Die Handschrift sieht ein kleines bisschen aus wie deine.', teaser: 'Am Fuß des großen Buches liegt ein letzter Brief.' },
    { id: 'uhr', kind: 'oddity', at: { x: 900, y: 330 }, r: 130, title: 'Eine rückwärts laufende Uhr', text: 'Die Zeiger laufen rückwärts, und die Zahlen auch. Die Uhr hat es nicht eilig. Hier hat niemand es eilig.', teaser: 'Wie spät ist es im Herz der Bibliothek? Schau mal genau auf die Uhr.' },
    { id: 'kopfbuch', kind: 'oddity', at: { x: 2660, y: 290 }, r: 70, title: 'Ein Buch, das kopfüber schläft', text: 'Es hängt verkehrt herum unter dem Regalbrett und schnarcht leise. Vielleicht träumt es, dass es eine Fledermaus ist.', teaser: 'Ganz rechts oben im Herz schläft jemand verkehrt herum.' },
  ],
  puzzle: {
    kind: 'pages', at: { x: CX, y: 620 }, art: '',
    title: 'Das Buch ohne Ende',
    intro: 'Die Seiten sind durcheinandergeraten. Tippe zwei Seiten an, um sie zu tauschen. Odas Zettel verraten dir die richtige Reihenfolge.',
    teaser: 'Das Buch ohne Ende ohne Laterne ordnen.',
  },
  intro: {
    title: 'Das Herz der Bibliothek',
    text: [
      'Hier ist es still und warm, wie im Inneren einer großen Muschel. In der Mitte liegt ein Buch, so groß wie ein Bett: das <b>Buch ohne Ende</b>.',
      'Vier Seiten sind herausgeflattert. Bring sie zurück – und dann bring sie in die richtige Reihenfolge.',
    ],
  },
  note: { title: 'Das Buch ohne Ende', text: ['Die Seiten sind wieder in Ordnung.'] },
};
