import { rng, shuffle } from '../../rng';

/** A permutation puzzle: slot i shows piece perm[i]; solved when perm[i] === i. */
export interface Order { perm: number[] }

export function createOrder(n: number, seed: number): Order {
  const r = rng(seed);
  const o = { perm: Array.from({ length: n }, (_, i) => i) };
  // ensure at least half the pieces are out of place
  do shuffle(o.perm, r); while (o.perm.filter((p, i) => p !== i).length < Math.ceil(n / 2));
  return o;
}

export function swap(o: Order, a: number, b: number) {
  [o.perm[a], o.perm[b]] = [o.perm[b], o.perm[a]];
}

export const orderSolved = (o: Order) => o.perm.every((p, i) => p === i);

/** Slot pair whose swap puts one piece in its place, or null. */
export function orderHint(o: Order): [number, number] | null {
  const i = o.perm.findIndex((p, k) => p !== k);
  if (i < 0) return null;
  return [i, o.perm.indexOf(i)];
}
