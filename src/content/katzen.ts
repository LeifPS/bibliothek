import type { SceneDef } from './types';
import { wall, floor, bookcase, glow, starfield, C } from '../engine/svg';
import { rng } from '../rng';

const W = 3600;

/* ---------- local drawing helpers ---------- */

/** An old oak growing out of the library: trunk, roots, a niche of books, branches and a canopy. */
function oak(x: number, w: number, seed: number, hollow = false) {
  const r = rng(seed);
  const hw = w / 2;
  let bark = '';
  for (let i = 0; i < 9; i++) {
    const bx = x - hw + 12 + r() * (w - 24);
    bark += `<path d="M${bx.toFixed(0)} ${(820 - r() * 80).toFixed(0)}q${(r() * 16 - 8).toFixed(0)} -200 ${(r() * 10 - 5).toFixed(0)} -${(260 + r() * 300).toFixed(0)}" stroke="#1e140c" stroke-opacity=".45" stroke-width="${(2 + r() * 3).toFixed(1)}" fill="none"/>`;
  }
  const roots = [-1, 1].map((d) => `<path d="M${x + d * hw * 0.6} 780q${d * 90} 10 ${d * 200} 48q${-d * 120} -10 ${-d * 230} -6z" fill="#3a2716"/>
    <path d="M${x + d * hw * 0.3} 800q${d * 60} 6 ${d * 120} 30q${-d * 80} -4 ${-d * 130} -2z" fill="#4a3220"/>`).join('');
  const branches = [-1, 1].map((d) => `<path d="M${x + d * hw * 0.5} 230q${d * 120} -40 ${d * 260} -110" stroke="#3a2716" stroke-width="34" stroke-linecap="round" fill="none"/>
    <path d="M${x + d * hw * 0.4} 320q${d * 90} -10 ${d * 180} -70" stroke="#3a2716" stroke-width="20" stroke-linecap="round" fill="none"/>`).join('');
  let canopy = '';
  for (let i = 0; i < 14; i++) {
    const cx = x + (r() - 0.5) * 620, cy = 20 + r() * 150, rad = 70 + r() * 70;
    canopy += `<circle cx="${cx.toFixed(0)}" cy="${cy.toFixed(0)}" r="${rad.toFixed(0)}" fill="${['#1f4a3e', '#255a46', '#2d6b50', '#1a3e36'][i % 4]}"/>`;
  }
  for (let i = 0; i < 18; i++) {
    const cx = x + (r() - 0.5) * 600, cy = 30 + r() * 160;
    canopy += `<circle cx="${cx.toFixed(0)}" cy="${cy.toFixed(0)}" r="${(8 + r() * 12).toFixed(0)}" fill="#8fc9a6" opacity=".18"/>`;
  }
  // a few books grown right into the trunk
  let niche = `<rect x="${x - 34}" y="560" width="68" height="74" rx="10" fill="#1a1008"/>`;
  let nx = x - 28;
  for (let i = 0; i < 4; i++) {
    const bw = 11 + r() * 5, bh = 44 + r() * 20;
    niche += `<rect x="${nx.toFixed(0)}" y="${(628 - bh).toFixed(0)}" width="${bw.toFixed(0)}" height="${bh.toFixed(0)}" rx="2" fill="${['#2f5d62', '#6b4f9e', '#c7883a', '#3e7a4f'][i]}"/>`;
    nx += bw + 2;
  }
  const hole = hollow ? `<ellipse cx="${x}" cy="480" rx="38" ry="52" fill="#120a05"/><ellipse cx="${x}" cy="480" rx="38" ry="52" fill="none" stroke="#5a3e26" stroke-width="8"/>` : '';
  return `<g class="oak">${roots}
    <path d="M${x - hw} 830q-20 -260 10 -460q10 -130 -10 -260h${w}q-20 130 -10 260q30 200 10 460z" fill="url(#g-bark)"/>
    ${bark}${niche}${hole}${branches}<g class="sway" style="animation-duration:9s">${canopy}</g></g>`;
}

