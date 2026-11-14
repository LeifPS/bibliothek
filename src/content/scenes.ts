import type { WingId } from '../state';
import type { SceneDef } from './types';
import { HALLE } from './halle';
import { ZAUBER } from './zauber';
import { KARTEN } from './karten';
import { KATZEN } from './katzen';
import { HERZ } from './herz';

export const SCENES: Record<WingId, SceneDef> = { halle: HALLE, zauber: ZAUBER, karten: KARTEN, katzen: KATZEN, herz: HERZ };
