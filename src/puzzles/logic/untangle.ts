import { rng, shuffle } from '../../rng';

export interface Pt { x: number; y: number }
export interface Untangle { nodes: Pt[]; edges: [number, number][] }

/** Wheel graph: centre node 0, rim 1..6, plus two rim chords that stay planar. */
const EDGES: [number, number][] = [
  [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 1],
  [0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [0, 6],
];

export const SOLVED_LAYOUT: Pt[] = [
  { x: 500, y: 500 },
  ...Array.from({ length: 6 }, (_, i) => ({
    x: 500 + 330 * Math.cos((i / 6) * Math.PI * 2),
    y: 500 + 330 * Math.sin((i / 6) * Math.PI * 2),
  })),
];

export function createUntangle(seed: number): Untangle {
  const r = rng(seed);
  for (;;) {
    const order = shuffle([0, 1, 2, 3, 4, 5, 6], r);
    const nodes: Pt[] = new Array(7);
    order.forEach((n, i) => {
      const a = (i / 7) * Math.PI * 2 + r() * 0.3;
      nodes[n] = { x: 500 + 380 * Math.cos(a), y: 500 + 380 * Math.sin(a) };
    });
    const u = { nodes, edges: EDGES.map((e) => [...e] as [number, number]) };
    if (crossings(u) >= 3) return u;
  }
}

function orient(a: Pt, b: Pt, c: Pt) {
  return (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x);
}

export function segmentsCross(a: Pt, b: Pt, c: Pt, d: Pt): boolean {
  const d1 = orient(c, d, a), d2 = orient(c, d, b), d3 = orient(a, b, c), d4 = orient(a, b, d);
  return ((d1 > 0 && d2 < 0) || (d1 < 0 && d2 > 0)) && ((d3 > 0 && d4 < 0) || (d3 < 0 && d4 > 0));
}

/** Pairs of edge indices that cross (edges sharing a node never count). */
export function crossingPairs(u: Untangle): [number, number][] {
  const out: [number, number][] = [];
  for (let i = 0; i < u.edges.length; i++)
    for (let j = i + 1; j < u.edges.length; j++) {
      const [a, b] = u.edges[i], [c, d] = u.edges[j];
      if (a === c || a === d || b === c || b === d) continue;
      if (segmentsCross(u.nodes[a], u.nodes[b], u.nodes[c], u.nodes[d])) out.push([i, j]);
    }
  return out;
}

export const crossings = (u: Untangle) => crossingPairs(u).length;
export const isUntangled = (u: Untangle) => crossings(u) === 0;

export function moveNode(u: Untangle, i: number, x: number, y: number) {
  u.nodes[i] = { x: Math.max(40, Math.min(960, x)), y: Math.max(40, Math.min(960, y)) };
}

/** Returns the node that takes part in the most crossings, or null if solved. */
export function untangleHint(u: Untangle): number | null {
  const pairs = crossingPairs(u);
  if (!pairs.length) return null;
  const count = new Map<number, number>();
  for (const [i, j] of pairs) for (const n of [...u.edges[i], ...u.edges[j]]) count.set(n, (count.get(n) ?? 0) + 1);
  return [...count.entries()].sort((a, b) => b[1] - a[1])[0][0];
}