function mushroom(x: number, base: number, s = 1, color = '#c9485a') {
  return `<g transform="translate(${x} ${base}) scale(${s})"><path d="M-6 0v-22h12v22z" fill="#efe0bb"/><path d="M-22 -20q22 -30 44 0z" fill="${color}"/>
    <circle cx="-8" cy="-26" r="3" fill="#fff" opacity=".85"/><circle cx="7" cy="-30" r="2.5" fill="#fff" opacity=".85"/><circle cx="12" cy="-23" r="2" fill="#fff" opacity=".85"/></g>`;
}

function fern(x: number, base: number, s = 1, color = '#3e7a4f', flip = false) {
  const fronds = [-70, -45, -20, 5, 30, 55]
    .map((a, i) => {
      const len = 120 + (i % 3) * 30;
      const ex = Math.sin((a * Math.PI) / 180) * len, ey = -Math.cos((a * Math.PI) / 180) * len;
      let leaflets = '';
      for (let k = 1; k < 8; k++) {
        const t = k / 8;
        const px = ex * t, py = ey * t;
        leaflets += `<ellipse cx="${px.toFixed(0)}" cy="${py.toFixed(0)}" rx="${(16 * (1 - t) + 4).toFixed(0)}" ry="5" transform="rotate(${a + 90} ${px.toFixed(0)} ${py.toFixed(0)})" fill="${i % 2 ? color : '#5f8f4e'}"/>`;
      }
      return `<path d="M0 0Q${(ex * 0.4).toFixed(0)} ${(ey * 0.6).toFixed(0)} ${ex.toFixed(0)} ${ey.toFixed(0)}" stroke="#2f5d3a" stroke-width="3" fill="none"/>${leaflets}`;
    })
    .join('');
  return `<g transform="translate(${x} ${base}) scale(${flip ? -s : s} ${s})"><g class="sway" style="animation-duration:7s">${fronds}</g></g>`;
}

function mossPatch(x: number, y: number, w: number, seed: number) {
  const r = rng(seed);
  let s = `<ellipse cx="${x}" cy="${y}" rx="${w / 2}" ry="${w / 10}" fill="#244a30" opacity=".8"/>`;
  for (let i = 0; i < w / 18; i++) s += `<circle cx="${(x - w / 2 + r() * w).toFixed(0)}" cy="${(y - 4 + r() * 8).toFixed(0)}" r="${(4 + r() * 6).toFixed(0)}" fill="${r() < 0.5 ? '#3f6f3a' : '#4f8a45'}" opacity=".85"/>`;
  return s;
}

/** Banner with a simple clan mark. */
function banner(x: number, mark: 'flamme' | 'welle' | 'wind' | 'schatten', color: string) {
  const marks = {
    flamme: `<path d="M0 30q-26 -10 -16 -40q6 10 12 8q-4 -20 14 -34q-2 18 12 26q8 20 -6 40q-6 4 -16 0z" fill="#ffb347"/><path d="M2 26q-10 -8 -4 -22q8 10 10 22z" fill="#ffe08a"/>`,
    welle: `<path d="M-30 4q10 -16 20 0t20 0t20 0M-30 20q10 -16 20 0t20 0t20 0" stroke="#bdf2ff" stroke-width="6" fill="none" stroke-linecap="round"/>`,
    wind: `<path d="M-28 -6h30q14 0 14 -12t-12 -10M-28 10h44q14 0 14 12t-12 10" stroke="#e8f4ff" stroke-width="6" fill="none" stroke-linecap="round"/>`,
    schatten: `<circle r="22" fill="#1d1630"/><circle cx="-8" cy="-4" r="4" fill="#eaff8a"/><circle cx="8" cy="-4" r="4" fill="#eaff8a"/>`,
  };
  return `<g class="sway" style="animation-duration:${7 + (x % 3)}s"><line x1="${x}" y1="0" x2="${x}" y2="60" stroke="#2a1a10" stroke-width="3"/>
    <rect x="${x - 50}" y="56" width="100" height="10" rx="5" fill="${C.wood2}"/>
    <path d="M${x - 44} 64h88v170l-44 -26l-44 26z" fill="${color}"/><path d="M${x - 44} 64h88v170l-44 -26l-44 26z" fill="none" stroke="${C.gold}" stroke-width="3" opacity=".7"/>
    <g transform="translate(${x} 140)">${marks[mark]}</g></g>`;
}

