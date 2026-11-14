import { WINGS, type WingId, type Save, loadSave, persist, freshSave, addBookmark, isUnlocked, epilogueUnlocked } from './state';
import type { SceneDef, SecretDef, WandererDef } from './content/types';
import { SCENES } from './content/scenes';
import { ART, SEALS } from './content/art';
import { STORY } from './content/story';
import { Room } from './engine/room';
import { FX } from './engine/fx';
import { sound } from './engine/audio';
import { app, h, icon, ICONS, dialog, toast } from './engine/ui';
import { openPuzzle } from './puzzles/ui';
import { showTitle } from './screens/title';
import { showMap } from './screens/map';
import { playFinale, showEnd, playEpilogue } from './screens/ending';

export class Game {
  save: Save = loadSave();
  fx!: FX;
  room: Room | null = null;
  wing: WingId = 'halle';
  private hud!: HTMLElement;
  private tray!: HTMLElement;
  private edgeL!: HTMLButtonElement;
  private edgeR!: HTMLButtonElement;
  private bmCounter!: HTMLElement;
  private last = performance.now();
  private busy = false; // a modal flow is running

  async start() {
    const stage = h('div', 'stage');
    app().appendChild(stage);
    this.fx = new FX(app());
    this.hud = h('div', 'hud');
    app().appendChild(this.hud);
    addEventListener('resize', () => this.room?.resize());
    addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') this.room?.panBy(-300);
      if (e.key === 'ArrowRight') this.room?.panBy(300);
    });
    requestAnimationFrame(this.loop);
    const hasSave = this.save.found.length > 0 || this.save.introSeen;
    const mode = await showTitle(hasSave);
    if (mode === 'new') { this.save = freshSave(); persist(this.save); }
    sound.setEnabled(this.save.sound);
    const target = WINGS.filter((w) => isUnlocked(this.save, w) && !this.save.wingsDone.includes(w))[0] ?? 'halle';
    await this.enter(target, true);
  }

  private loop = (t: number) => {
    const dt = Math.min(0.05, (t - this.last) / 1000);
    this.last = t;
    if (this.room) {
      this.room.update(dt);
      this.edgeL.classList.toggle('hidden', !this.room.canLeft);
      this.edgeR.classList.toggle('hidden', !this.room.canRight);
      this.edgeL.classList.toggle('calling', this.room.waitingDir < 0);
      this.edgeR.classList.toggle('calling', this.room.waitingDir > 0);
    }
    this.fx.frame(dt, this.room?.camInfo ?? { x: 0, scale: innerHeight / 1000, top: 0 });
    requestAnimationFrame(this.loop);
  };

  private def(): SceneDef { return SCENES[this.wing]; }
  private foundIn(w: WingId) { return new Set(this.save.found.filter((f) => f.startsWith(w + ':')).map((f) => f.slice(w.length + 1))); }
  private secretsIn(w: WingId) { return new Set(this.save.bookmarks.filter((f) => f.startsWith(w + ':')).map((f) => f.slice(w.length + 1))); }
  bookmarksIn(w: WingId) { return this.secretsIn(w).size; }
  totalIn(w: WingId) { return SCENES[w].secrets.length + 1; }
  totalAll() { return WINGS.reduce((n, w) => n + this.totalIn(w), 0); }

  async enter(w: WingId, fromTitle = false) {
    this.wing = w;
    const def = this.def();
    this.room?.destroy();
    this.fx.clear();
    const found = this.foundIn(w);
    const startCam = fromTitle && w === 'halle' && !this.save.introSeen ? def.width / 2 : 0;
    this.room = new Room(def, found, this.secretsIn(w), this.save.puzzlesSolved.includes(w), this.fx, {
      onWake: (d) => this.onWake(d),
      onArrive: (d) => this.onArrive(d),
      onSecret: (d, first) => this.onSecret(d, first),
      onPuzzle: () => this.onPuzzle(),
      onBusy: () => {
        const t = def.wanderers.find((x) => x.id === this.room?.travelling);
        if (t) toast('Eins nach dem anderen', `${cap(t.name)} wartet noch darauf, dass du ${pronoun(t.name)} nach Hause begleitest.`, ART[t.id]);
      },
    }, startCam);
    app().querySelector('.stage')!.replaceChildren(this.room.el);
    this.fx.setEmitters(def.emitters ?? []);
    sound.setMood(def.ambience ?? 'hall');
    this.buildHud();
    if (startCam) setTimeout(() => this.room?.panTo(0), 900);
    if (!this.save.wingsDone.includes(w)) void this.checkComplete();

    if (fromTitle && !this.save.introSeen) {
      await wait(1600);
      await dialog({ ...STORY.welcome, kind: 'note' });
      this.save.introSeen = true;
      persist(this.save);
    }
    if (found.size === 0 && !this.save.wingsDone.includes(w)) {
      await wait(400);
      await dialog({ ...def.intro, kind: 'story' });
    }
  }

  private buildHud() {
    const def = this.def();
    this.hud.innerHTML = '';
    const top = h('div', 'topbar');
    const mapBtn = h('button', 'chip-btn', `${icon(ICONS.map)}<span>Karte</span>`);
    mapBtn.onclick = () => this.openMap();
    const title = h('div', 'room-title', def.title);
    this.bmCounter = h('button', 'chip-btn bm-counter', '');
    this.bmCounter.title = 'Goldene Lesezeichen';
    this.bmCounter.onclick = () => toast('Goldene Lesezeichen', 'Sie sind nicht nötig, um weiterzukommen – aber wer genau hinsieht, findet Okapis, Briefe, Merkwürdigkeiten … und löst Rätsel ohne Laterne.', ICONS.bookmark);
    const hint = h('button', 'chip-btn icon', icon(ICONS.lantern));
    hint.title = 'Laterne (Hinweis)';
    hint.onclick = () => { sound.play('hint'); this.room?.hint(); };
    const snd = h('button', 'chip-btn icon', icon(this.save.sound ? ICONS.soundOn : ICONS.soundOff));
    snd.title = 'Ton';
    snd.onclick = () => {
      sound.unlock();
      this.save.sound = !this.save.sound;
      sound.setEnabled(this.save.sound);
      snd.innerHTML = icon(this.save.sound ? ICONS.soundOn : ICONS.soundOff);
      persist(this.save);
    };
    top.append(mapBtn, title, h('div', 'spacer'), this.bmCounter, hint, snd);
    const lgh = (window as unknown as { LGH?: { oeffnen(): void } }).LGH;
    if (lgh) {
      const gear = h('button', 'chip-btn icon', icon(ICONS.gear));
      gear.title = 'Einstellungen und Spielstand-Code';
      gear.onclick = () => lgh.oeffnen();
      top.append(gear);
    }
    this.tray = h('div', 'tray');
    const found = this.foundIn(this.wing);
    for (const w of def.wanderers) {
      const it = h('div', `item ${found.has(w.id) ? 'done' : ''}`, `${icon(ART[w.id])}<span>${cap(w.name.replace(/^(der|die|das) /, ''))}</span>`);
      it.dataset.id = w.id;
      this.tray.appendChild(it);
    }
    this.edgeL = h('button', 'edge left', icon(ICONS.arrowL));
    this.edgeR = h('button', 'edge right', icon(ICONS.arrowR));
    this.edgeL.onclick = () => this.room?.panBy(-(this.room.viewW * 0.6));
    this.edgeR.onclick = () => this.room?.panBy(this.room.viewW * 0.6);
    this.hud.append(top, this.tray, this.edgeL, this.edgeR);
    this.updateCounter();
  }

  private updateCounter(bump = false) {
    this.bmCounter.innerHTML = `${icon(ICONS.bookmark)}<span>${this.bookmarksIn(this.wing)}/${this.totalIn(this.wing)}</span>`;
    if (bump) { this.bmCounter.classList.remove('bump'); void this.bmCounter.offsetWidth; this.bmCounter.classList.add('bump'); }
  }

  private trayItem(id: string) { return this.tray.querySelector(`[data-id="${id}"]`) as HTMLElement | null; }

  private onWake(d: WandererDef) {
    this.trayItem(d.id)?.classList.add('travel');
    if (!this.save.found.length && this.wing === 'halle') {
      toast('Folge ihm!', 'Wische, ziehe oder nutze die Pfeile am Rand, um dich im Raum umzusehen. Der Wanderer wartet auf dich.', ART[d.id]);
    }
  }

  private onArrive(d: WandererDef) {
    const it = this.trayItem(d.id);
    it?.classList.remove('travel');
    it?.classList.add('done');
    const key = `${this.wing}:${d.id}`;
    if (!this.save.found.includes(key)) this.save.found.push(key);
    persist(this.save);
    toast(cap(d.name) + ' ist zu Hause', d.line, ART[d.id]);
    this.checkComplete();
  }

  private gainBookmark(id: string): boolean {
    const added = addBookmark(this.save, `${this.wing}:${id}`);
    if (added) { persist(this.save); sound.play('bookmark'); this.updateCounter(true); }
    return added;
  }

  private async onSecret(d: SecretDef, _first: boolean) {
    const fresh = this.gainBookmark(d.id);
    if (d.kind === 'brief') {
      await dialog({ kind: 'letter', title: 'Ein Brief ohne Absender', question: d.title, text: [d.text], extraHtml: fresh ? '<p style="text-align:center;color:#8a5a1a"><b>✦ Goldenes Lesezeichen ✦</b></p>' : '' });
      return;
    }
    toast(d.title, d.text + (fresh ? ' ✦ Goldenes Lesezeichen!' : ''), d.kind === 'okapi' ? ART.okapi : ICONS.bookmark);
  }

  private onPuzzle() {
    const def = this.def();
    const was = this.save.puzzlesSolved.includes(this.wing);
    const missing = def.wanderers.filter((w) => !this.save.found.includes(`${this.wing}:${w.id}`));
    if (this.wing === 'herz' && missing.length) {
      toast('Es fehlen noch Seiten', `Das Buch ohne Ende kann erst geordnet werden, wenn alle vier Seiten zurück sind. Noch ${missing.length} unterwegs.`, ART[missing[0].id]);
      return;
    }
    openPuzzle(def.puzzle.kind, {
      title: def.puzzle.title,
      intro: def.puzzle.intro + (was ? ' (Schon gelöst – aber du kannst es noch einmal versuchen. Ohne Laterne gibt es ein Lesezeichen.)' : ''),
      onSolved: (noHint) => {
        if (!was) this.save.puzzlesSolved.push(this.wing);
        persist(this.save);
        this.room?.setPuzzleSolved();
        if (noHint && this.gainBookmark('puzzle')) toast('Ganz ohne Laterne!', 'Du hast das Rätsel ohne Hinweis gelöst.', ICONS.bookmark);
        this.checkComplete();
      },
    });
  }

  private async checkComplete() {
    const wing = this.wing; // captured: the player may open the map during the waits below
    const def = SCENES[wing];
    const allHome = def.wanderers.every((w) => this.save.found.includes(`${wing}:${w.id}`));
    const solved = this.save.puzzlesSolved.includes(wing);
    if (allHome && !solved) {
      setTimeout(() => { if (this.wing === wing) toast('Alle Wanderer sind zu Hause!', `Aber hier wartet noch ein Rätsel: ${def.puzzle.title}. Es leuchtet ganz leise violett.`, ICONS.lantern); }, 2600);
      return;
    }
    if (!allHome || this.save.wingsDone.includes(wing) || this.busy) return;
    this.busy = true;
    this.save.wingsDone.push(wing);
    if (wing === 'herz') this.save.finaleDone = true; // saved now, so closing the tab mid-finale never loses the epilogue
    persist(this.save);
    await wait(2200);
    if (this.wing !== wing) { this.busy = false; return; } // left the room: progress is saved, story notes can wait
    if (wing === 'herz') {
      await playFinale(this);
      this.busy = false;
      await this.showEndScreen();
      return;
    }
    await dialog({ ...def.note, kind: 'note', seal: SEALS[def.seal], sig: '– Oda W.' });
    const next = WINGS[WINGS.indexOf(wing) + 1];
    const choice = await dialog({
      title: 'Eine Tür hat sich geöffnet',
      text: [`Der Weg zu <b>${SCENES[next].title}</b> ist frei.`],
      buttons: [{ label: 'Noch umsehen', ghost: true }, { label: 'Weitergehen' }],
    });
    this.busy = false;
    if (choice === 1) await this.enter(next);
  }

  async showEndScreen() {
    const r = await showEnd(this);
    if (r === 'epilogue') await this.epilogue();
    else this.openMap();
  }

  async epilogue() {
    await playEpilogue();
    this.save.epilogueSeen = true;
    persist(this.save);
    this.openMap();
  }

  openMap() {
    sound.play('page');
    showMap(this, (w) => { if (w === 'epilogue') void this.epilogue(); else if (w) void this.enter(w); });
  }

  isUnlocked(w: WingId) { return isUnlocked(this.save, w); }
  epilogueReady() { return this.save.finaleDone && epilogueUnlocked(this.save); }

  /** All bookmarks the player has not found yet, as teasing hints. */
  missed(): string[] {
    const out: string[] = [];
    for (const w of WINGS) {
      for (const s of SCENES[w].secrets) if (!this.save.bookmarks.includes(`${w}:${s.id}`)) out.push(s.teaser);
      if (!this.save.bookmarks.includes(`${w}:puzzle`)) out.push(SCENES[w].puzzle.teaser);
    }
    return out;
  }
}

export const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));
export const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
const pronoun = (name: string) => (name.startsWith('der ') ? 'ihn' : name.startsWith('die ') ? 'sie' : 'es');
