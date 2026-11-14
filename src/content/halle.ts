import type { SceneDef } from './types';
import { wall, floor, rug, bookcase, archWindow, ray, pillar, lamp, readingLamp, table, plant, bookStack, ladder, garland, glow, C } from '../engine/svg';

const W = 3600;

function fountain(x: number, base: number) {
  let streams = '';
  for (let i = -2; i <= 2; i++)
    streams += `<path class="waterflow" d="M${x + i * 12} ${base - 70}C${x + i * 30} ${base - 300} ${x - i * 20} ${base - 480} ${x + i * 8} ${base - 610}" stroke="#bdf2ff" stroke-opacity="${0.5 + (2 - Math.abs(i)) * 0.18}" stroke-width="${8 - Math.abs(i) * 2}" fill="none" stroke-linecap="round" style="animation-delay:${i * 0.17}s"/>`;
  return `<g>
    ${glow(x, base - 300, 360, 'teal')}
    <path d="M${x - 14} ${base - 70}C${x - 30} ${base - 300} ${x - 10} ${base - 470} ${x - 10} ${base - 610}h20C${x + 10} ${base - 470} ${x + 30} ${base - 300} ${x + 14} ${base - 70}z" fill="url(#g-water)" opacity=".7"/>
    ${streams}
    <!-- the little cloud that catches the water -->
    <g class="bob"><ellipse cx="${x}" cy="${base - 630}" rx="110" ry="40" fill="#e9f6ff" opacity=".9"/><circle cx="${x - 60}" cy="${base - 650}" r="40" fill="#f4fbff"/><circle cx="${x + 10}" cy="${base - 670}" r="52" fill="#f4fbff"/><circle cx="${x + 70}" cy="${base - 645}" r="36" fill="#f4fbff"/>
      <circle cx="${x - 20}" cy="${base - 640}" r="4" fill="#9fe8ff" class="twinkle"/><circle cx="${x + 40}" cy="${base - 650}" r="3" fill="#9fe8ff" class="twinkle" style="animation-delay:-1s"/></g>
    <ellipse cx="${x}" cy="${base - 20}" rx="190" ry="44" fill="#6a6f8e"/><ellipse cx="${x}" cy="${base - 30}" rx="170" ry="34" fill="#4ab0c8"/><ellipse cx="${x}" cy="${base - 34}" rx="150" ry="26" fill="#7fd8ea" opacity=".7"/>
    <path d="M${x - 190} ${base - 20}v26q190 46 380 0v-26" fill="#55597a"/>
    <rect x="${x - 26}" y="${base - 80}" width="52" height="56" rx="8" fill="#7a7f9e"/><ellipse cx="${x}" cy="${base - 80}" rx="40" ry="12" fill="#8a8fae"/>
  </g>`;
}

function entrance(x: number) {
  return `<g>
    <path d="M${x} 820v-260a90 90 0 0 1 180 0v260z" fill="${C.wood1}" stroke="${C.wood3}" stroke-width="10"/>
    <path d="M${x + 20} 820v-250a70 70 0 0 1 140 0v250z" fill="#2f6b4f"/><circle cx="${x + 140}" cy="700" r="8" fill="${C.gold}"/>
    <!-- a little window beside the door shows the library from OUTSIDE -->
    <g transform="translate(${x + 230} 420)"><circle r="62" fill="#1d2a6a" stroke="${C.wood3}" stroke-width="10"/>
      <clipPath id="facadeclip"><circle r="56"/></clipPath><g clip-path="url(#facadeclip)">
        <rect x="-60" y="-60" width="120" height="120" fill="#22306e"/><circle cx="30" cy="-30" r="8" fill="url(#g-moon)"/>
        <rect x="-60" y="16" width="26" height="60" fill="#151638"/><rect x="36" y="6" width="30" height="70" fill="#151638"/>
        <path d="M-22 40v-34l22 -16l22 16v34z" fill="#6b4f9e"/><circle cx="0" cy="4" r="5" fill="#ffcf7a"/><rect x="-5" y="28" width="10" height="12" fill="#fff3cf"/>
        <rect x="-60" y="40" width="120" height="20" fill="#1a1b40"/></g></g>
  </g>`;
}

function lectern(x: number, base: number) {
  return `<g><path d="M${x - 20} ${base}h40l-8 -150h-24z" fill="${C.wood2}"/><rect x="${x - 60}" y="${base - 6}" width="120" height="12" rx="4" fill="${C.wood1}"/>
    <g class="breathe"><path d="M${x - 110} ${base - 150}q55 -30 110 -6q55 -24 110 6l-14 34q-48 -16 -96 4q-48 -20 -96 -4z" fill="#fbf3dc" stroke="#c9b48a" stroke-width="3"/>
    <path d="M${x - 100} ${base - 150}h80M${x - 96} ${base - 140}h70M${x + 20} ${base - 150}h80M${x + 26} ${base - 140}h66" stroke="#b8a98a" stroke-width="2"/>
    <path d="M${x - 114} ${base - 118}q57 -24 114 6q57 -30 114 -6v10q-57 -20 -114 8q-57 -28 -114 -8z" fill="#7a2f43"/></g>
    <text x="${x + 60}" y="${base - 190}" font-family="Georgia" font-style="italic" font-size="26" fill="${C.cream}" opacity=".7" class="twinkle">z</text>
    <text x="${x + 80}" y="${base - 220}" font-family="Georgia" font-style="italic" font-size="20" fill="${C.cream}" opacity=".6" class="twinkle" style="animation-delay:-1s">z</text></g>`;
}

