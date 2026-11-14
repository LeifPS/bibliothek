import { describe, it, expect } from 'vitest';
import { createUntangle, crossings, isUntangled, moveNode, untangleHint, SOLVED_LAYOUT } from '../src/puzzles/logic/untangle';
import { createStairs, rotateTile, stairsSolved, stairsHint } from '../src/puzzles/logic/stairs';
import { createOrder, swap, orderSolved, orderHint } from '../src/puzzles/logic/order';
import { createRings, turnRing, ringsSolved, ringsHint } from '../src/puzzles/logic/rings';

const SEEDS = Array.from({ length: 200 }, (_, i) => i * 7919 + 1);

describe('untangle', () => {
  it('reference layout has no crossings', () => {
    const u = createUntangle(1);
    SOLVED_LAYOUT.forEach((p, i) => moveNode(u, i, p.x, p.y));
    expect(crossings(u)).toBe(0);
    expect(isUntangled(u)).toBe(true);
  });
  it('never starts solved and hint names a crossing edge', () => {
    for (const s of SEEDS) {
      const u = createUntangle(s);
      expect(crossings(u)).toBeGreaterThan(0);
      const h = untangleHint(u);
      expect(h).not.toBeNull();
    }
  });
  it('moveNode clamps into the board', () => {
    const u = createUntangle(3);
    moveNode(u, 0, -50, 5000);
    expect(u.nodes[0].x).toBeGreaterThanOrEqual(0);
    expect(u.nodes[0].y).toBeLessThanOrEqual(1000);
  });
});

describe('stairs', () => {
  it('never starts solved; rotating hinted tiles eventually solves', () => {
    for (const s of SEEDS) {
      const st = createStairs(s);
      expect(stairsSolved(st)).toBe(false);
      let guard = 0;
      while (!stairsSolved(st) && guard++ < 200) {
        const h = stairsHint(st);
        expect(h).not.toBeNull();
        rotateTile(st, h!);
      }
      expect(stairsSolved(st)).toBe(true);
    }
  });
});

describe('order (map tiles + pages)', () => {
  it('never starts solved; hint swaps solve it', () => {
    for (const n of [4, 9]) for (const s of SEEDS) {
      const o = createOrder(n, s);
      expect(orderSolved(o)).toBe(false);
      let guard = 0;
      while (!orderSolved(o) && guard++ < 20) {
        const [a, b] = orderHint(o)!;
        swap(o, a, b);
      }
      expect(orderSolved(o)).toBe(true);
    }
  });
});

describe('rings', () => {
  it('never starts solved; hint turns solve it', () => {
    for (const s of SEEDS) {
      const r = createRings(s);
      expect(ringsSolved(r)).toBe(false);
      let guard = 0;
      while (!ringsSolved(r) && guard++ < 50) turnRing(r, ringsHint(r)!);
      expect(ringsSolved(r)).toBe(true);
    }
  });
});
