import type { SceneDef, Emitter } from './types';
import { wall, floor, rug, bookcase, archWindow, ray, pillar, table, bookStack, starfield, glow, C } from '../engine/svg';

const W = 3600;

/** Candles that float in the air; their wax drips upward (particles via 'drips' emitters). */
const CANDLES: [number, number][] = [
  [300, 170], [520, 230], [820, 150], [1060, 210], [1150, 170], [1240, 225], [1560, 150],
  [1980, 200], [2300, 140], [2560, 210], [2860, 160], [3100, 230], [3300, 180], [3480, 140],
];

function candle(x: number, y: number, i: number) {
  const h = 46 + (i % 3) * 10;
  return `<g class="bob" style="animation-delay:${(-i * 0.7).toFixed(1)}s">
    ${glow(x, y - 8, 70)}
    <rect x="${x - 7}" y="${y}" width="14" height="${h}" rx="3" fill="${C.cream}"/>
    <rect x="${x - 7}" y="${y}" width="5" height="${h}" fill="#fff" opacity=".35"/>
    <path d="M${x - 5} ${y}q-2 -10 2 -16q2 8 0 16zM${x + 3} ${y}q0 -7 3 -12q1 6 -1 12z" fill="${C.cream}"/>
    <path d="M${x} ${y - 22}q-6 8 0 13q6 -5 0 -13z" fill="${C.amber}" class="flame"/>
    <circle cx="${x}" cy="${y - 14}" r="3" fill="#fff8e0"/></g>`;
}

function banner(x: number, main: string, trim: string, i: number) {
  return `<g class="sway" style="animation-delay:${-i * 1.3}s">
    <rect x="${x - 6}" y="60" width="132" height="10" rx="4" fill="${C.wood2}"/>
    <path d="M${x} 70h120v300l-60 -40l-60 40z" fill="${main}"/>
    <path d="M${x + 8} 70v280M${x + 112} 70v280" stroke="${trim}" stroke-width="5"/>
    <path d="M${x + 36} 150h48v50q-24 28 -48 0z" fill="${trim}"/><path d="M${x + 46} 160h28v34q-14 16 -28 0z" fill="${main}"/>
  </g>`;
}

/** Vaulted, star-studded ceiling. */
function ceiling() {
  let arches = '';
  for (let x = -600; x < W + 600; x += 400) arches += `<path d="M${x} 120Q${x + 200} -40 ${x + 400} 120" stroke="#3b2f7a" stroke-width="10" fill="none" opacity=".8"/>`;
  return `<rect x="-800" y="0" width="${W + 1600}" height="130" fill="#120f3a"/>${starfield(-600, 0, W + 1200, 120, 160, 21)}${arches}`;
}

/** Up the stairs from "1. Stock" ... and you arrive at the "Erdgeschoss". */
function impossibleStair(x0: number) {
  const steps = 12, sw = 25, sh = 31.6;
  let s = '';
  for (let i = 0; i < steps; i++) {
    const x = x0 + i * sw, y = 800 - (i + 1) * sh;
    s += `<rect x="${x}" y="${y}" width="${sw + 2}" height="${800 - y}" fill="${i % 2 ? '#5b4a8a' : '#64529a'}"/><rect x="${x}" y="${y}" width="${sw + 2}" height="6" fill="#8a7ac0"/>`;
  }
  const top = 800 - steps * sh, lx = x0 + steps * sw;
  // landing, supports, a door and two plaques that disagree with gravity
  s += `<rect x="${lx}" y="${top}" width="220" height="16" fill="#8a7ac0"/><rect x="${lx}" y="${top + 16}" width="220" height="14" fill="#4a3c78"/>
    <rect x="${lx + 30}" y="${top + 30}" width="22" height="${800 - top - 30}" fill="#3b2f66"/><rect x="${lx + 170}" y="${top + 30}" width="22" height="${800 - top - 30}" fill="#3b2f66"/>
    <path d="M${lx + 70} ${top}v-150a50 50 0 0 1 100 0v150z" fill="${C.wood1}" stroke="${C.gold2}" stroke-width="5"/>
    <path d="M${lx + 84} ${top}v-140a36 36 0 0 1 72 0v140z" fill="#2b2a6a"/>${glow(lx + 120, top - 80, 90, 'violet')}
    <circle cx="${lx + 145}" cy="${top - 60}" r="5" fill="${C.gold}"/>
    <g transform="translate(${lx + 120} ${top - 200})"><rect x="-70" y="-20" width="140" height="36" rx="6" fill="#2a1d14" stroke="${C.gold}" stroke-width="2"/>
      <text y="6" text-anchor="middle" font-family="Georgia" font-size="22" fill="${C.gold}">Erdgeschoss</text></g>
    <g transform="translate(${x0 - 10} 640)"><rect x="-56" y="-20" width="112" height="36" rx="6" fill="#2a1d14" stroke="${C.gold}" stroke-width="2"/>
      <text y="6" text-anchor="middle" font-family="Georgia" font-size="22" fill="${C.gold}">1. Stock</text>
      <path d="M0 22v40M-12 34l12 -14l12 14" stroke="${C.gold}" stroke-width="4" fill="none"/></g>`;
  return `<g>${s}</g>`;
}

