import { rng, shuffle } from '../../rng';

/** Connection bits: N=1, E=2, S=4, W=8. */
export const N = 1, E = 2, S = 4, W = 8;
export interface Stairs {
  w: number; h: number;
  tiles: number[];      // current masks
  solution: number[];   // masks of path tiles in solved state, 0 for decorative
  startRow: number; endRow: number;
}

export const rot = (m: number) => ((m << 1) | (m >> 3)) & 15;
const DIRS: [number, number, number, number][] = [ // bit, dx, dy, opposite
  [N, 0, -1, S], [E, 1, 0, W], [S, 0, 1, N], [W, -1, 0, E],
];

function findPath(w: number, h: number, sr: number, er: number, r: () => number): [number, number][] {
  const seen = new Set<number>();
  const path: [number, number][] = [];
  const dfs = (x: number, y: number): boolean => {
    seen.add(y * w + x); path.push([x, y]);
    if (x === w - 1 && y === er) return true;
    for (const [, dx, dy] of shuffle([...DIRS], r)) {
      const nx = x + dx, ny = y + dy;
      if (nx < 0 || ny < 0 || nx >= w || ny >= h || seen.has(ny * w + nx)) continue;
      if (dfs(nx, ny)) return true;
    }
    path.pop();
    return false;
  };
  dfs(0, sr);
  return path;
}

export function createStairs(seed: number, w = 5, h = 4): Stairs {
  const r = rng(seed);
  const startRow = Math.floor(r() * h), endRow = Math.floor(r() * h);
  const path = findPath(w, h, startRow, endRow, r);
  const tiles = new Array(w * h).fill(0);
  const solution = new Array(w * h).fill(0);
  path.forEach(([x, y], i) => {
    const dirTo = (a: [number, number], b: [number, number]) => DIRS.find(([, dx, dy]) => a[0] + dx === b[0] && a[1] + dy === b[1])![0];
    const inBit = i === 0 ? W : dirTo([x, y], path[i - 1]);
    const outBit = i === path.length - 1 ? E : dirTo([x, y], path[i + 1]);
    solution[y * w + x] = inBit | outBit;
  });
  for (let i = 0; i < tiles.length; i++) tiles[i] = solution[i] || (r() < 0.5 ? N | S : N | E);
  const st: Stairs = { w, h, tiles, solution, startRow, endRow };
  do {
    for (let i = 0; i < tiles.length; i++) {
      const turns = Math.floor(r() * 4);
      for (let t = 0; t < turns; t++) tiles[i] = rot(tiles[i]);
    }
  } while (stairsSolved(st));
  return st;
}

export function rotateTile(st: Stairs, i: number) {
  st.tiles[i] = rot(st.tiles[i]);
}

/** Set of tile indices reachable from the entrance (used for lighting the path). */
export function litTiles(st: Stairs): Set<number> {
  const { w, h, tiles } = st;
  const lit = new Set<number>();
  const start = st.startRow * w;
  if (!(tiles[start] & W)) return lit;
  const stack = [start];
  lit.add(start);
  while (stack.length) {
    const i = stack.pop()!;
    const x = i % w, y = Math.floor(i / w);
    for (const [bit, dx, dy, opp] of DIRS) {
      if (!(tiles[i] & bit)) continue;
      const nx = x + dx, ny = y + dy;
      if (nx < 0 || ny < 0 || nx >= w || ny >= h) continue;
      const j = ny * w + nx;
      if (!lit.has(j) && tiles[j] & opp) { lit.add(j); stack.push(j); }
    }
  }
  return lit;
}

export function stairsSolved(st: Stairs): boolean {
  const end = st.endRow * st.w + st.w - 1;
  return litTiles(st).has(end) && !!(st.tiles[end] & E);
}

export function stairsHint(st: Stairs): number | null {
  if (stairsSolved(st)) return null;
  const i = st.solution.findIndex((m, k) => m !== 0 && st.tiles[k] !== m);
  return i < 0 ? null : i;
}
