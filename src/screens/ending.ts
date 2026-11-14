import type { Game } from '../game';
import { wait } from '../game';
import { STORY } from '../content/story';
import { app, h, dialog } from '../engine/ui';
import { defs, glow, starfield, C, bookcase } from '../engine/svg';
import { sound } from '../engine/audio';

const ODA = `<g class="oda">
  <ellipse cx="0" cy="0" rx="120" ry="40" fill="url(#g-glow)"/>
  <path d="M-46 0q-6 -120 46 -150q52 30 46 150z" fill="#3e7a6f"/>
  <path d="M-46 0q20 -18 46 -8q26 -10 46 8" fill="#2f5d55"/>
  <path d="M-30 -120q30 20 60 0" stroke="${C.gold}" stroke-width="4" fill="none"/>
  <circle cx="0" cy="-172" r="30" fill="#f2d2b0"/>
  <path d="M-32 -178q0 -40 32 -40q34 0 32 40q-8 -20 -32 -22q-22 2 -32 22z" fill="#c7c2d6"/>
  <circle cx="0" cy="-214" r="14" fill="#c7c2d6"/>
  <circle cx="-11" cy="-172" r="9" fill="none" stroke="#2a1a10" stroke-width="3"/><circle cx="11" cy="-172" r="9" fill="none" stroke="#2a1a10" stroke-width="3"/>
  <path d="M-2 -172h4" stroke="#2a1a10" stroke-width="3"/><path d="M-8 -156q8 6 16 0" stroke="#8a4a3a" stroke-width="3" fill="none"/>
  <path d="M44 -90q30 -10 40 -40" stroke="#3e7a6f" stroke-width="14" stroke-linecap="round" fill="none"/>
  <g transform="translate(86 -150)"><path d="M-12 -18h24M0 -26v8" stroke="${C.gold2}" stroke-width="4"/><path d="M-14 -14h28l-4 34h-20z" fill="#ffcf7a" stroke="${C.gold2}" stroke-width="3"/>${glow(0, 0, 90)}</g>
</g>`;

export async function playFinale(game: Game) {
  const room = game.room!;
  const at = room.def.puzzle.at;
  room.panTo(at.x);
  await wait(900);
  const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  g.setAttribute('transform', `translate(${at.x} ${at.y - 40})`);
  g.innerHTML = `<g style="opacity:0;transform:translateY(60px) scale(.6);transition:all 2.4s cubic-bezier(.2,1,.3,1)">${ODA}</g>`;
  room.svg.querySelector('.main')!.appendChild(g);
  game.fx.letterTrail(at.x, at.y, at.x, at.y - 360);
  game.fx.burst(at.x, at.y - 120, 80, '#ffe39a', 260);
  sound.play('solve');
  await wait(60);
  (g.firstElementChild as SVGGElement).style.opacity = '1';
  (g.firstElementChild as SVGGElement).style.transform = 'translateY(-60px) scale(1)';
  await wait(2600);
  for (const d of STORY.finale) await dialog({ ...d, kind: 'story' });
}

export async function showEnd(game: Game): Promise<'epilogue' | 'map'> {
  const total = game.save.bookmarks.length, all = game.totalAll();
  const missed = game.missed().sort(() => Math.random() - 0.5).slice(0, 4);
  const ready = game.epilogueReady();
  const letters = ['halle', 'zauber', 'karten', 'katzen', 'herz'].filter((w) => game.save.bookmarks.includes(`${w}:brief`)).length;
  const extra = `<div class="score">✦ ${total} / ${all} ✦</div>
    <p style="text-align:center">Goldene Lesezeichen</p>
    ${missed.length ? `<p><b>Noch nicht entdeckt, zum Beispiel:</b></p><ul class="endlist">${missed.map((m) => `<li>${m}</li>`).join('')}</ul>` : '<p>Du hast <b>alles</b> gefunden. Wirklich alles. Das Okapi ist beeindruckt.</p>'}
    ${ready ? '<p><b>Irgendwo in der Bibliothek leuchtet jetzt ein Fenster, das vorher nicht da war …</b></p>'
      : `<p style="font-size:15px;opacity:.75">Man munkelt, wer alle fünf Briefe ohne Absender (${letters}/5) und mindestens 20 Lesezeichen findet, entdeckt ein Fenster, das es eigentlich nicht geben dürfte.</p>`}`;
  const r = await dialog({
    title: 'Das Buch hat wieder ein Ende',
    text: ['Alle Geschichten schlafen wieder ruhig. Du kannst jederzeit über die <b>Karte</b> in jeden Raum zurückkehren und weiter stöbern.'],
    extraHtml: extra,
    buttons: ready ? [{ label: 'Weiter erkunden', ghost: true }, { label: 'Das Fenster öffnen' }] : [{ label: 'Weiter erkunden' }],
  });
  return ready && r === 1 ? 'epilogue' : 'map';
}