function railing(x0: number) {
  let s = `<path d="M${x0} 700L${x0 + 300} 320" stroke="${C.wood3}" stroke-width="9" stroke-linecap="round"/>`;
  for (let i = 0; i <= 12; i++) {
    const x = x0 + i * 25, y = 700 - (i * 380) / 12;
    s += `<rect x="${x - 3}" y="${y}" width="6" height="${100 - 2}" fill="${C.wood2}"/>`;
  }
  return `<g>${s}<circle cx="${x0}" cy="700" r="10" fill="${C.gold2}"/></g>`;
}

/** Portrait whose eyes follow you around (SMIL animation, self-contained). */
function portraitLady(x: number, y: number) {
  return `<g transform="translate(${x} ${y})">
    <rect x="-70" y="-90" width="140" height="180" rx="6" fill="url(#g-gold)"/><rect x="-58" y="-78" width="116" height="156" fill="#2f5d62"/>
    <path d="M-50 78q4 -60 50 -64q46 4 50 64z" fill="#6b4f9e"/>
    <circle cy="-14" r="26" fill="#f2d2b0"/><path d="M-34 -30l34 -60l34 60z" fill="#3b2c66"/><path d="M-44 -28h88" stroke="#3b2c66" stroke-width="8" stroke-linecap="round"/>
    <circle cx="-10" cy="-16" r="6" fill="#fff"/><circle cx="10" cy="-16" r="6" fill="#fff"/>
    <g><circle cx="-10" cy="-16" r="3" fill="#1d1630"/><circle cx="10" cy="-16" r="3" fill="#1d1630"/>
      <animateTransform attributeName="transform" type="translate" values="0 0;-3 0;-3 0;3 1;3 1;0 0" dur="7s" repeatCount="indefinite"/></g>
    <path d="M-8 0q8 5 16 0" stroke="#8a4a3a" stroke-width="2.5" fill="none"/>
  </g>`;
}

/** An empty meadow painting — the okapi secret is drawn into it by the engine. */
function portraitMeadow(x: number, y: number) {
  return `<g transform="translate(${x} ${y})">
    <rect x="-80" y="-70" width="160" height="140" rx="6" fill="url(#g-gold)"/><rect x="-68" y="-58" width="136" height="116" fill="#9fd0e8"/>
    <circle cx="40" cy="-30" r="14" fill="#fff4cc"/><path d="M-68 10q40 -26 80 -6t56 -4v58h-136z" fill="#6aa255"/><path d="M-68 30q60 -14 136 4v24h-136z" fill="#4f7f42"/>
  </g>`;
}

function portraitMoon(x: number, y: number) {
  return `<g transform="translate(${x} ${y})">
    <rect x="-50" y="-60" width="100" height="120" rx="50" fill="url(#g-gold)"/><rect x="-40" y="-50" width="80" height="100" rx="40" fill="#18205a"/>
    <circle cx="8" cy="-12" r="18" fill="url(#g-moon)"/><circle cx="-14" cy="20" r="2" fill="#fff" class="twinkle"/><circle cx="20" cy="26" r="1.5" fill="#fff" class="twinkle"/>
  </g>`;
}

function owlPerch(x: number) {
  return `<g><rect x="${x - 6}" y="560" width="12" height="260" fill="${C.wood2}"/><rect x="${x - 60}" y="560" width="120" height="12" rx="5" fill="${C.wood3}"/>
    <ellipse cx="${x}" cy="820" rx="60" ry="10" fill="${C.wood1}"/>
    <path d="M${x - 30} 820q-10 -8 -4 -16M${x + 26} 818q8 -10 2 -16" stroke="#d9c09a" stroke-width="3" fill="none"/>
    <path d="M${x + 40} 572l6 20M${x + 46} 574l-4 18" stroke="#8a6a4a" stroke-width="3"/></g>`;
}