/** The great rock with the stone star disc on top. */
function greatRock(x: number) {
  const r = rng(77);
  let stars = '';
  for (let i = 0; i < 16; i++) {
    const a = r() * Math.PI * 2, d = 20 + r() * 64;
    stars += `<circle cx="${(Math.cos(a) * d).toFixed(0)}" cy="${(Math.sin(a) * d * 0.4).toFixed(0)}" r="${(1.5 + r() * 2.5).toFixed(1)}" fill="#fff8e0" class="twinkle" style="animation-delay:${(-r() * 4).toFixed(1)}s"/>`;
  }
  return `<g>
    <path d="M${x - 330} 830q-20 -150 80 -230q70 -60 170 -70q120 -10 200 50q110 80 90 250z" fill="#4a5068"/>
    <path d="M${x - 300} 830q0 -130 90 -200q70 -50 160 -54q-90 40 -130 110q-30 60 -20 144z" fill="#5c6380"/>
    <path d="M${x + 60} 560q80 20 140 90" stroke="#3a3f55" stroke-width="5" fill="none"/><path d="M${x - 140} 650q40 -30 90 -20" stroke="#3a3f55" stroke-width="4" fill="none"/>
    ${mossPatch(x - 40, 545, 300, 31)}
    <g transform="translate(${x} 520)">
      <ellipse cx="0" cy="26" rx="120" ry="34" fill="#353a50"/>
      <ellipse cx="0" cy="10" rx="120" ry="44" fill="#7a809c"/><ellipse cx="0" cy="10" rx="100" ry="36" fill="#1b1d4a"/>
      <ellipse cx="0" cy="10" rx="70" ry="25" fill="none" stroke="#4a4f9e" stroke-width="3"/><ellipse cx="0" cy="10" rx="40" ry="14" fill="none" stroke="#4a4f9e" stroke-width="3"/>
      <g transform="translate(0 10)">${stars}</g>
      <path d="M0 -28l-8 -14h16z" fill="${C.gold}"/>
    </g></g>`;
}

/** Wall lantern + a cat shadow on the wall where there is no cat. */
function shadowCat(x: number) {
  let stones = '';
  for (let row = 0; row < 14; row++)
    for (let col = 0; col < 4; col++)
      stones += `<rect x="${x - 95 + col * 52 + (row % 2) * 26}" y="${160 + row * 48}" width="48" height="44" rx="6" fill="#56645c" opacity="${0.5 + ((row * 7 + col * 3) % 5) * 0.08}"/>`;
  return `<g><clipPath id="wallclip"><rect x="${x - 95}" y="150" width="215" height="672"/></clipPath>
    <g clip-path="url(#wallclip)"><rect x="${x - 95}" y="150" width="215" height="672" fill="#3c4a44"/>${stones}</g>
    <ellipse cx="${x - 30}" cy="520" rx="170" ry="260" fill="#ffcf7a" opacity=".16"/>
    <g transform="translate(${x - 70} 470)"><path d="M0 -40v-30" stroke="#2a1a10" stroke-width="4"/><path d="M-16 -40h32l-4 50h-24z" fill="#ffcf7a" stroke="${C.gold2}" stroke-width="3"/>${glow(0, -10, 200)}</g>
    <g transform="translate(${x + 20} 712)" opacity=".7" filter="url(#f-soft)">
      <path d="M-50 100q-8 -90 30 -120q-14 -30 4 -60l12 18q14 -6 28 0l12 -18q16 30 2 60q36 30 30 120z" fill="#0a0716"/>
      <path d="M58 96q60 -10 50 -80q-4 -20 -18 -18q10 30 0 60q-10 24 -36 26z" fill="#0a0716"/>
    </g></g>`;
}

