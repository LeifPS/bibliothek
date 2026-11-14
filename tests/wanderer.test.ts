import { describe, it, expect } from 'vitest';
import { createWanderer, stepWanderer, EDGE_MARGIN } from '../src/engine/wanderer';

const run = (w: ReturnType<typeof createWanderer>, view: { x0: number; x1: number }, secs: number) => {
  let r = '';
  for (let t = 0; t < secs * 60; t++) r = stepWanderer(w, view, 1 / 60);
  return r;
};

describe('wanderer guiding', () => {
  it('idle wanderers do not move', () => {
    const w = createWanderer({ x: 100, y: 500 }, { x: 3000, y: 300 });
    expect(stepWanderer(w, { x0: 0, x1: 1600 }, 1)).toBe('idle');
    expect(w.x).toBe(100);
  });
  it('waits at the view edge while home is off-screen', () => {
    const w = createWanderer({ x: 100, y: 500 }, { x: 3000, y: 300 });
    w.state = 'travel';
    expect(run(w, { x0: 0, x1: 1600 }, 20)).toBe('waiting');
    expect(w.x).toBeCloseTo(1600 - EDGE_MARGIN, 0);
  });
  it('arrives once the player pans so home is visible', () => {
    const w = createWanderer({ x: 100, y: 500 }, { x: 3000, y: 300 });
    w.state = 'travel';
    run(w, { x0: 0, x1: 1600 }, 10);
    expect(run(w, { x0: 1800, x1: 3400 }, 20)).toBe('home');
    expect(w.state).toBe('home');
  });
  it('comes back into view if the player pans past it', () => {
    const w = createWanderer({ x: 100, y: 500 }, { x: 3000, y: 300 });
    w.state = 'travel';
    run(w, { x0: 1000, x1: 1500 }, 20); // narrow view far ahead, home still off-screen
    expect(w.x).toBeGreaterThanOrEqual(1000);
    expect(w.x).toBeLessThanOrEqual(1500);
  });
});
