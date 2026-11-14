import { canSpeak, speak, stopSpeaking } from './speech';
import { sound } from './audio';
import { defs } from './svg';

export const app = () => document.getElementById('app')!;

export function h<K extends keyof HTMLElementTagNameMap>(tag: K, cls = '', html = ''): HTMLElementTagNameMap[K] {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (html) e.innerHTML = html;
  return e;
}

/** A small standalone svg (for icons in HTML UI). */
export function icon(inner: string, vb = '-50 -50 100 100') {
  return `<svg viewBox="${vb}" xmlns="http://www.w3.org/2000/svg">${inner}</svg>`;
}

/** One hidden svg with shared defs so HTML icons can use the gradients. */
export function installDefs() {
  const d = h('div');
  d.style.cssText = 'position:absolute;width:0;height:0;overflow:hidden';
  d.innerHTML = `<svg width="0" height="0">${defs()}</svg>`;
  document.body.appendChild(d);
}

export const ICONS = {
  map: `<path d="M-38 -26l24 -8l28 8l24 -8v60l-24 8l-28 -8l-24 8z" fill="none" stroke="currentColor" stroke-width="6" stroke-linejoin="round"/><path d="M-14 -34v60M14 -26v60" stroke="currentColor" stroke-width="5"/>`,
  lantern: `<circle cx="0" cy="-40" r="8" fill="none" stroke="currentColor" stroke-width="5"/><path d="M-18 -30h36l-4 -2h-28z" fill="currentColor" stroke="currentColor" stroke-width="5" stroke-linejoin="round"/><path d="M-20 -26q-6 26 0 52h40q6 -26 0 -52z" fill="rgba(255,207,122,.25)" stroke="currentColor" stroke-width="5" stroke-linejoin="round"/><path d="M0 -14q-12 16 0 30q12 -14 0 -30z" fill="#ffcf7a"/><path d="M-24 30h48" stroke="currentColor" stroke-width="7" stroke-linecap="round"/>`,
  soundOn: `<path d="M-30 -12h14l18 -18v60l-18 -18h-14z" fill="currentColor"/><path d="M14 -16q12 16 0 32M24 -26q22 26 0 52" stroke="currentColor" stroke-width="5" fill="none" stroke-linecap="round"/>`,
  soundOff: `<path d="M-30 -12h14l18 -18v60l-18 -18h-14z" fill="currentColor"/><path d="M14 -12l22 24M36 -12l-22 24" stroke="currentColor" stroke-width="5" stroke-linecap="round"/>`,
  bookmark: `<path d="M-16 -38h32v76l-16 -14l-16 14z" fill="url(#g-gold)" stroke="#a86f22" stroke-width="3"/><circle cx="0" cy="-14" r="6" fill="#fff6c8"/>`,
  close: `<path d="M-20 -20l40 40M20 -20l-40 40" stroke="currentColor" stroke-width="7" stroke-linecap="round"/>`,
  arrowL: `<path d="M18 -36l-34 36l34 36" stroke="#f6e8c8" stroke-width="8" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`,
  arrowR: `<path d="M-18 -36l34 36l-34 36" stroke="#f6e8c8" stroke-width="8" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`,
};

export interface DialogOpts {
  title: string;
  text: string[];
  sig?: string;
  seal?: string;          // svg inner markup
  kind?: 'note' | 'letter' | 'story';
  question?: string;      // big centred question for Sofie letters
  buttons?: { label: string; ghost?: boolean }[];
  extraHtml?: string;
}

/** Show a parchment card. Resolves with the index of the pressed button. */
export function dialog(o: DialogOpts): Promise<number> {
  return new Promise((resolve) => {
    sound.play('page');
    const ov = h('div', 'overlay');
    const card = h('div', `card ${o.kind ?? ''}`);
    const read = [o.title, o.question ?? '', ...o.text, o.sig ?? ''].join('. ');
    card.innerHTML = `${o.seal ? `<svg class="seal" viewBox="-50 -50 100 100"><circle r="44" fill="#9b1f2e"/><circle r="36" fill="none" stroke="#c9485a" stroke-width="3"/><g transform="scale(.9)">${o.seal}</g></svg>` : ''}
      <h2>${o.title}</h2>${o.question ? `<div class="question">${o.question}</div>` : ''}
      ${o.text.map((t) => `<p>${t}</p>`).join('')}${o.sig ? `<p class="sig">${o.sig}</p>` : ''}${o.extraHtml ?? ''}`;
    const actions = h('div', 'actions');
    if (canSpeak()) {
      const rb = h('button', 'btn read', 'Vorlesen');
      rb.onclick = () => speak(read.replace(/<[^>]+>/g, ''));
      actions.appendChild(rb);
    }
    (o.buttons ?? [{ label: 'Weiter' }]).forEach((b, i) => {
      const btn = h('button', `btn ${b.ghost ? 'ghost' : ''}`, b.label);
      btn.onclick = () => {
        stopSpeaking();
        sound.play('click');
        ov.remove();
        resolve(i);
      };
      actions.appendChild(btn);
    });
    card.appendChild(actions);
    ov.appendChild(card);
    app().appendChild(ov);
    (actions.querySelector('.btn:not(.read)') as HTMLButtonElement | null)?.focus();
  });
}

let toastEl: HTMLElement | null = null;
let toastTimer = 0;
/** Short, non-blocking message (oddities, bookmarks). */
export function toast(title: string, text: string, art: string) {
  toastEl?.remove();
  clearTimeout(toastTimer);
  const t = h('div', 'toast', `${icon(art)}<div><b>${title}</b><span>${text}</span></div>`);
  app().appendChild(t);
  toastEl = t;
  const close = () => { t.classList.add('out'); setTimeout(() => t.remove(), 500); };
  t.onclick = close;
  toastTimer = window.setTimeout(close, Math.max(4200, text.length * 65));
}
