import type { WingId } from '../state';

export interface Pt { x: number; y: number }

export interface WandererDef {
  id: string;            // unique within the wing, also the ART key
  name: string;          // German, with article, e.g. "die Teetasse"
  at: Pt;                // hiding spot
  home: Pt;              // where its home book stands
  scale?: number;
  rot?: number;
  homeColor?: string;
  line: string;          // short line shown when it arrives home
}

export interface SecretDef {
  id: string;            // 'okapi' | 'brief' | oddity id
  kind: 'okapi' | 'brief' | 'oddity';
  at: Pt;
  r: number;             // tap radius
  art?: string;          // drawn by the scene if given (okapi/brief use ART)
  scale?: number;
  title: string;
  text: string;
  teaser: string;        // hint shown on the end screen if missed
}

export type PuzzleKind = 'untangle' | 'stairs' | 'tiles' | 'rings' | 'pages';

export interface SceneDef {
  id: WingId;
  title: string;
  width: number;
  /** far layer (moves slower), drawn from x=-600 */
  far: string;
  /** main layer with furniture; secrets/wanderers/home books are added by the engine */
  main: string;
  /** decoration drawn above wanderers (pointer-events: none), e.g. leaves that half-hide things */
  over?: string;
  /** foreground silhouettes with stronger parallax */
  fore?: string;
  wanderers: WandererDef[];
  secrets: SecretDef[];
  puzzle: { kind: PuzzleKind; at: Pt; art: string; title: string; intro: string; teaser: string };
  intro: { title: string; text: string[] };
  note: { title: string; text: string[] };
  seal: string;
  /** scene-space particle emitters */
  emitters?: Emitter[];
  ambience?: 'hall' | 'magic' | 'maps' | 'forest' | 'heart';
}

export interface Emitter {
  kind: 'fountain' | 'upleaves' | 'fireflies' | 'motes' | 'letters' | 'drips';
  x: number; y: number; w?: number; h?: number;
}