/** The moon in a jar. */
function moonJar(x: number, base: number) {
  return `<g>${glow(x, base - 40, 110)}
    <rect x="${x - 30}" y="${base - 84}" width="60" height="84" rx="14" fill="url(#g-glass)" stroke="#d8f6ff" stroke-opacity=".6" stroke-width="2"/>
    <rect x="${x - 24}" y="${base - 96}" width="48" height="14" rx="3" fill="${C.wood2}"/><path d="M${x - 24} ${base - 90}h48" stroke="${C.gold}" stroke-width="2"/>
    <g class="bob"><circle cx="${x}" cy="${base - 42}" r="18" fill="url(#g-moon)"/><circle cx="${x - 6}" cy="${base - 46}" r="3" fill="#d8cc9e"/><circle cx="${x + 6}" cy="${base - 36}" r="2" fill="#d8cc9e"/></g></g>`;
}

/** A small heap of leaves; some of them float upward. */
function leafPile(x: number, base: number) {
  const r = rng(55);
  let s = '';
  for (let i = 0; i < 26; i++) {
    const lx = x + (r() - 0.5) * 160, ly = base - r() * 30;
    s += `<ellipse cx="${lx.toFixed(0)}" cy="${ly.toFixed(0)}" rx="13" ry="6" transform="rotate(${(r() * 180).toFixed(0)} ${lx.toFixed(0)} ${ly.toFixed(0)})" fill="${['#e0a43a', '#c7603a', '#b5543c', '#d9a85a'][i % 4]}"/>`;
  }
  for (let i = 0; i < 5; i++) {
    const lx = x - 40 + i * 20, ly = base - 70 - i * 45;
    s += `<g class="bob" style="animation-delay:${-i}s"><ellipse cx="${lx}" cy="${ly}" rx="13" ry="6" transform="rotate(${i * 40} ${lx} ${ly})" fill="${i % 2 ? '#e0a43a' : '#c7603a'}" opacity="${1 - i * 0.15}"/></g>`;
  }
  return s;
}

function hangingLantern(x: number, y: number) {
  return `<g class="sway" style="animation-duration:8s"><line x1="${x}" y1="${y - 80}" x2="${x}" y2="${y - 18}" stroke="#2a1a10" stroke-width="2"/>
    <path d="M${x - 12} ${y - 18}h24l-4 34h-16z" fill="#eaff8a" opacity=".85" stroke="${C.gold2}" stroke-width="2"/>${glow(x, y, 120)}</g>`;
}

/* ---------- layers ---------- */

const bark = `<linearGradient id="g-bark" x1="0" x2="1"><stop offset="0" stop-color="#2a1c10"/><stop offset=".45" stop-color="#5a3e26"/><stop offset="1" stop-color="#2a1c10"/></linearGradient>
  <radialGradient id="g-shade"><stop offset="0" stop-color="#05040c" stop-opacity=".9"/><stop offset=".55" stop-color="#05040c" stop-opacity=".7"/><stop offset="1" stop-color="#05040c" stop-opacity="0"/></radialGradient>`;