function ribbonDesk(x: number) {
  const ribbons = ['#c43c5a', '#3f8fb6', '#e0a43a', '#6b4f9e', '#3e9a6f'];
  return `${table(x - 130, 680, 260)}<g transform="translate(${x} 670)">
    <rect x="-60" y="-24" width="120" height="24" rx="3" fill="#355c8c"/><rect x="-56" y="-30" width="112" height="8" fill="#fbf3dc"/>
    ${ribbons.map((c, i) => `<path d="M${-40 + i * 20} -26c${30 - i * 14} -40 ${-60 + i * 30} -10 ${-10 + i * 8} 20s${40 - i * 20} 40 ${-20 + i * 14} 70" stroke="${c}" stroke-width="7" fill="none" stroke-linecap="round"/>`).join('')}
    <circle cx="-4" cy="-6" r="16" fill="none" stroke="#c43c5a" stroke-width="6"/></g>`;
}

const far = `${wall(W, '#2b1f4a', '#3a2440', 1)}
  ${[200, 1050, 1580, 2250, 3050].map((x) => archWindow(x, 60, 160, 420, '#1d3474')).join('')}
  <g opacity=".55">${[-500, 420, 1250, 1900, 2600, 3300].map((x, i) => bookcase(x, 120, 520, 600, 300 + i, { rows: 5 })).join('')}</g>
  <rect x="-800" y="0" width="${W + 1600}" height="1000" fill="#160c2a" opacity=".45"/>
  ${[200, 1050, 1580, 2250, 3050].map((x) => ray(x, 80, 160, x - 160, 900, 420)).join('')}`;

const main = `
  ${floor(W)}
  ${rug(1700, 880, 900, '#5a2a4a')}${rug(2900, 900, 600, '#2f4f6a')}
  ${entrance(40)}
  ${bookcase(420, 150, 560, 650, 11, { rows: 5, trinkets: 0.08 })}
  ${pillar(1040)}
  ${bookcase(1160, 140, 300, 660, 12, { rows: 5, arch: true })}
  ${fountain(1700, 800)}
  ${bookcase(1960, 140, 300, 660, 13, { rows: 5, arch: true })}
  ${pillar(2300)}
  ${lectern(2620, 800)}
  ${bookcase(2800, 150, 520, 650, 14, { rows: 5, trinkets: 0.08, breathe: 0.05 })}
  ${pillar(3360)}
  ${bookcase(3460, 150, 240, 650, 15, { rows: 5 })}
  ${ribbonDesk(3420 - 220)}
  ${ladder(1200, 140)}
  ${table(250, 740, 200)}${bookStack(270, 740, 4, 5)}
  ${table(2140, 720, 240)}${readingLamp(2150, 720)}${bookStack(2270, 720, 3, 6)}
  ${plant(1980, 820, 1.1)}${plant(960, 820, 0.9)}${plant(3340, 820, 0.8)}
  ${[600, 1450, 2000, 2700, 3250].map((x, i) => lamp(x, 70 + (i % 2) * 40)).join('')}
  ${garland(1060, 2330, 40, 30, 4)}
`;

const over = `
  <g transform="translate(2040 830)">${[-40, -10, 25, 55].map((a, i) => `<path class="sway" style="animation-delay:${-i}s" d="M0 0q${-30 + i * 20} -80 ${Math.sin((a * Math.PI) / 180) * 120} -150q-14 70 0 150" fill="${i % 2 ? '#4f7f42' : '#6aa255'}"/>`).join('')}</g>
  ${bookStack(3050, 820, 5, 9)}
`;

const fore = `
  <g fill="#0a0618" opacity=".85" filter="url(#f-blur)">
    <path d="M-200 1000q60 -220 200 -260q-40 120 30 260z"/><path d="M-120 1000q120 -160 260 -170q-80 80 -60 170z"/>
    <path d="M2200 1000q30 -200 160 -240q-30 120 20 240z"/><path d="M2280 1000q90 -120 220 -140q-60 60 -40 140z"/>
    <path d="M4200 1000q60 -220 200 -260q-40 120 30 260z"/>
  </g>`;

