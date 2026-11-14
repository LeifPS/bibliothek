import { app, h, dialog } from '../engine/ui';
import { defs, starfield, glow, C } from '../engine/svg';
import { sound } from '../engine/audio';

function facade() {
  const letters = 'Esvwaräumtß'.split('').map((ch, i) =>
    `<text x="${905 + (i % 3) * 8}" y="300" font-family="Georgia" font-style="italic" font-size="${22 + (i % 4) * 6}" fill="#ffe9a8" opacity="0">
      ${ch}<animate attributeName="y" from="300" to="${40 + (i % 5) * 20}" dur="${7 + (i % 4)}s" begin="${i * 0.9}s" repeatCount="indefinite"/>
      <animate attributeName="x" values="${905 + (i % 3) * 8};${880 + (i % 5) * 18};${930 - (i % 4) * 12}" dur="${7 + (i % 4)}s" begin="${i * 0.9}s" repeatCount="indefinite"/>
      <animate attributeName="opacity" values="0;1;0" dur="${7 + (i % 4)}s" begin="${i * 0.9}s" repeatCount="indefinite"/></text>`).join('');
  const cobbles = Array.from({ length: 70 }, (_, i) => `<ellipse cx="${(i * 97) % 1700 - 50}" cy="${880 + ((i * 53) % 120)}" rx="${26 + (i % 3) * 6}" ry="9" fill="#2a2c52" opacity=".7"/>`).join('');
  return `<svg class="facade" viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMax slice" xmlns="http://www.w3.org/2000/svg">${defs()}
  <rect width="1600" height="1000" fill="#141a4a"/>${starfield(0, 0, 1600, 600, 140, 7)}
  <circle cx="1260" cy="170" r="70" fill="url(#g-moon)"/><circle cx="1260" cy="170" r="160" fill="url(#g-glow)" opacity=".35"/>
  <!-- neighbours: tall and sleepy -->
  <path d="M0 300h560v560h-560z" fill="#1d1f4a"/><path d="M40 300l120 -120l120 120z" fill="#23255a"/>
  ${[[80, 380], [220, 380], [360, 380], [80, 540], [360, 540], [220, 700]].map(([x, y]) => `<rect x="${x}" y="${y}" width="70" height="100" rx="6" fill="#151638"/>`).join('')}
  <rect x="220" y="540" width="70" height="100" rx="6" fill="#ffcf7a" opacity=".55"/>
  <path d="M1040 260h560v600h-560z" fill="#1d1f4a"/><path d="M1040 260l140 -100h280l140 100z" fill="#23255a"/>
  ${[[1100, 330], [1260, 330], [1420, 330], [1100, 500], [1420, 500], [1260, 670]].map(([x, y]) => `<rect x="${x}" y="${y}" width="80" height="110" rx="6" fill="#151638"/>`).join('')}
  <!-- the library: much smaller than it should be -->
  <g>
    <rect x="890" y="200" width="40" height="110" fill="#5a3a3a"/><rect x="884" y="192" width="52" height="14" fill="#6e4a46"/>
    ${letters}
    <path d="M600 860v-470l200 -150l200 150v470z" fill="#6b4f9e"/>
    <path d="M590 395l210 -160l210 160" stroke="#3b2c66" stroke-width="22" fill="none" stroke-linejoin="round"/>
    <path d="M600 860v-470l200 -150l200 150v470z" fill="none" stroke="#3b2c66" stroke-width="6"/>
    ${Array.from({ length: 9 }, (_, i) => `<path d="M${615 + i * 42} ${400 + (i % 2) * 30}h30" stroke="#5c4290" stroke-width="3"/>`).join('')}
    <circle cx="800" cy="380" r="56" fill="#ffcf7a"/><circle cx="800" cy="380" r="56" fill="none" stroke="${C.wood2}" stroke-width="10"/>
    <path d="M800 324v112M744 380h112" stroke="${C.wood2}" stroke-width="6"/>${glow(800, 380, 160)}
    <rect x="650" y="470" width="80" height="110" rx="8" fill="#ffcf7a" opacity=".85"/><rect x="870" y="470" width="80" height="110" rx="8" fill="#ffcf7a" opacity=".85"/>
    ${[[650, 470], [870, 470]].map(([x, y]) => `<path d="M${x + 40} ${y}v110M${x} ${y + 55}h80" stroke="${C.wood2}" stroke-width="5"/>`).join('')}
    <!-- sign -->
    <path d="M690 610h220" stroke="#2a1a10" stroke-width="4"/><path d="M720 610v14M880 610v14" stroke="#2a1a10" stroke-width="3"/>
    <rect x="700" y="622" width="200" height="40" rx="8" fill="${C.wood2}" stroke="${C.gold}" stroke-width="3"/>
    <text x="800" y="650" text-anchor="middle" font-family="Georgia" font-size="22" letter-spacing="4" fill="${C.gold}">BIBLIOTHEK</text>
    <!-- doorway -->
    <path d="M735 860v-120a65 65 0 0 1 130 0v120z" fill="#fff3cf"/>${glow(800, 790, 220)}
    <g class="door"><path d="M735 860v-120a65 65 0 0 1 130 0v120z" fill="#2f6b4f" stroke="${C.gold}" stroke-width="4"/>
      <path d="M760 860v-110a40 40 0 0 1 80 0v110" fill="none" stroke="#24553f" stroke-width="4"/><circle cx="845" cy="800" r="7" fill="${C.gold}"/></g>
    <rect x="700" y="860" width="200" height="16" fill="#3b2c66"/>
    <!-- a tiny okapi-shaped weathervane, of course -->
    <g transform="translate(800 232) scale(.35)"><path d="M0 0v-60" stroke="#2a1a10" stroke-width="6"/><g transform="translate(-10 -90)"><path d="M-30 -2q-4 -14 10 -16h34q12 0 14 12l-2 22h-56z" fill="#2a1a10"/><path d="M18 -12q4 -26 10 -40q8 -6 16 0l4 10q-4 8 -12 6l-6 26z" fill="#2a1a10"/></g></g>
  </g>
  <!-- street -->
  <rect y="860" width="1600" height="140" fill="#1a1b40"/>${cobbles}
  <g transform="translate(470 860)"><rect x="-6" y="-300" width="12" height="300" fill="#121230"/><path d="M-26 -300h52l-8 -50h-36z" fill="#121230"/><rect x="-18" y="-344" width="36" height="40" fill="#ffcf7a" opacity=".9"/>${glow(0, -320, 170)}</g>
  </svg>`;
}