function letterRack(x: number, y: number) {
  let slots = '';
  for (let r = 0; r < 3; r++)
    for (let c = 0; c < 3; c++) {
      const sx = x + 10 + c * 44, sy = y + 10 + r * 44;
      slots += `<rect x="${sx}" y="${sy}" width="38" height="38" fill="#1c1022"/>`;
      if ((r * 3 + c) % 4 !== 3 && !(r === 2 && c === 1))
        slots += `<rect x="${sx + 4}" y="${sy + 14 + ((r + c) % 3) * 3}" width="30" height="20" fill="${['#fbf3dc', '#efe0bb', '#e8dcc0'][(r + c) % 3]}" transform="rotate(${((r * 7 + c * 5) % 9) - 4} ${sx + 19} ${sy + 24})"/>`;
    }
  return `<g><rect x="${x}" y="${y}" width="152" height="152" rx="6" fill="${C.wood2}" stroke="${C.wood3}" stroke-width="4"/>${slots}
    <rect x="${x + 20}" y="${y - 32}" width="112" height="26" rx="5" fill="#2a1d14" stroke="${C.gold}" stroke-width="2"/>
    <text x="${x + 76}" y="${y - 13}" text-anchor="middle" font-family="Georgia" font-size="17" fill="${C.gold}">Eulenpost</text></g>`;
}

function platformSign(x: number) {
  let bricks = '';
  for (let y = 130; y < 820; y += 34)
    for (let bx = 0; bx < 130; bx += 52) bricks += `<rect x="${x + bx + ((y / 34) % 2) * 26 - 13}" y="${y}" width="48" height="30" fill="${(bx + y) % 3 ? '#7a3b34' : '#8a463c'}"/>`;
  return `<g><clipPath id="brickclip"><rect x="${x}" y="130" width="130" height="690"/></clipPath><rect x="${x}" y="130" width="130" height="690" fill="#5a2a26"/>
    <g clip-path="url(#brickclip)">${bricks}</g><rect x="${x - 8}" y="120" width="146" height="16" fill="#6a5a5a"/>
    <g transform="translate(${x + 65} 380)"><rect x="-80" y="-34" width="160" height="68" rx="8" fill="#b5243c" stroke="#fff" stroke-width="4"/>
      <text y="12" text-anchor="middle" font-family="Georgia" font-weight="bold" font-size="34" fill="#fff">Gleis 9¾</text></g>
    ${glow(x + 65, 380, 140, 'violet')}</g>`;
}

function stairModel(x: number) {
  const pieces = [[-60, -20, 0], [-20, -40, 90], [20, -20, 180], [60, -40, 270]];
  return `${table(x - 110, 700, 220)}<g transform="translate(${x} 680)">
    <rect x="-90" y="-8" width="180" height="10" rx="3" fill="#3b2f66"/>
    ${pieces.map(([px, py, a]) => `<g transform="translate(${px} ${py}) rotate(${a})"><rect x="-16" y="-16" width="32" height="32" rx="4" fill="#241a40" stroke="#8a7ac0" stroke-width="2"/><rect x="-6" y="-16" width="12" height="16" fill="#a88abf"/><circle r="7" fill="#a88abf"/></g>`).join('')}
    <path d="M-110 -30v-40a16 16 0 0 1 32 0v40z" fill="${C.wood2}" stroke="${C.gold}" stroke-width="2"/><path d="M78 -30v-40a16 16 0 0 1 32 0v40z" fill="${C.wood2}" stroke="${C.gold}" stroke-width="2"/>
  </g>`;
}

function cauldron(x: number, base: number) {
  return `<g><ellipse cx="${x}" cy="${base - 50}" rx="70" ry="56" fill="#22202e"/><ellipse cx="${x}" cy="${base - 96}" rx="66" ry="14" fill="#33304a"/>
    <ellipse cx="${x}" cy="${base - 96}" rx="56" ry="9" fill="#5fdc9a" opacity=".85"/><circle cx="${x - 16}" cy="${base - 104}" r="7" fill="#9ff5c6" class="twinkle"/><circle cx="${x + 20}" cy="${base - 110}" r="5" fill="#9ff5c6" class="twinkle" style="animation-delay:-1s"/>
    ${glow(x, base - 110, 90, 'teal')}<path d="M${x - 50} ${base - 6}l-10 8M${x + 50} ${base - 6}l10 8" stroke="#22202e" stroke-width="8" stroke-linecap="round"/></g>`;
}