export const HALLE: SceneDef = {
  id: 'halle',
  title: 'Der große Lesesaal',
  width: W,
  far, main, over, fore,
  ambience: 'hall',
  seal: 'feder',
  emitters: [
    { kind: 'fountain', x: 1700, y: 730 },
    { kind: 'motes', x: 0, y: 100, w: W, h: 700 },
    { kind: 'letters', x: 2560, y: 620, w: 120, h: 20 },
  ],
  wanderers: [
    { id: 'teetasse', name: 'die Teetasse', at: { x: 330, y: 700 }, home: { x: 3000, y: 300 }, scale: 0.55, homeColor: '#6b4f9e', line: 'Klirr! Sie ist zurück bei der Teegesellschaft, wo es immer sechs Uhr ist.' },
    { id: 'taschenuhr', name: 'die Taschenuhr', at: { x: 1236, y: 470 }, home: { x: 560, y: 300 }, scale: 0.45, rot: -15, homeColor: '#b5543c', line: 'Tick, tack. Ein gewisses Kaninchen wird erleichtert sein – es war schon wieder spät dran.' },
    { id: 'rose', name: 'die Rose', at: { x: 2330, y: 680 }, home: { x: 1300, y: 300 }, scale: 0.5, homeColor: '#355c8c', line: 'Die Rose unter ihrer Glasglocke ist wieder auf ihrem kleinen Planeten. Sie hat ihn vermisst.' },
    { id: 'kompass', name: 'der Kompass', at: { x: 3500, y: 790 }, home: { x: 2110, y: 430 }, scale: 0.42, homeColor: '#2f5d62', line: 'Der Kompass zeigt wieder nach Norden. Meistens jedenfalls.' },
    { id: 'papierschiff', name: 'das Papierschiff', at: { x: 1640, y: 755 }, home: { x: 3520, y: 430 }, scale: 0.5, homeColor: '#5b6c8f', line: 'Das Papierschiff segelt zurück in seine Geschichte. Es war nur kurz baden – im Brunnen, der nach oben fließt.' },
    { id: 'glasschuh', name: 'der Glasschuh', at: { x: 2240, y: 800 }, home: { x: 700, y: 560 }, scale: 0.42, rot: 8, homeColor: '#7a3b5e', line: 'Der gläserne Schuh ist wieder zu Hause. Lange vor Mitternacht – ausnahmsweise.' },
  ],
  secrets: [
    { id: 'okapi', kind: 'okapi', at: { x: 2100, y: 772 }, r: 50, scale: 0.6, title: 'Ein Okapi?!', text: 'Es steht ganz ruhig hinter der Pflanze, als hätte es schon immer hier gestanden. Vielleicht hat es das.', teaser: 'Im Lesesaal steht jemand mit gestreiften Beinen ganz ruhig hinter etwas Grünem.' },
    { id: 'brief', kind: 'brief', at: { x: 1388, y: 512 }, r: 40, scale: 0.45, title: 'Wer bist du?', text: 'Nur diese eine Frage, mit Tinte geschrieben. Kein Absender. Merkwürdig – sie lässt dich nicht mehr los.', teaser: 'Zwischen den Büchern neben dem Brunnen steckt ein Umschlag ohne Absender.' },
    { id: 'brunnen', kind: 'oddity', at: { x: 1700, y: 560 }, r: 110, title: 'Ein Brunnen, der nach oben fließt', text: 'Das Wasser plätschert fröhlich nach oben in eine kleine Wolke. Die Wolke wirkt sehr zufrieden.', teaser: 'Schon gewundert, wohin das Wasser im Lesesaal eigentlich fließt?' },
    { id: 'fenster', kind: 'oddity', at: { x: 270, y: 420 }, r: 70, title: 'Ein Fenster nach draußen', text: 'Durch das runde Fenster siehst du die Bibliothek – von außen. Sie ist winzig. Und trotzdem stehst du mittendrin.', teaser: 'Neben der Eingangstür gibt es ein Fenster, durch das man etwas Unmögliches sieht.' },
    { id: 'atembuch', kind: 'oddity', at: { x: 2620, y: 640 }, r: 90, title: 'Ein atmendes Buch', text: 'Das große Buch auf dem Lesepult hebt und senkt sich, ganz langsam. Es schläft. Es träumt bestimmt gerade.', teaser: 'Auf einem Lesepult im Lesesaal schläft etwas – hast du es gehört?' },
  ],
  puzzle: {
    kind: 'untangle', at: { x: 3200, y: 640 }, art: '',
    title: 'Der Lesebändchen-Knoten',
    intro: 'Die Lesebändchen haben sich im Schlaf verheddert. Ziehe die goldenen Knöpfe so, dass sich keine Bänder mehr kreuzen.',
    teaser: 'Den Lesebändchen-Knoten ganz ohne Laterne lösen.',
  },
  intro: {
    title: 'Der große Lesesaal',
    text: [
      'Die Tür fällt leise hinter dir ins Schloss. Von außen sah die Bibliothek aus wie ein kleines Haus. Von innen … nun ja.',
      '<b>Sechs Dinge</b> sind aus ihren Geschichten gewandert. Unten siehst du, welche. Finde sie, tippe sie an – und folge ihnen nach Hause.',
    ],
  },
  note: {
    title: 'Ein Zettel von Oda',
    text: [
      'Du hast die Lesebändchen entknotet! Der Lesesaal schläft wieder ruhig.',
      'Hier ist mein erstes Zeichen für dich: die <b>Feder</b>. Merk sie dir gut. Jede Geschichte beginnt mit einer Feder – also gehört sie an den <b>Anfang</b>.',
      'Ich bin übrigens weiter hinten in der Bibliothek. Viel weiter hinten.',
    ],
  },
};
