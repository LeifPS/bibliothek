# Die Bibliothek der träumenden Bücher — Design

*Working title. Date: 2026-11-14.*

## 1. Intent

A calm, curious, riddle-based browser game in **German**. It combines classic
hidden-object scenes (Wimmelbilder) with tactile mini-puzzles and a story the
player pieces together from clues.

- **Children** (roughly 7+) can finish the main path in ~30–60 min.
- **Adults / careful explorers** get roughly double that through optional
  content: literary references, hidden oddities, a secret epilogue.
- The feeling we want: *something is always a little off — in a delightful way —
  and you want to find out why.* Light-hearted but with depth.

## 2. Goals, non-goals, anti-goals

**Goals**
- Fascinating, "wow" visuals that are warm and inviting, never creepy.
- Gentle, positive strangeness (impossible-but-friendly things) that teases the mind.
- One route for everyone; depth comes from optional goals that raise the score.
- Clues matter: what you find in one place is used somewhere else.

**Non-goals**
- No difficulty selector. Layering replaces modes.
- No external art assets, no backend, no accounts.
- No multiplayer, no monetization.

**Anti-goals (failure even if it "works")**
- Time pressure, timers, reflex or speed challenges.
- Lose states, game over, or punishment for wrong clicks (wrong clicks do nothing or show a tiny harmless reaction).
- Anything scary, violent, dark-in-tone, or adult-themed.
- Walls of text. Story beats should be short and readable aloud.
- Copying copyrighted text, character names as playable characters, or recognizable original artwork. **Literary references are allusions only** (objects, motifs, short generic phrases).

## 3. Story

The player is the **new night helper** of an old library. From the outside it
looks like a small corner building, but inside it is far bigger. That is the
first thing that is "off".

At midnight **the books begin to dream**. Pieces of their stories drift out
into the rooms: a ring rolls under a reading lamp, an owl carries a letter, a
cat clan has set up camp between the shelves, an okapi stands calmly in an
aisle. The player returns each wanderer to its book.

The previous librarian, **Oda Wendeblatt**, has vanished. She left short
notes. Her disappearance becomes the main thread: she has slipped *into* the
library's own book, "Das Buch ohne Ende", whose last page is missing.

**Finale:** the player repairs the last page using one clue from each wing.
Oda returns. Her explanation is the warm core of the story: *stories stay
awake only as long as someone is curious about them.* The books dreamed
because nobody had read them in a long time. Now they have a new reader.

**Secret epilogue** (only with enough golden bookmarks, mainly the Sofie
letters; see §6): echoing *Sofies Welt*'s meta twist, the player discovers
that the library itself is a story being read. The window in the finale room
opens out onto a child reading under a blanket by flashlight, smiling at the
page. In other words, the player. It is gentle and positive: *you are part of
the story too.*

## 4. Structure (about 5 scenes)