const far = `${wall(W, '#241a52', '#1d2a4a', 2)}
  ${ceiling()}
  ${[620, 1320, 2050, 3220].map((x) => archWindow(x, 160, 150, 380, '#1b2a6a')).join('')}
  <g opacity=".5">${[-500, 380, 1150, 1850, 2550, 3250].map((x, i) => bookcase(x, 200, 480, 560, 500 + i, { rows: 4 })).join('')}</g>
  <rect x="-800" y="130" width="${W + 1600}" height="870" fill="#0e0a2a" opacity=".42"/>
  ${banner(250, '#9b1f2e', C.gold, 0)}${banner(1250, '#2f5d4a', '#c9d0d8', 1)}${banner(2250, '#2b3f7b', '#c7883a', 2)}${banner(3200, '#d6a93a', '#1d1630', 3)}
  ${[620, 1320, 2050, 3220].map((x) => ray(x, 180, 150, x - 140, 900, 380, true)).join('')}`;

const main = `
  ${floor(W)}
  ${rug(1100, 890, 760, '#2f2a6a')}${rug(2900, 905, 620, '#5a2a3a')}
  ${bookcase(160, 150, 420, 650, 31, { rows: 5, trinkets: 0.09 })}
  ${owlPerch(720)}
  ${letterRack(780, 400)}
  ${bookcase(960, 150, 360, 650, 32, { rows: 5, arch: true, trinkets: 0.07 })}
  ${pillar(1340, 56)}
  ${impossibleStair(1420)}
  ${portraitLady(2200, 330)}${portraitMeadow(2360, 470)}${portraitMoon(2480, 270)}
  ${platformSign(2570)}
  ${bookcase(2760, 150, 420, 650, 33, { rows: 5, trinkets: 0.08, breathe: 0.04 })}
  ${pillar(3250, 56)}
  ${bookcase(3400, 150, 200, 650, 34, { rows: 5 })}
  ${stairModel(3000 + 300 - 30 - 70 - 90)}
  ${bookStack(2140, 820, 6, 41)}${bookStack(2280, 820, 3, 42)}
  ${table(1960, 730, 190)}${bookStack(1980, 730, 3, 43)}
  ${CANDLES.map(([x, y], i) => candle(x, y, i)).join('')}
`;

const over = `
  ${railing(1420)}
  ${cauldron(2560, 830)}
  ${bookStack(380, 820, 4, 44)}
`;

const fore = `
  <g fill="#0a0618" opacity=".85" filter="url(#f-blur)">
    <path d="M-200 1000q60 -220 200 -260q-40 120 30 260z"/><path d="M-120 1000q120 -160 260 -170q-80 80 -60 170z"/>
    <path d="M2100 1000q30 -200 160 -240q-30 120 20 240z"/><path d="M2180 1000q90 -120 220 -140q-60 60 -40 140z"/>
    <path d="M4200 1000q60 -220 200 -260q-40 120 30 260z"/>
  </g>`;

const drips: Emitter[] = CANDLES.map(([x, y]) => ({ kind: 'drips', x: x - 4, y: y - 26, w: 8, h: 4 }));

