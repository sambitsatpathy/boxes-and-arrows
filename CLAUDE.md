# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Boxes & Arrows is a static, no-backend, no-build course app for learning system design.
Everything runs in the browser: a home "course map" of units, and a step-by-step lesson
walker where each step is a short walkthrough with a boxes-and-arrows SVG diagram. Units are
gated by a **section exam** (pass at 70%) that unlocks the next unit. Progress is stored in
`localStorage`. There is no server, no AI service, no bundler and no test suite. 56 lessons
across 13 units.

## Commands

Run locally (serves `index.html` and the JS/CSS at the root):

```sh
npx serve .
# or: python3 -m http.server 8080
```

The app can also be opened directly with `open index.html`. Deploy on Vercel: framework
preset "Other", no build command, output directory `.`. Any static host works.

Syntax-check the scripts (no tests exist):

```sh
node --check app.js && node --check course.js && node --check course-judgement.js && node --check course-enhance.js && node --check course-unit13.js && node --check course-quizzes.js
```

There is no lint or build step. Changes appear on a browser refresh. Asset URLs in
`index.html` carry cache-busting query strings (`?v=...`); bump them when editing a file so
cached copies are invalidated. Re-read these files before editing if another session has
touched the repo — the cache-buster counter is shared.

## Architecture

**Files and ownership**

- `index.html` — page shell, SVG icon symbols, cache-busted `<script>`/`<link>` tags, noscript fallback.
- `styles.css` — all styling (mobile-first, light/dark). Unit accents are CSS vars `--u1` … `--u13`,
  defined in the light `:root`, the `prefers-color-scheme:dark` block, and the
  `:root[data-theme="dark"]` block — update all three when adding a unit.
- `course.js` — core course data as plain globals: `COURSE_UNITS` (9 units) and
  `COURSE_LESSONS` (40 lessons). Extracted from the designed-to-scale bundle; prefer
  re-extraction over hand-editing.
- `course-judgement.js` — unit 10 (Design Judgement, 3 lessons). Pushes onto the same globals.
- `course-enhance.js` — units 11–12 (Networking & the Edge; Patterns & Data Modelling, 10 lessons).
  Pushes onto the same globals.
- `course-unit13.js` — unit 13 (Build the Giants: Messaging, 3 lessons / 41 steps). Pushes
  onto the same globals. Each lesson credits its ByteByteGo guide URLs in a `.src` body line.
- `course-quizzes.js` — the quiz bank as a plain global: `QUIZ_BANK`. Feeds the inline
  "Quick check" steps, the section exams (`examPool`) and Review mode.
- `app.js` — the entire application in one IIFE. Reads `COURSE_UNITS` / `COURSE_LESSONS` / `QUIZ_BANK`.
- `mascot-concepts.html` — standalone ideation page with animated mascot concepts; **not** loaded by the app.
- `vercel.json` — static hosting + security headers (CSP). Keep changes CSP-compatible.

**Script order matters:** `course.js` → `course-judgement.js` → `course-enhance.js` → `course-unit13.js` → `course-quizzes.js` → `app.js`.
The course files mutate the globals; `app.js` reads them at load. Adding a unit = push a unit
object onto `COURSE_UNITS`, add its lessons to `COURSE_LESSONS`, define `--uN` in `styles.css`.

**Data model (course files)**

- `COURSE_UNITS` is an array of `{id, num, title, color, lessons:[{id,title}]}`. `num` is the
  display number; the home page colours a unit with `--uc:var(--u<index+1>)`.
- `COURSE_LESSONS[id]` is `{id, title, summary, minutes, level, goals:[{text,step}], steps:[...]}`.
- Each step: `{short, chapter, title, body:[htmlStrings], callout:{kind,text}|null,
  changes:[strings]|null, scene:{entities,links}|null}`.
  - `chapter` ∈ setup / technique / problem / insight / tradeoff / recap (drives the chip colour).
  - `callout.kind` ∈ insight / tip / warn / next.
  - `body` strings may contain HTML: `<span class="term">`, `<code>`, `<b>`, `<em>`,
    `<ul class="takeaways">`, `<table class="compare">`.
- `scene.entities`: `{k, type, x, y, color, label, sub, tags}`. `type` ∈ device / block / db /
  queue / crowd / zone / panel. `crowd`/`zone` use `x0,x1,y0,y1` instead of `x,y`.
  `panel` entities are rendered as separate cards below the diagram (not inside the SVG).
- `scene.links`: `{from, to, heads, label}`. `heads` ∈ end / both. The renderer draws straight
  lines between entity centres; `pts`/`style` are ignored. Every `from`/`to` must match an
  entity `k` in the same scene.
- `diagramSVG` auto-scales coordinates to a 360×258 viewBox; coordinates are arbitrary units.
  A scene with only `panel` entities renders no SVG (just the panel cards).

**App state (app.js)**

- `S = {done:{lessonId:true}, last, xp, hearts, streak, lastDay, quiz:{qk:{picked,ok}},
  exams:{unitId:{passed,correct,total}}}`, loaded from `localStorage` key
  `"boxes-and-arrows-v3"`; theme from `"boxes-and-arrows-theme"`. Persisted with `save()`.
  `exams` is separate from `done` so completion maths is unaffected.