export function showTitle(hasSave: boolean): Promise<'continue' | 'new'> {
  return new Promise((resolve) => {
    sound.setMood('title');
    const el = h('div', 'title-screen', `${facade()}
      <div class="logo"><h1>Die Bibliothek der<br>träumenden Bücher</h1><p>Innen ist sie größer als außen.</p></div>
      <div class="menu"></div><div class="whiteout"></div>`);
    const menu = el.querySelector('.menu')!;
    const go = (mode: 'continue' | 'new') => {
      sound.unlock();
      sound.play('door');
      el.classList.add('entering');
      setTimeout(() => el.querySelector('.whiteout')!.classList.add('on'), 1500);
      setTimeout(() => {
        resolve(mode);
        el.querySelector('.whiteout')!.classList.remove('on');
        setTimeout(() => el.remove(), 1300);
      }, 2800);
    };
    const enter = h('button', 'btn', hasSave ? 'Weiterlesen' : 'Eintreten');
    enter.onclick = () => go(hasSave ? 'continue' : 'new');
    menu.appendChild(enter);
    if (hasSave) {
      const fresh = h('button', 'btn ghost', 'Neu beginnen');
      fresh.style.color = '#f6e8c8';
      fresh.style.borderColor = 'rgba(246,232,200,.4)';
      fresh.onclick = async () => {
        const r = await dialog({ title: 'Neu beginnen?', text: ['Alle Funde und Lesezeichen werden vergessen, und die Bücher träumen wieder von vorn.'], buttons: [{ label: 'Lieber nicht', ghost: true }, { label: 'Neu beginnen' }] });
        if (r === 1) go('new');
      };
      menu.appendChild(fresh);
    }
    app().appendChild(el);
  });
}