export const ZAUBER: SceneDef = {
  id: 'zauber',
  title: 'Der Zauberflügel',
  width: W,
  far, main, over, fore,
  ambience: 'magic',
  seal: 'schluessel',
  emitters: [{ kind: 'motes', x: 0, y: 140, w: W, h: 660 }, ...drips],
  wanderers: [
    { id: 'eule', name: 'die Eule', at: { x: 2482, y: 188 }, home: { x: 300, y: 250 }, scale: 0.45, homeColor: '#8a6a4a', line: 'Die Eule ist zurück in ihrer Geschichte. Den Brief stellt sie morgen zu – heute ist sie müde.' },
    { id: 'brille', name: 'die Brille', at: { x: 1580, y: 584 }, home: { x: 3000, y: 370 }, scale: 0.42, rot: -12, homeColor: '#2b3f6b', line: 'Die runde Brille ist wieder da. Jetzt sieht ihre Geschichte endlich wieder alles klar.' },
    { id: 'besen', name: 'der Besen', at: { x: 2652, y: 700 }, home: { x: 480, y: 490 }, scale: 0.5, rot: 18, homeColor: '#9a7b3a', line: 'Der Besen saust in sein Buch zurück. Eine Ehrenrunde über dem Schulhof hat er sich verdient.' },
    { id: 'blitz', name: 'das Blitz-Lesezeichen', at: { x: 3090, y: 488 }, home: { x: 1100, y: 250 }, scale: 0.45, homeColor: '#8c2f39', line: 'Das Blitz-Lesezeichen steckt wieder an der spannendsten Stelle. Genau da, wo man nicht aufhören kann.' },
    { id: 'schluessel', name: 'der fliegende Schlüssel', at: { x: 3236, y: 300 }, home: { x: 1250, y: 490 }, scale: 0.42, rot: 20, homeColor: '#355c8c', line: 'Der fliegende Schlüssel flattert zurück zu seinem Schwarm. Er war nur kurz neugierig.' },
    { id: 'zauberstab', name: 'der Zauberstab', at: { x: 452, y: 742 }, home: { x: 3500, y: 370 }, scale: 0.45, rot: -35, homeColor: '#3e7a4f', line: 'Der Zauberstab ist zu Hause. Ein kleiner Funke zum Abschied – das gehört sich so unter Zauberstäben.' },
    { id: 'schal', name: 'der Schal', at: { x: 742, y: 612 }, home: { x: 2880, y: 250 }, scale: 0.5, rot: 6, homeColor: '#9b1f2e', line: 'Der Schal ist zurück: rot und gold, kuschelig und ein kleines bisschen stolz.' },
  ],
  secrets: [
    { id: 'okapi', kind: 'okapi', at: { x: 2330, y: 496 }, r: 55, scale: 0.42, title: 'Ein gemaltes Okapi?', text: 'Mitten im Wiesenbild steht ein Okapi. Es hat sich wohl ins falsche Gemälde verlaufen – und fühlt sich trotzdem sehr wohl.', teaser: 'Im Zauberflügel hängt ein Gemälde mit einem Tier, das gar nicht in diese Geschichte gehört.' },
    { id: 'brief', kind: 'brief', at: { x: 875, y: 508 }, r: 32, scale: 0.4, title: 'Woher kommt die Welt?', text: 'Wieder nur eine Frage, wieder kein Absender. Man kann sehr lange darüber nachdenken. Sehr, sehr lange.', teaser: 'In den Fächern der Eulenpost steckt ein Brief ohne Absender.' },
    { id: 'treppe', kind: 'oddity', at: { x: 1640, y: 470 }, r: 120, title: 'Eine Treppe nach unten oben', text: 'Unten steht „1. Stock“, oben steht „Erdgeschoss“. Du bist ganz sicher hinaufgestiegen. Die Treppe tut so, als wäre nichts.', teaser: 'Eine Treppe im Zauberflügel führt nach oben – und kommt trotzdem tiefer an. Schon bemerkt?' },
    { id: 'portraet', kind: 'oddity', at: { x: 2200, y: 320 }, r: 75, title: 'Ein aufmerksames Porträt', text: 'Die Dame im Bild schaut dir freundlich hinterher. Als du hinsiehst, bewundert sie schnell die Decke.', teaser: 'Ein Porträt im Zauberflügel schaut dir hinterher.' },
    { id: 'kerzen', kind: 'oddity', at: { x: 1150, y: 195 }, r: 90, title: 'Kerzen, die nach oben tropfen', text: 'Das Wachs der schwebenden Kerzen tropft nach oben – und wird an der Decke zu kleinen Sternen.', teaser: 'Schau dir die schwebenden Kerzen einmal genau an. Wohin tropft eigentlich ihr Wachs?' },
  ],
  puzzle: {
    kind: 'stairs', at: { x: 3110, y: 640 }, art: '',
    title: 'Die wandernde Treppe',
    intro: 'Die Treppenstücke sind durcheinander geraten. Drehe sie mit einem Tipp, bis ein leuchtender Weg von der linken zur rechten Tür führt.',
    teaser: 'Die wandernde Treppe ganz ohne Laterne richten.',
  },
  intro: {
    title: 'Der Zauberflügel',
    text: [
      'Hier riecht es nach Kerzenwachs und Sternenstaub. Die Kerzen schweben einfach in der Luft – und niemand scheint sich daran zu stören.',
      '<b>Sieben Wanderer</b> haben sich hier versteckt. Manche fliegen gern hoch hinaus, also schau auch mal nach oben.',
    ],
  },
  note: {
    title: 'Ein Zettel von Oda',
    text: [
      'Die Treppe läuft wieder dahin, wo sie hinsoll. Meistens jedenfalls. Danke!',
      'Mein zweites Zeichen ist der <b>Schlüssel</b>. Er gehört an die <b>zweite</b> Stelle – denn ein Schlüssel öffnet die Tür zu allen Geschichten.',
      'Ich bin noch weiter hinten. Folge den Karten.',
    ],
  },
};
