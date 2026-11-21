# Boxes & Arrows

A mobile-first, no-backend course for learning system design — **43 step-by-step lessons**
(40 rebuilt from the [designed-to-scale](https://designed-to-scale.vercel.app/) course, plus a
3-lesson **Design Judgement** unit), drawn as boxes and arrows.

Everything runs in the browser. There is no server, no build step, no AI service and no
test suite. Progress is stored in `localStorage`.

## Files

- `index.html` — page shell, SVG icon symbols, cache-busted `<script>`/`<link>` tags.
- `styles.css` — all styling (mobile-first, light/dark).
- `course.js` — the core course data as plain globals: `COURSE_UNITS` (9 units) and
  `COURSE_LESSONS` (40 lessons, 445 steps). Each step carries `short`, `chapter`,
  `title`, `body`, `callout`, `changes` and a `scene` (entities + links for the diagram).
- `course-judgement.js` — unit 10, **Design Judgement** (3 lessons, 24 steps). Loaded after
  `course.js` and before `app.js`; pushes onto the same `COURSE_UNITS` / `COURSE_LESSONS`
  globals, so the app needs no changes to render it.
- `app.js` — the whole app in one IIFE. Reads the globals from `course.js`.
- `vercel.json` — static hosting + security headers (CSP).
- `legacy/` — the previous Boxes & Arrows app (question banks, lab, cases, interviews),
  kept for reference. It is not part of the new build.

## Run locally

```sh
npx serve .
# or
python3 -m http.server 8080
```

The app also opens straight from `index.html`. Deploy on Vercel with framework preset
**Other**, no build command, output directory `.`.

## Content source

Lesson text and diagram scenes were extracted from the deployed designed-to-scale bundle
(`assets/index-BeXJu_A0.js`). The scene entities/links are the source diagrams, re-scaled
and re-drawn as boxes and arrows. If the upstream course changes, re-run the extraction
rather than hand-editing `course.js`.

## Conventions

- `course.js` and `course-judgement.js` globals load before `app.js`; keep the script order
  in `index.html`.
- Bump the `?v=` query on `styles.css` / `course.js` / `course-judgement.js` / `app.js` in
  `index.html` after editing them, so cached copies invalidate.
- CSP in `vercel.json` is `script-src 'self'` — no inline scripts, no `eval`, no network
  calls. All code stays in the served `.js` files.
- Persistence is `localStorage` only, under `boxes-and-arrows-v3` (progress) and
  `boxes-and-arrows-theme` (colour theme).
