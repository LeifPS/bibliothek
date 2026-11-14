import { describe, it, expect } from 'vitest';
import { freshSave, loadSave, persist, epilogueUnlocked, isUnlocked, addBookmark, SAVE_KEY } from '../src/state';

function memStore(init: Record<string, string> = {}) {
  const m = new Map(Object.entries(init));
  return { getItem: (k: string) => m.get(k) ?? null, setItem: (k: string, v: string) => void m.set(k, v) };
}

describe('save state', () => {
  it('fresh save has sensible defaults', () => {
    const s = freshSave();
    expect(s.v).toBe(1);
    expect(s.found).toEqual([]);
    expect(s.bookmarks).toEqual([]);
    expect(s.wingsDone).toEqual([]);
    expect(s.finaleDone).toBe(false);
  });
  it('round-trips through storage', () => {
    const st = memStore();
    const s = freshSave();
    s.found.push('halle:ring');
    persist(s, st);
    expect(loadSave(st).found).toEqual(['halle:ring']);
  });
  it('corrupt JSON yields a fresh save', () => {
    expect(loadSave(memStore({ [SAVE_KEY]: '{nope' }))).toEqual(freshSave());
  });
  it('wrong version yields a fresh save', () => {
    expect(loadSave(memStore({ [SAVE_KEY]: JSON.stringify({ v: 99, found: ['x'] }) }))).toEqual(freshSave());
  });
  it('throwing storage yields a fresh save and persist does not throw', () => {
    const bad = { getItem: () => { throw new Error('x'); }, setItem: () => { throw new Error('x'); } };
    expect(loadSave(bad)).toEqual(freshSave());
    expect(() => persist(freshSave(), bad)).not.toThrow();
  });
  it('bookmarks are not duplicated', () => {
    const s = freshSave();
    expect(addBookmark(s, 'halle:okapi')).toBe(true);
    expect(addBookmark(s, 'halle:okapi')).toBe(false);
    expect(s.bookmarks.length).toBe(1);
  });
  it('epilogue needs all 5 letters and at least 20 bookmarks', () => {
    const s = freshSave();
    for (const w of ['halle', 'zauber', 'karten', 'katzen', 'herz']) s.bookmarks.push(`${w}:brief`);
    for (let i = 0; i < 14; i++) s.bookmarks.push(`x:${i}`);
    expect(epilogueUnlocked(s)).toBe(false);
    s.bookmarks.push('x:last');
    expect(epilogueUnlocked(s)).toBe(true);
    s.bookmarks = s.bookmarks.filter((b) => b !== 'herz:brief');
    s.bookmarks.push('y:1');
    expect(epilogueUnlocked(s)).toBe(false);
  });
  it('wings unlock in order', () => {
    const s = freshSave();
    expect(isUnlocked(s, 'halle')).toBe(true);
    expect(isUnlocked(s, 'zauber')).toBe(false);
    s.wingsDone.push('halle');
    expect(isUnlocked(s, 'zauber')).toBe(true);
  });
});
