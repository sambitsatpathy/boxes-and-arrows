# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Boxes & Arrows is a static, no-backend, no-build course app for learning system design.
Everything runs in the browser: a home "course map" of units, and a step-by-step lesson
walker where each step is a short walkthrough with a boxes-and-arrows SVG diagram.
Progress is stored in `localStorage`. There is no server, no AI service, no bundler and no
test suite. 53 lessons across 12 units.

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
node --check app.js && node --check course.js && node --check course-judgement.js && node --check course-enhance.js
```

There is no lint or build step. Changes appear on a browser refresh. Asset URLs in
`index.html` carry cache-busting query strings (`?v=...`); bump them when editing a file so
cached copies are invalidated.

## Architecture

**Files and ownership**

- `index.html` — page shell, SVG icon symbols, cache-busted `<script>`/`<link>` tags, noscript fallback.
- `styles.css` — all styling (mobile-first, light/dark). Unit accents are CSS vars `--u1` … `--u12`,
  defined in the light `:root`, the `prefers-color-scheme:dark` block, and the
  `:root[data-theme="dark"]` block — update all three when adding a unit.
- `course.js` — core course data as plain globals: `COURSE_UNITS` (9 units) and
  `COURSE_LESSONS` (40 lessons). Extracted from the designed-to-scale bundle; prefer
  re-extraction over hand-editing.
- `course-judgement.js` — unit 10 (Design Judgement, 3 lessons). Pushes onto the same globals.
- `course-enhance.js` — units 11–12 (Networking & the Edge; Patterns & Data Modelling, 10 lessons).
  Pushes onto the same globals.
- `app.js` — the entire application in one IIFE. Reads `COURSE_UNITS` / `COURSE_LESSONS`.
- `vercel.json` — static hosting + security headers (CSP). Keep changes CSP-compatible.

**Script order matters:** `course.js` → `course-judgement.js` → `course-enhance.js` → `app.js`.
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

- `S = {done:{lessonId:true}, step:{lessonId:stepIndex}}`, loaded from `localStorage` key
  `"boxes-and-arrows-v3"`; theme from `"boxes-and-arrows-theme"`. Persisted with `save()`.
- `view` is `"home"` or `"lesson"`; `current = {unit, lesson, step}`. `render()` dispatches to
  `renderHome()` / `renderStep()`, each rebuilding `app.innerHTML` from HTML strings.
- UI is event-driven by delegation: one click listener on `#app` reads `data-act`
  (`open`, `home`, `next`, `back`, `theme`, `jump`). Keyboard: ←/→ step, Esc home, `t` theme.
- Finishing the last step marks `S.done[lesson]=true` and returns home.

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
