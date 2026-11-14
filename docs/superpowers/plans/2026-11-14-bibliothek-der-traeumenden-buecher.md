# Die Bibliothek der träumenden Bücher — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans. Steps use checkbox (`- [ ]`) syntax.

**Goal:** A German, calm, riddle-based browser game: panoramic hidden-object rooms where you guide wandering story objects home, plus five mini-puzzles, a story, optional golden bookmarks and a secret epilogue.

**Architecture:** Vite + TypeScript, no framework. Each room is a wide SVG panorama (viewBox height 1000) panned by a camera. A full-screen canvas overlay renders particles. Puzzles are pure-logic modules (unit-tested) with separate SVG renderers shown in a modal. State lives in one store persisted to `localStorage`.

**Tech Stack:** vite 8, typescript ~5.9, vitest 5, Web Audio, SpeechSynthesis.

**Spec:** `docs/superpowers/specs/2026-11-14-bibliothek-der-traeumenden-buecher-design.md`

## Global Constraints
- All player-facing text is German and lives in `src/content/` scene and string modules.
- No timers, no lose states, no penalties; wrong taps only cause a cute micro-reaction.
- Literary references are allusions only: no quotes, no character names.
- No external assets: all art is SVG/canvas drawn in code, all sound is Web Audio.
- Mouse and touch both work; tap vs. drag threshold of 8px.
- Storage access is wrapped in try/catch; the game works without it.

## Review Focus
- Corrupt or old-version save in localStorage → the game starts fresh instead of crashing (test in state task).
- A scrambled puzzle must never start already solved (test per puzzle generator).
- Window resize or rotation while a wanderer is waiting → camera and wanderer re-clamp, nothing gets stuck off-screen.
- Tapping a second wanderer while one travels → gentle "one at a time" reaction, no state corruption.
- No German speech voice available → the Vorlesen button hides itself.

---

### Task 1: Scaffold + state store
**Files:** `package.json`, `tsconfig.json`, `vite.config.ts`, `index.html`, `src/state.ts`, `tests/state.test.ts`
**Produces:** `type Save`, `loadSave(): Save`, `persist(s: Save)`, `freshSave(): Save`, `bookmarkTotal(s)`, `epilogueUnlocked(s): boolean` (all 5 letters + ≥20 bookmarks).
- [ ] Tests: fresh save shape; corrupt JSON → fresh; wrong version → fresh; epilogue rule.
- [ ] Implement; `npx vitest run` passes; commit.

### Task 2: Puzzle logic (pure)
**Files:** `src/puzzles/logic/{untangle,stairs,tiles,rings,pages}.ts`, `tests/puzzles.test.ts`
**Produces:** for each puzzle: `create(seed)`, an action (`move`/`rotate`/`swap`), `isSolved`, and `hint(state)`.
- [ ] Tests: scrambled ≠ solved for 200 seeds; solving moves yield solved; untangle crossing count is 0 for the reference layout.
- [ ] Implement; tests pass; commit.

### Task 3: Engine: panorama camera, input, wanderer guiding, FX canvas, audio, speech, HUD, dialog
**Files:** `src/engine/{panorama,wanderer,fx,audio,speech,hud,dialog,svg,rng}.ts`, `src/styles.css`
- [ ] Wanderer logic `stepWanderer(w, view, dt)` unit-tested: waits at the view edge when home is off-screen and arrives when home is visible.
- [ ] Manual check in the browser; commit.

### Task 4: Vertical slice: title/intro, Lesesaal + untangle, Zauberflügel + stairs, map hub
### Task 5: Kartensaal + tiles, Katzenwald + rings
### Task 6: Herz (finale) + pages, end screen, epilogue, missed-bookmark teasers
### Task 7: Polish pass + build verification (`npm run build`, typecheck, tests)
