import { rng } from '../../rng';

export const RING_STEPS = 8;
export interface Rings { offsets: number[] }

export function createRings(seed: number, count = 3): Rings {
  const r = rng(seed);
  const offsets = Array.from({ length: count }, () => 1 + Math.floor(r() * (RING_STEPS - 1)));
  return { offsets };
}

export function turnRing(r: Rings, i: number) {
  r.offsets[i] = (r.offsets[i] + 1) % RING_STEPS;
}

export const ringsSolved = (r: Rings) => r.offsets.every((o) => o === 0);
export function ringsHint(r: Rings): number | null {
  const i = r.offsets.findIndex((o) => o !== 0);
  return i < 0 ? null : i;
}