const far = `${bark}${wall(W, '#0f2a2e', '#14322e', 4)}
  <!-- the glass dome with a very large moon -->
  <g transform="translate(1450 0)">
    <path d="M-520 600a520 520 0 0 1 1040 0z" fill="#132a5a"/>
    ${starfield(-500, 90, 1000, 500, 70, 21)}
    <circle cx="0" cy="250" r="150" fill="url(#g-moon)"/><circle cx="0" cy="250" r="320" fill="url(#g-glow)" opacity=".35"/>
    <circle cx="-40" cy="220" r="18" fill="#d8cc9e" opacity=".6"/><circle cx="50" cy="290" r="26" fill="#d8cc9e" opacity=".5"/>
    ${[-60, -30, 0, 30, 60].map((a) => `<line x1="0" y1="600" x2="${(Math.sin((a * Math.PI) / 180) * 520).toFixed(0)}" y2="${(600 - Math.cos((a * Math.PI) / 180) * 520).toFixed(0)}" stroke="#2a3e6a" stroke-width="8"/>`).join('')}
    <path d="M-520 600a520 520 0 0 1 1040 0" fill="none" stroke="#2a3e6a" stroke-width="14"/><path d="M-400 600a400 400 0 0 1 800 0" fill="none" stroke="#2a3e6a" stroke-width="5"/>
  </g>
  <g opacity=".5">${[-420, 340, 2200, 3000].map((x, i) => bookcase(x, 160, 440, 600, 400 + i, { rows: 5 })).join('')}</g>
  <g opacity=".55">${[-200, 700, 2500, 3500].map((x, i) => `<path d="M${x} 830q-14 -300 6 -620t-6 -210h${70 + i * 8}q-14 300 4 620t6 210z" fill="#1a2a24"/>`).join('')}</g>
  <rect x="-800" y="0" width="${W + 1600}" height="1000" fill="#04141a" opacity=".38"/>
  <path class="ray" d="M1340 200h220L1700 900h-500z" fill="url(#g-ray-blue)" style="mix-blend-mode:screen"/>`;

const main = `
  ${floor(W)}
  <rect x="-800" y="826" width="${W + 1600}" height="174" fill="#0e2a20" opacity=".55"/>
  ${[300, 980, 1500, 2350, 2950, 3450].map((x, i) => mossPatch(x, 850 + (i % 2) * 30, 260 + (i % 3) * 60, 60 + i)).join('')}
  ${bookcase(150, 150, 460, 650, 41, { rows: 5, trinkets: 0.07 })}
  ${shadowCat(700)}
  ${oak(870, 150, 5, true)}
  ${bookcase(960, 150, 400, 650, 42, { rows: 5, trinkets: 0.07, breathe: 0.04 })}
  ${oak(2230, 170, 6)}
  ${bookcase(2560, 150, 520, 650, 43, { rows: 5, trinkets: 0.06 })}
  ${moonJar(2830, 408)}
  ${oak(3180, 140, 7)}
  ${bookcase(3300, 150, 260, 650, 44, { rows: 5 })}
  ${greatRock(1800)}
  ${leafPile(2380, 820)}
  ${banner(700, 'flamme', '#9b3a2e')}${banner(1460, 'welle', '#2f5d8c')}${banner(2120, 'wind', '#5b6c8f')}${banner(3080, 'schatten', '#3b2c66')}
  ${hangingLantern(1090, 200)}${hangingLantern(2050, 300)}${hangingLantern(3380, 180)}
  ${mushroom(620, 822, 1.1)}${mushroom(660, 822, 0.7, '#e0a43a')}${mushroom(1420, 822, 0.9)}${mushroom(2150, 822, 1.2, '#8a6fd1')}${mushroom(3110, 822, 0.8)}${mushroom(3580, 822, 1)}
  ${fern(450, 830, 0.8)}${fern(1580, 830, 0.7, '#3e7a4f', true)}${fern(3560, 830, 0.8, '#2f5d62')}
  ${glow(400, 450, 160, 'teal')}${glow(1700, 700, 220, 'teal')}${glow(2800, 450, 180, 'teal')}
`;