| # | Wing | Literary nod (allusion only) | Hidden-object focus | Mini-puzzle(s) | Signature oddity |
|---|------|------------------------------|---------------------|----------------|------------------|
| 0 | **Eingangshalle / Lesesaal** (tutorial) | mixed wanderers from many books | 5–6 easy objects that teach the mechanic | **Untangle the bookmark ribbons** (planar-graph untangle: drag nodes until no lines cross) | Fountain whose water flows **upward**; the room is visibly larger than the facade seen through the door |
| 1 | **Der Zauberflügel** | wizard school: owl with letter, round glasses, broom, lightning-shaped bookmark, platform sign "Gleis 9¾" | 8 objects | **Moving staircase**: rotate stair segments so a path connects (path/pipe rotation) | Stairs that go **up** but arrive one floor **lower**; portraits that glance at you |
| 2 | **Der Kartensaal** | the long journey: golden ring, round green door, second-breakfast table, leaf brooch, map with "Hin und zurück" | 8 objects | **Torn map**: reassemble tiles (swap puzzle), then trace the route through landmarks found in the scene | A map on the table shows **this room, including the player**, and updates as you move things |
| 3 | **Der Katzenwald** | cat clans: a forest grown between the shelves, a great rock under the moon, four clan marks | 8 objects | **Star circle**: rotate concentric rings of a star disc to align a constellation, using hints found in the scene | Shadows that **don't match** their objects; one shadow shows what is missing |
| 4 | **Das Herz der Bibliothek** (finale) | "Das Buch ohne Ende" | short search for the 4 wing seals | **Page order**: arrange story fragments (from Oda's notes) into the right order; uses clues from all wings | A clock that ticks **backwards**, and a window looking *out of* the story |

Wing order is linear: 0 → 1 → 2 → 3 → 4. Each wing ends with:
1. all *required* wanderers returned,
2. the puzzle solved,
3. a **seal and a note from Oda**. The note gives the clue the finale needs and tells a bit more story.

**Cross-wing clues (required, kid-level):** each wing's seal or note carries one
symbol or word that the finale's page-order puzzle needs. Example: a symbol on
the owl's letter matches the first page fragment.

## 5. Oddities: friendly impossibilities everywhere

Every scene has several. Each oddity is one of three kinds:
- **Atmosphere:** it just is (breathing books, dust motes drifting into constellations, a book sleeping upside down).
- **Noticeable:** clicking it "notices" it. It reacts with a small animation and line of text, and gives a golden bookmark (optional).
- **Clue:** it helps solve something. The upward fountain points toward a hidden object; the wrong shadow reveals a missing piece; the self-updating map shows where something is.

Ideas pool (the builder picks the best fit per scene): upward fountain; stairs up → floor down; window showing the room from outside at another time of day; mirror reflecting something that isn't there; a painting that changes when you look away; a backwards clock that ticks faster near secrets; a teacup that refills itself; a book whose letters swim and then settle when you look closely; a door far smaller than what is behind it; a chandelier made of floating commas.

## 6. Scoring: golden bookmarks (Goldene Lesezeichen)

All of these are optional. None blocks progress.

Per wing, roughly 5–7 bookmarks:
- **Okapi:** one okapi hidden per scene (a nod to *Was man von hier aus sehen kann*). It is calm, a little absurd, and easy to miss.
- **Sofie letter:** one small envelope per scene with a philosophical question in Sofie's spirit, written in our own words ("Wer bist du?", "Woher kommt die Welt?"-style; short generic questions, not quotes). Collecting them builds toward the epilogue.
- **Noticed oddities:** 2–3 per scene.
- **Puzzle without hints:** 1 per puzzle.

Total is about 30. The end screen shows "X von N Lesezeichen" and a short list of what was missed, phrased as teasing hints. **Secret epilogue** unlocks with all 5 Sofie letters plus at least 20 bookmarks overall (the exact threshold is tunable).

A per-wing replay option lets explorers go back for missed bookmarks without restarting.

## 6a. Core action: guiding a wanderer home (decided by the user)

1. **Tap the wanderer.** It wakes up and starts drifting toward its home, which is a specific book or shelf in this wing (each wanderer has its own spot, such as an owl niche or a map drawer).
2. **Follow it.** Scenes are **wider than the screen** (panoramic rooms the player pans through by dragging, swiping or using edge arrows). The wanderer flies ahead and **waits patiently** at the edge of the view, with a soft glow and a little bobbing animation, until the player catches up. There is no time limit, and it never gets lost.
3. **Arrive.** When its home shelf is in view, the wanderer flies the last stretch on its own and slips into the book with a trail of glowing letters.

The player never has to know where it belongs but still *brings it back*. Following often passes other hidden things on the way, which is natural discovery. While a wanderer is being guided, the player can still tap other things. Only one wanderer travels at a time; tapping another one shows a gentle "one at a time" reaction.

## 7. Interaction and help

- Point and click / tap. Must work with **mouse and touch** (tablet landscape is a first-class target for kids). Desktop is the primary layout.
- Hidden-object list shows **silhouette + word** so pre-readers can play.
- **"Vorlesen" (read aloud)** button for all story text, using the browser's built-in German speech synthesis. Builder's note: degrade gracefully if no German voice exists.
- **Hints:** a hint button (an Oda's-lantern style) lights a soft glow near one target or shows the next puzzle step. Hints are unlimited, but using one forfeits that puzzle's "no hints" bookmark. Passive hints: pages rustle and the backwards clock ticks faster when the player hovers near something hidden (desktop only).
- Wrong clicks: a harmless, cute micro-reaction. No penalty.
- **Autosave** progress in `localStorage`. Options: new game, continue, sound on/off.

## 8. Visual and audio direction

- Style: illustrated storybook. Warm candle/lamp light against deep blue night. Gold, amber, teal, soft violet. Rich layering (foreground shelves, mid, background) with subtle parallax.
- "Wow" moments: the first time the door opens and the hall unfolds bigger than possible; the upward fountain; light rays through dust; a returned wanderer flying back into its book with a trail of glowing letters; the finale window.
- All art drawn in code: **SVG** for scenes and clickable objects, a **canvas layer** for particles and light (dust, sparks, water, letter trails).
- Audio: soft generative ambience and small UI sounds via **Web Audio** (no audio files). Calm, optional, starts muted until the first user interaction (browser rule).

## 9. Technology

- **Vite + TypeScript**, no game engine, no UI framework required (the builder may add a tiny one if it clearly helps).
- Scenes are SVG built from TypeScript modules. A canvas overlay handles effects.
- A simple scene manager, a game state store (progress, bookmarks, hints used) persisted to `localStorage`, and puzzle modules with pure logic separated from rendering.
- **Vitest** for puzzle logic (solved-state detection, scramble always solvable), state and save/load.
- Runs with `npm run dev`; `npm run build` produces a static folder that can be shared or hosted anywhere.
- All text in German, kept in one strings module so it is easy to edit.

## 10. Approaches considered

1. **Plain HTML/CSS/JS, no tooling.** Simplest to open, but too hard to keep 5 polished scenes, puzzles and state maintainable. Rejected.
2. **Vite + TypeScript, SVG scenes + canvas effects.** Chosen. Best visuals without art files; crisp clickable objects suit hidden-object play; a clean structure to polish.
3. **Game engine (Phaser/PixiJS).** Strong animation, but at its best with painted image assets, which we don't have. Code-drawn art looks worse there than in SVG. Rejected.

## 11. Decided by the user

- Theme: library where books dream; the library is bigger inside than outside.
- Many friendly, mind-teasing oddities (for example, the upward fountain).
- Literary allusions: kids' layer (wizard school, the ring journey, cat clans) and adult layer (*Was man von hier aus sehen kann*, *Sofies Welt*).
- Language: German.
- Length: about 30–60 min main path for kids; about double, or more, for thorough adults.
- Tech: option 2.
- Core action: tap a wanderer, follow it through the (panoramic) room, and it flies into its book once you arrive (§6a).

## 12. Calls made by Claude (open to correction)

- Exactly 4 wings plus a finale, with the wing-to-book mapping above.
- Names (Oda Wendeblatt, "Das Buch ohne Ende") and the "stories need readers" core.
- Secret epilogue with the meta twist and its unlock rule.
- Golden bookmark categories and counts.
- Read-aloud via speech synthesis, silhouettes in the object list.
- Web Audio generative sound.

## 12a. Progress, replay and delivery (Claude's calls)

- **Object list** shows only the *required* wanderers. Bookmarks (okapi, Sofie letter, oddities, no-hint) are not in the list. Each wing shows only a counter, like "Lesezeichen 3/7", and the end screen gives teasing hints for what was missed.
- **Progress is saved per item.** Found objects and earned bookmarks stay found forever.
- **Library map (hub):** after a wing is done it can be revisited from the map at any time. Revisiting keeps everything already found. The wing's puzzle can be replayed freshly scrambled, and solving it without hints then earns the no-hint bookmark.
- **Finishing the finale marks the game as complete.** The end screen shows the score. Once the epilogue threshold is reached, at any time and even after completion, a glowing **window** appears in the finale room on the map. Opening it plays the epilogue. The finale never needs to be replayed.
- **Delivery order:** a polished vertical slice first (hall plus Zauberflügel, all systems working), then the remaining wings, then a polish pass. Target performance is smooth on a mid-range tablet from about 2022. Particle density scales down automatically if the frame rate drops.

## 13. Left to the builder

- Exact object lists, positions and art per scene; the specific oddities per scene from the pool.
- Puzzle sizes and tuning (keeping them kid-solvable; extra depth comes from bookmarks, not harder required puzzles).
- Exact German wording of all text (short, warm, slightly whimsical, readable aloud).
- Code architecture details within §9.
