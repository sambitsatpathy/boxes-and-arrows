# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Boxes & Arrows is a static, no-backend, no-build course app for learning system design. Everything runs in the browser: lessons with question banks, an architecture lab, guided design cases, mock interviews, and progress (localStorage). There is no server, no AI service, no bundler, and no test suite.

## Commands

Run locally (serves `index.html` and the JS/CSS at the root):

```sh
npx serve .
# or: python3 -m http.server 8080
```

The app can also be opened directly with `open index.html` (some browser features differ, but it works).

Deploy on Vercel: framework preset "Other", no build command, output directory `.`. Any static host works.

```sh
npx vercel
```

Syntax-check the two scripts (no tests exist):

```sh
node --check app.js && node --check content.js
```

There is no lint or build step. Changes appear on a browser refresh. Asset URLs in `index.html` carry cache-busting query strings (`?v=...`); bump them when editing `styles.css`, `content.js`, or `app.js` so cached copies are invalidated.

## Architecture

**Files and ownership**

- `index.html` — page shell, SVG icon symbols, cache-busted `<script>`/`<link>` tags, noscript fallback.
- `styles.css` — all styling.
- `content.js` — all course data as plain globals; must load before `app.js` (it is loaded first in `index.html`). Defines `UNITS`, `BUILDS`, `CASES`, `INTERVIEWS`, plus helpers `mc`/`order`/`match`/`lesson`/`unit` and `tc` (teaching concept).
- `app.js` — the entire application in one IIFE. Reads the globals from `content.js`.
- `vercel.json` — static hosting + security headers (CSP). Keep changes CSP-compatible.

**Data model (content.js)**

- `UNITS` is an array of `unit(title, blurb, icon, lessons)`; each `lesson(title, sub, ex)` has `ex`, an array of question objects (`mc`, `order`, `match`).
- Teaching concepts (`tc(h, p, pts, key)`) and extra questions are attached after the fact via `add(id, teach, more)` (pushed to `PEND`), which merges into the matching lesson by id after `FLAT` is built.
- IDs are assigned at the end of `content.js`: `l.id = ui+1 + "-" + li+1` (e.g. `"1-2"`), plus `l.ui`, `l.li`.
- `FLAT` is the flat list of all lessons in unit order; it defines global lesson order and the unlock chain (`unlocked()` requires the previous lesson in `FLAT` to be done).
- `BUILDS`, `CASES`, `INTERVIEWS` follow the same global-array + `...Of(id)` lookup pattern.

**App state (app.js)**

- Single global save state `S`, loaded from `localStorage` key `"boxes-and-arrows-v2"`, schema from `fresh()`. Persisted with `save()`. Tracks XP, streak, daily XP, per-lesson done/seen, lab bests, cases, interview bests/runs.
- View/routing is a string (`view`) among `path`, `notes`, `lesson`, `complete`, `failed`, `build`, `cases`, `interview`, `progress`; `go(tab)` dispatches to renderers, each of which rebuilds `app.innerHTML` from templates.
- UI is event-driven by delegation: one click listener on `#app` reads `data-act` and dispatches to handlers (`extra()` for tab/lab/case/interview actions); keyboard shortcuts handled separately.
- Rendering helpers: `topBar()`, `navBar()`, `esc()`, `paras()`.

**Feature modules (all inside the app.js IIFE)**

- Path/lessons (`renderPath`, `startLesson`, `prep`, `check`, `next`, `complete`, `failed`): three question types mc/order/match, 5 hearts, retry queue, teaching cards before questions, seen-tracking so repeated practice covers the whole bank (`SET=10` drawn per run).
- Build lab (`LAB`): per-scenario canvas state (`LAB.per[id]` with nodes/edges/res), seed layout, mode move/connect/erase, scoring via `runCheck` over `sc.checks` (links/min/any/connected), awards XP only for new best per scenario.
- Cases (`CS`): sequential decision steps, first-try correctness, summary/trade-offs.
- Interview (`IV`): 20-minute countdown (`startTimer`/`tickT`), 5 stages, self-ticked rubric points, scored 0–100, stopped on navigation.
- Progress (`renderProgress`): mastery, weakest unit pick, records.

**Rendering conventions**

- Templates are plain HTML strings built with `+` concatenation; icons via `ic(name)` referencing the SVG symbols in `index.html`.
- State mutations then re-render; no virtual DOM. After mutating `L`/`LAB`/`CS`/`IV`, call the relevant renderer so the DOM matches.

**Constraints to respect**

- CSP in `vercel.json`: `script-src 'self'`, `connect-src 'none'`, `base-uri 'none'`, `form-action 'none'`. Do not add inline scripts, `eval`, network calls, or base-tag usage. All code must stay in the served `.js` files; external network is limited to fonts/stylesheets already declared. Progress and content are persisted only via `localStorage`, not a network API.
- `localStorage` is the only persistence; `KEY="boxes-and-arrows-v2"`. Bumping storage shape should migrate via `Object.assign(fresh(), o)` semantics used in `load()`.
- Content must load before app logic; maintain the `<script src="content.js">` then `<script src="app.js">` order in `index.html`.
