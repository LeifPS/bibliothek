import type { Game } from '../game';
import { WINGS, type WingId } from '../state';
import { SCENES } from '../content/scenes';
import { ART, SEALS } from '../content/art';
import { app, h, icon, ICONS } from '../engine/ui';
import { defs, starfield, glow, C } from '../engine/svg';
import { sound } from '../engine/audio';

const POS: Record<WingId, [number, number]> = {
  halle: [600, 620], zauber: [300, 470], karten: [370, 210], katzen: [830, 210], herz: [600, 330],
};
const ICON_OF: Record<WingId, string> = { halle: 'teetasse', zauber: 'eule', karten: 'ring', katzen: 'kaetzchen', herz: 'seite_stern' };

/** The library seen from above: a floor plan that is clearly bigger than the building. */
export function showMap(game: Game, onPick: (w: WingId | 'epilogue' | null) => void) {
  const el = h('div', 'map');
  const s = game.save;
  const order: WingId[] = [...WINGS];
  const paths = order.slice(1).map((w, i) => {
    const [x1, y1] = POS[order[i]], [x2, y2] = POS[w];
    const open = game.isUnlocked(w);
    return `<path d="M${x1} ${y1}Q${(x1 + x2) / 2 + 40} ${(y1 + y2) / 2 + 40} ${x2} ${y2}" stroke="${open ? C.gold : '#4a4f9e'}" stroke-width="5" stroke-dasharray="2 14" stroke-linecap="round" fill="none" opacity="${open ? 0.9 : 0.5}"/>`;
  }).join('');
  const nodes = order.map((w) => {
    const [x, y] = POS[w];
    const open = game.isUnlocked(w);
    const done = s.wingsDone.includes(w);
    const here = game.wing === w;
    const bm = `${game.bookmarksIn(w)}/${game.totalIn(w)}`;
    return `<g class="node ${open ? '' : 'locked'}" data-w="${w}" transform="translate(${x} ${y})">
      ${here ? glow(0, 0, 150) : ''}<circle r="78" fill="${open ? '#2a2f78' : '#151638'}" stroke="${open ? C.gold : '#4a4f9e'}" stroke-width="5"/>
      ${open ? `<g transform="scale(.9)">${ART[ICON_OF[w]]}</g>` : `<g fill="#4a4f9e"><circle cy="-12" r="16"/><path d="M-8 -4h16l6 34h-28z"/></g>`}
      ${done ? `<g transform="translate(58 -58) scale(.42)"><circle r="44" fill="#9b1f2e"/>${SEALS[SCENES[w].seal]}</g>` : ''}
      <text y="112" text-anchor="middle" font-family="Cormorant Garamond, Georgia" font-weight="700" font-size="30" fill="${open ? C.cream : '#6a6fae'}">${open ? SCENES[w].title : '???'}</text>
      ${open ? `<text y="142" text-anchor="middle" font-family="Nunito, sans-serif" font-size="20" fill="${C.gold}">✦ ${bm}</text>` : ''}</g>`;
  }).join('');
  const total = s.bookmarks.length, all = game.totalAll();
  const epi = game.epilogueReady()
    ? `<g class="node" data-w="epilogue" transform="translate(600 120)">${glow(0, 0, 120)}<rect x="-40" y="-60" width="80" height="110" rx="40" fill="#ffcf7a" stroke="${C.gold}" stroke-width="5"/><path d="M0 -60v110M-40 0h80" stroke="${C.wood2}" stroke-width="5"/>
       <text y="84" text-anchor="middle" font-family="Cormorant Garamond, Georgia" font-style="italic" font-size="26" fill="${C.cream}">Das Fenster</text></g>` : '';
  el.innerHTML = `<svg viewBox="0 0 1200 800" xmlns="http://www.w3.org/2000/svg">${defs()}
    ${starfield(0, 0, 1200, 800, 90, 3)}
    <text x="600" y="60" text-anchor="middle" font-family="Cormorant Garamond, Georgia" font-weight="700" font-size="46" fill="${C.gold}">Grundriss der Bibliothek</text>
    <text x="600" y="92" text-anchor="middle" font-family="Cormorant Garamond, Georgia" font-style="italic" font-size="22" fill="${C.cream}" opacity=".7">(nicht maßstabsgetreu – das wäre auch unmöglich)</text>
    <g opacity=".35"><rect x="560" y="700" width="80" height="60" fill="#6b4f9e"/><path d="M560 700l40 -30l40 30z" fill="#6b4f9e"/><text x="600" y="785" text-anchor="middle" font-size="16" fill="${C.cream}" font-family="Nunito">das Haus von außen</text></g>
    ${paths}${nodes}${epi}
    <text x="1170" y="780" text-anchor="end" font-family="Nunito, sans-serif" font-size="22" fill="${C.gold}">Goldene Lesezeichen: ${total} / ${all}</text>
  </svg>`;
  const close = h('button', 'chip-btn close', `${icon(ICONS.close)}<span>Zurück</span>`);
  close.onclick = () => { el.remove(); onPick(null); };
  el.appendChild(close);
  el.querySelector('svg')!.addEventListener('click', (e) => {
    const n = (e.target as Element).closest('[data-w]');
    if (!n || n.classList.contains('locked')) return;
    sound.play('click');
    const w = n.getAttribute('data-w') as WingId | 'epilogue';
    el.remove();
    onPick(w === game.wing ? null : w);
  });
  app().appendChild(el);
}