const over = `
  <!-- deep shade between the trunks: only striped legs catch the light -->
  <ellipse cx="2440" cy="742" rx="120" ry="52" fill="url(#g-shade)" filter="url(#f-soft)"/>
  ${fern(2960, 835, 0.75, '#3e7a4f')}${fern(3010, 835, 0.55, '#2f5d62', true)}
  <path d="M960 830q30 -60 110 -64q-50 30 -40 64z" fill="#3a2716"/><path d="M1010 832q40 -40 100 -30q-50 14 -60 30z" fill="#4a3220"/>
  ${fern(1680, 835, 0.5, '#3e7a4f', true)}${mushroom(1740, 824, 0.9, '#e0a43a')}
  ${fern(560, 835, 0.6, '#2f5d62')}
  ${fern(3460, 835, 0.6, '#3e7a4f', true)}
  <path d="M1990 340q30 -10 60 4" stroke="#3a2716" stroke-width="14" stroke-linecap="round" fill="none"/>
  ${[1960, 2010, 2060, 2110].map((x, i) => `<ellipse cx="${x}" cy="${330 + (i % 2) * 14}" rx="26" ry="14" fill="${i % 2 ? '#255a46' : '#2d6b50'}"/>`).join('')}
`;

const fore = `
  <g fill="#04100c" opacity=".85" filter="url(#f-blur)">
    <path d="M-200 1000q80 -260 240 -300q-60 140 20 300z"/><path d="M-100 1000q140 -180 300 -180q-100 80 -80 180z"/>
    <path d="M1600 1000q50 -220 190 -260q-40 130 20 260z"/>
    <path d="M2900 1000q40 -180 170 -230q-30 110 10 230z"/><path d="M2980 1000q90 -120 230 -130q-70 50 -50 130z"/>
    <path d="M4300 1000q60 -220 200 -260q-40 120 30 260z"/>
  </g>`;

