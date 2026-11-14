export const WINGS = ['halle', 'zauber', 'karten', 'katzen', 'herz'] as const;
export type WingId = (typeof WINGS)[number];

export const SAVE_KEY = 'bibliothek-traeume-save';
export const EPILOGUE_MIN_BOOKMARKS = 20;

export interface Save {
  v: 1;
  /** wanderer ids returned home, e.g. "halle:ring" */
  found: string[];
  /** golden bookmark ids, e.g. "halle:okapi", "zauber:brief", "karten:puzzle" */
  bookmarks: string[];
  puzzlesSolved: WingId[];
  wingsDone: WingId[];
  finaleDone: boolean;
  epilogueSeen: boolean;
  introSeen: boolean;
  sound: boolean;
}

export interface KV {
  getItem(k: string): string | null;
  setItem(k: string, v: string): void;
}

export function freshSave(): Save {
  return {
    v: 1,
    found: [],
    bookmarks: [],
    puzzlesSolved: [],
    wingsDone: [],
    finaleDone: false,
    epilogueSeen: false,
    introSeen: false,
    sound: true,
  };
}

function defaultStore(): KV | null {
  try {
    return globalThis.localStorage ?? null;
  } catch {
    return null;
  }
}

export function loadSave(store: KV | null = defaultStore()): Save {
  try {
    const raw = store?.getItem(SAVE_KEY);
    if (!raw) return freshSave();
    const data = JSON.parse(raw);
    if (!data || data.v !== 1) return freshSave();
    const base = freshSave();
    const arr = (x: unknown) => (Array.isArray(x) ? x.filter((y) => typeof y === 'string') : []);
    return {
      ...base,
      found: arr(data.found),
      bookmarks: arr(data.bookmarks),
      puzzlesSolved: arr(data.puzzlesSolved).filter((w): w is WingId => (WINGS as readonly string[]).includes(w)),
      wingsDone: arr(data.wingsDone).filter((w): w is WingId => (WINGS as readonly string[]).includes(w)),
      finaleDone: !!data.finaleDone,
      epilogueSeen: !!data.epilogueSeen,
      introSeen: !!data.introSeen,
      sound: data.sound !== false,
    };
  } catch {
    return freshSave();
  }
}

export function persist(s: Save, store: KV | null = defaultStore()): void {
  try {
    store?.setItem(SAVE_KEY, JSON.stringify(s));
  } catch {
    /* storage unavailable: the game keeps working in memory */
  }
}

export function addBookmark(s: Save, id: string): boolean {
  if (s.bookmarks.includes(id)) return false;
  s.bookmarks.push(id);
  return true;
}

export function lettersFound(s: Save): number {
  return WINGS.filter((w) => s.bookmarks.includes(`${w}:brief`)).length;
}

export function epilogueUnlocked(s: Save): boolean {
  return lettersFound(s) === WINGS.length && s.bookmarks.length >= EPILOGUE_MIN_BOOKMARKS;
}

export function isUnlocked(s: Save, w: WingId): boolean {
  const i = WINGS.indexOf(w);
  return i === 0 || s.wingsDone.includes(WINGS[i - 1]);
}