function bedroom() {
  return `<svg viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" style="position:absolute;inset:0;width:100%;height:100%">${defs()}
  <rect width="1600" height="1000" fill="#151a45"/>
  <g transform="translate(1180 120)"><rect width="300" height="380" rx="10" fill="#22306e"/>${starfield(0, 0, 300, 380, 40, 9)}<circle cx="200" cy="100" r="40" fill="url(#g-moon)"/><path d="M150 0v380M0 190h300" stroke="#3b2c66" stroke-width="12"/><rect width="300" height="380" rx="10" fill="none" stroke="#3b2c66" stroke-width="14"/></g>
  ${bookcase(80, 160, 300, 520, 77, { rows: 4 })}
  <rect y="760" width="1600" height="240" fill="#1d1640"/>
  <!-- blanket tent -->
  <path d="M260 900Q420 330 800 300Q1180 330 1340 900z" fill="#6b4f9e"/>
  <path d="M260 900Q420 330 800 300Q1180 330 1340 900" fill="none" stroke="#8a6fd1" stroke-width="10"/>
  ${[0, 1, 2, 3, 4, 5].map((i) => `<circle cx="${430 + i * 150}" cy="${560 + (i % 2) * 120}" r="18" fill="#f3c969" opacity=".5"/>`).join('')}
  <path d="M520 900Q600 520 800 500Q1000 520 1080 900z" fill="#2a1d4a"/>
  ${glow(800, 700, 420)}
  <!-- the reader -->
  <g transform="translate(800 690)">
    <path d="M-150 210q10 -150 150 -160q140 10 150 160z" fill="#e58aa0"/>
    <circle cx="0" cy="-30" r="80" fill="#f2d2b0"/>
    <path d="M-84 -40q-6 -90 84 -96q92 6 84 96q-20 -50 -84 -54q-60 4 -84 54z" fill="#5a3418"/>
    <path d="M-34 -24q12 8 24 0M10 -24q12 8 24 0" stroke="#2a1a10" stroke-width="5" fill="none" stroke-linecap="round"/>
    <path d="M-14 12q14 12 28 0" stroke="#8a4a3a" stroke-width="5" fill="none" stroke-linecap="round"/>
    <circle cx="-48" cy="4" r="12" fill="#f0a0a0" opacity=".5"/><circle cx="48" cy="4" r="12" fill="#f0a0a0" opacity=".5"/>
    <!-- the open book; its pages hold the tiny library -->
    <g transform="translate(0 120)">
      <path d="M-170 0q85 -30 170 0q85 -30 170 0v120q-85 -30 -170 0q-85 -30 -170 0z" fill="#fbf3dc" stroke="#c9b48a" stroke-width="4"/>
      <path d="M0 0v120" stroke="#c9b48a" stroke-width="4"/>
      <g class="tinylib" transform="translate(-85 70) scale(.11)">
        <path d="M-200 300v-470l200 -150l200 150v470z" fill="#6b4f9e"/><circle cy="-170" r="56" fill="#ffcf7a"/>
        <path d="M-65 300v-120a65 65 0 0 1 130 0v120z" fill="#fff3cf"/>
      </g>
      <g transform="translate(85 64) scale(.24)">${[0, 1, 2, 3, 4, 5, 6].map((i) => `<rect x="${-120 + i * 34}" y="${-60 - (i % 3) * 10}" width="26" height="${110 + (i % 3) * 10}" fill="${['#8c2f39', '#2f5d62', '#6b4f9e', '#c7883a'][i % 4]}"/>`).join('')}<circle cx="0" cy="-130" r="40" fill="url(#g-glow)"/></g>
    </g>
    <!-- hands and a flashlight -->
    <circle cx="-180" cy="150" r="24" fill="#f2d2b0"/><circle cx="180" cy="150" r="24" fill="#f2d2b0"/>
    <g transform="translate(240 40) rotate(-40)"><rect x="-14" y="0" width="28" height="80" rx="8" fill="#3f6d9a"/><rect x="-20" y="-16" width="40" height="22" rx="6" fill="#8fb6e0"/></g>
    <path d="M226 26L40 120L170 210z" fill="#fff6c8" opacity=".25"/>
  </g>
  <g transform="translate(470 860)" opacity=".9">${OKAPI_SMALL}</g>
  </svg>`;
}
const OKAPI_SMALL = `<g transform="scale(.6)"><path d="M-30 -2q-4 -14 10 -16h34q12 0 14 12l-2 22h-56z" fill="#5a2e22"/><path d="M18 -12q4 -26 10 -40q8 -6 16 0l4 10q-4 8 -12 6l-6 26z" fill="#5a2e22"/>${[-28, -6, 8, 26].map((x) => `<g transform="translate(${x} 16)"><rect x="-3" y="0" width="7" height="30" fill="#f0e3cf"/><rect x="-3" y="8" width="7" height="3" fill="#3a1c14"/><rect x="-3" y="18" width="7" height="3" fill="#3a1c14"/></g>`).join('')}</g>`;

/** The secret epilogue: zoom out of the book and find the reader. */
export async function playEpilogue() {
  sound.setMood('heart');
  const el = h('div', 'title-screen', bedroom());
  const svg = el.querySelector('svg')!;
  svg.style.transformOrigin = '44.7% 88%';
  svg.style.transform = 'scale(14)';
  svg.style.transition = 'transform 7s cubic-bezier(.5,0,.2,1)';
  app().appendChild(el);
  await wait(400);
  svg.style.transform = 'scale(1)';
  await wait(6500);
  for (const d of STORY.epilogue) await dialog({ ...d, kind: 'story' });
  el.style.transition = 'opacity 1.5s';
  el.style.opacity = '0';
  await wait(1500);
  el.remove();
}