export const KATZEN: SceneDef = {
  id: 'katzen',
  title: 'Der Katzenwald',
  width: W,
  far, main, over, fore,
  ambience: 'forest',
  seal: 'stern',
  emitters: [
    { kind: 'upleaves', x: 0, y: 780, w: W, h: 40 },
    { kind: 'upleaves', x: 2320, y: 780, w: 120, h: 30 },
    { kind: 'fireflies', x: 200, y: 350, w: 500, h: 350 },
    { kind: 'fireflies', x: 1500, y: 400, w: 600, h: 350 },
    { kind: 'fireflies', x: 2700, y: 300, w: 700, h: 400 },
    { kind: 'motes', x: 1100, y: 150, w: 900, h: 600 },
  ],
  wanderers: [
    { id: 'kaetzchen', name: 'das Kätzchen', at: { x: 2980, y: 790 }, home: { x: 400, y: 246 }, scale: 0.5, homeColor: '#3e7a4f', line: 'Das Kätzchen rollt sich in seinem Buch zusammen und schnurrt. Sein Clan hat schon nach ihm gesucht.' },
    { id: 'mondstein', name: 'der Mondstein', at: { x: 1720, y: 795 }, home: { x: 2700, y: 246 }, scale: 0.45, homeColor: '#2b3f6b', line: 'Der Mondstein leuchtet wieder in seiner Höhle. Wer ihn berührt, träumt von Sternen.' },
    { id: 'kraeuter', name: 'das Kräuterbündel', at: { x: 3470, y: 790 }, home: { x: 1180, y: 490 }, scale: 0.45, rot: -10, homeColor: '#5f8f4e', line: 'Die Heilkräuter sind zurück im Vorrat. Gegen Bauchweh, Dornen und schlechte Laune.' },
    { id: 'moos', name: 'das Mooskissen', at: { x: 560, y: 805 }, home: { x: 2960, y: 490 }, scale: 0.45, homeColor: '#3e7a4f', line: 'Das Mooskissen liegt wieder im Bau. Weicher schläft keine Katze.' },
    { id: 'wolle', name: 'das Wollknäuel', at: { x: 1040, y: 800 }, home: { x: 3430, y: 246 }, scale: 0.42, homeColor: '#a34e6b', line: 'Das Wollknäuel ist zu Hause. Ein bisschen weniger ordentlich als vorher – Katzen eben.' },
    { id: 'gluehglas', name: 'das Glühwürmchenglas', at: { x: 2030, y: 360 }, home: { x: 260, y: 490 }, scale: 0.42, rot: 6, homeColor: '#2f5d62', line: 'Die Glühwürmchen leuchten wieder in ihrer Geschichte – als Nachtlicht für den ganzen Wald.' },
  ],
  secrets: [
    { id: 'okapi', kind: 'okapi', at: { x: 2440, y: 768 }, r: 55, scale: 0.68, title: 'Ein Okapi im Dunkeln', text: 'Zwischen den Stämmen leuchten nur gestreifte Beine. Der Rest ist Schatten – und ein sehr freundlicher Blick.', teaser: 'Im Katzenwald fangen zwischen zwei Stämmen nur gestreifte Beine das Licht.' },
    { id: 'brief', kind: 'brief', at: { x: 870, y: 486 }, r: 40, scale: 0.42, title: 'Träumen Katzen von uns?', text: 'Wenn wir von ihnen träumen … warum dann nicht auch umgekehrt? Kein Absender. Nur ein paar Katzenhaare am Umschlag.', teaser: 'Im Katzenwald hat ein hohler Baum etwas Papierenes verschluckt.' },
    { id: 'schatten', kind: 'oddity', at: { x: 730, y: 740 }, r: 80, title: 'Ein Schatten ohne Katze', text: 'An der Wand sitzt der Schatten einer Katze. Nur die Katze dazu fehlt. Der Schatten scheint das nicht zu stören.', teaser: 'Im Katzenwald wirft etwas einen Schatten, das gar nicht da ist.' },
    { id: 'blaetter', kind: 'oddity', at: { x: 2380, y: 760 }, r: 80, title: 'Blätter, die nach oben fallen', text: 'Hier fällt das Laub nach oben. Ganz gemächlich, als hätte es alle Zeit der Welt. Vielleicht hat es die.', teaser: 'Im Katzenwald fällt etwas in die falsche Richtung.' },
    { id: 'mondglas', kind: 'oddity', at: { x: 2830, y: 360 }, r: 60, title: 'Der Mond im Glas', text: 'Im Einmachglas schwebt ein kleiner Mond. Und oben im Glasdach … hängt er trotzdem auch. Zwei Monde? Oder einer, der sich nicht entscheiden kann?', teaser: 'Im Katzenwald wird auf einem Regal etwas sehr Großes sehr klein aufbewahrt.' },
  ],
  puzzle: {
    kind: 'rings', at: { x: 1800, y: 520 }, art: '',
    title: 'Der Sternenkreis',
    intro: 'Tippe auf die Ringe, um sie zu drehen, bis die Sterne eine Katze bilden. Die kleine Vorlage oben rechts zeigt, wie es aussehen soll.',
    teaser: 'Den Sternenkreis ganz ohne Laterne ausrichten.',
  },
  intro: {
    title: 'Der Katzenwald',
    text: [
      'Hinter der Tür wächst ein Wald. Mitten in der Bibliothek. Die Bäume sind aus den Regalen gewachsen, und unter dem Glasdach hängt ein riesiger Mond.',
      'Irgendwo raschelt es. Ein paar Dinge aus den Katzengeschichten haben sich verlaufen. Finde sie – leise, auf Samtpfoten.',
    ],
  },
  note: {
    title: 'Ein Zettel von Oda',
    text: [
      'Die Sterne stehen wieder richtig! Der Sternenkreis zeigt die Katze, und der ganze Wald atmet auf.',
      'Hier ist mein letztes Zeichen: der <b>Stern</b>. Er gehört an die <b>vierte</b> und letzte Stelle – denn ein Stern führt nach Hause.',
      'Jetzt ist der Weg ins <b>Herz der Bibliothek</b> frei. Dort warte ich auf dich.',
    ],
  },
};
