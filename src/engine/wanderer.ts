export const EDGE_MARGIN = 80;
/** home counts as visible a bit before the waiting margin, so edge homes are always reachable */
export const HOME_MARGIN = 30;
export const SPEED = 340; // scene units per second
export const FLY_HEIGHT = 420;

export type WandererState = 'idle' | 'travel' | 'home';
export interface Wanderer {
  x: number; y: number;
  home: { x: number; y: number };
  state: WandererState;
  waiting: boolean;
  t: number;
}
export interface ViewRange { x0: number; x1: number }

export function createWanderer(pos: { x: number; y: number }, home: { x: number; y: number }): Wanderer {
  return { x: pos.x, y: pos.y, home: { ...home }, state: 'idle', waiting: false, t: 0 };
}

/**
 * Advance one frame. The wanderer flies toward its home; while home is off-screen it
 * waits patiently at the nearest edge of the view. Returns 'arrived' on the frame it lands.
 */
export function stepWanderer(w: Wanderer, view: ViewRange, dt: number): 'idle' | 'moving' | 'waiting' | 'arrived' | 'home' {
  w.t += dt;
  if (w.state === 'idle') return 'idle';
  if (w.state === 'home') return 'home';
  const lo = view.x0 + EDGE_MARGIN, hi = Math.max(lo, view.x1 - EDGE_MARGIN);
  const homeVisible = w.home.x >= view.x0 + HOME_MARGIN && w.home.x <= view.x1 - HOME_MARGIN;
  const tx = homeVisible ? w.home.x : Math.min(hi, Math.max(lo, w.home.x));
  const ty = homeVisible ? w.home.y : FLY_HEIGHT;
  const dx = tx - w.x, dy = ty - w.y;
  const dist = Math.hypot(dx, dy);
  const step = SPEED * dt * (homeVisible ? 1.2 : 1);
  if (dist <= step || dist < 2) {
    w.x = tx; w.y = ty;
    if (homeVisible) { w.state = 'home'; w.waiting = false; return 'arrived'; }
    w.waiting = true;
    return 'waiting';
  }
  w.x += (dx / dist) * step;
  w.y += (dy / dist) * step;
  w.waiting = false;
  return 'moving';
}