- `view` is `"home"`, `"lesson"`, `"result"` or `"reviewdone"`; `current = {unit, lesson, step}`.
  Each view rebuilds `app.innerHTML` from HTML strings via `renderHome()` / `renderStep()` /
  `renderResult()`; `rerender()` re-runs the current view (used by the theme toggle).
- UI is event-driven by delegation: one click listener on `#app` reads `data-act`
  (`open`, `home`, `next`, `prev`, `theme`, `dismiss`, `continue`, `review`, `exam`, `answer`).
  Keyboard: ←/→ step, 1–4 answer a quiz, Esc home.
- Finishing the last step marks `S.done[lesson]=true` and shows a pass/fail result card.

**Section exams and gating**

- Unit 01 is open; unit N unlocks when unit N−1's exam is passed (`unitUnlocked`). Migration
  runs once at load: a unit fully present in `S.done` with no `S.exams` record gets
  `{passed:true,migrated:true}` written back, so existing progress is never locked out — and a
  recorded attempt (pass *or* fail) is never overridden. `unitExamPassed` reads only `S.exams`.
- `examPool(ui)` builds the exam from that unit's `QUIZ_BANK` entries, namespaced as
  `__exam__<unitId>::<lessonId>#<i>` — the lesson id is essential, because the per-lesson
  index restarts at 0 and would otherwise collide across a unit's lessons. Questions already
  answered correctly inline are dropped, but the pool never falls below 2 — thin banks
  (e.g. Shipping's 2) still demand a real pass. `startExam` clears that unit's previous exam
  answers so a retake is a fresh attempt.
- Pass is `correct*10 >= total*7` (integer compare, no floats). Exams award XP but never deduct
  hearts — they are the unlock path.
- `nextLesson()` and `startLesson` both enforce the lock, so Continue cannot walk into a locked
  unit. The home hero falls back to a "take the section exam" CTA when the next unit is locked.

**Result card and mascot**

- `renderResult()` serves lessons, exams and review with the same 70% threshold; exams may pass
  their own `passed`. Pass = confetti canvas painted from `app.js` (CSP-safe, no library) plus
  Boxy's hop; fail = Boxy's slump plus a "review these" list of missed questions.
- Boxy's art is an `MASCOT_SVG` template in `app.js` (injected into `#mascot-inner`, reused by the
  result card). Fail is always shown; success is rolled at `MASCOT_SUCCESS_CHANCE` (0.45) and
  forced on a lesson's last *quiz* step. The slump is a static end-state, so
  `prefers-reduced-motion` still reads as down (vs the up hop).

**UI behaviour (styles.css / app.js)**

- **Sticky chrome.** `.top` and `.lhead` are both sticky; `.lhead` stacks at `top:var(--top-h)`,
  measured from the real `.top` height by `measureTop()` (re-run on resize) so the stats bar is
  never covered. `.unithd` sticks per unit at `top:var(--top-h)` with `z-index:10` — above the
  rows, below the chrome (a third `z-index:20` would fall back to DOM order and paint over
  `.top`). The next unit's header replaces it.
- **Top bar on phones.** Below 720px the wordmark (`.brand > span:not(.mark)`) is dropped so the
  logo tile plus the four stats fit on one line. `.brand` carries `role="img"
  aria-label="Boxes and Arrows"` so the bar stays labelled.
- **Resume scrolling.** A fresh home render picks up the reader's place: `renderHome({resume:true})`
  centres `S.last` when it still resolves and its section is unlocked, else falls back to
  `nextLesson()`. `rerender()` passes `{keepScroll:true}` so the theme toggle / a dismissed
  notice never yanks the page. It honours `prefers-reduced-motion` and never moves focus.
  `scroll-margin` does not adjust `block:"center"` alignment; rows near the top of the document
  can be clamped under the sticky chrome, so landing must be verified at unit 1's first lesson.
- **Loading splash.** `#splash` (in `index.html`, outside `#app`) is a branded, CSS-animated
  loading overlay; `app.js` removes it from the DOM on handover (`revealApp()`), with
  `SPLASH_MIN` / `SPLASH_CAP` controlling the beat and `window` error/load fallbacks so a failed
  init cannot strand it. It is themed in the same three places as the app. Keep the animation
  smooth and do **not** add "Loading…" copy — there is no work to report.

**Rendering conventions**

- Templates are plain HTML strings built with `+` concatenation; icons via `ic(name)`
  referencing the SVG symbols in `index.html`. Escape user-facing data with `esc()`.
- State mutations then re-render; no virtual DOM.

**Constraints to respect**

- CSP in `vercel.json`: `script-src 'self'`, `connect-src 'none'`, `base-uri 'none'`,
  `form-action 'none'`. No inline scripts, `eval`, network calls or base-tag usage. All code
  stays in the served `.js` files; external network is limited to the declared Google Fonts.
- `localStorage` is the only persistence. Bumping the storage shape should migrate via the
  `Object.assign({done:{},step:{}}, o)` semantics used in `load()`.
- Keep the course-file → `app.js` script order in `index.html`.
