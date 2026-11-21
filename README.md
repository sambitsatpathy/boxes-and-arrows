# Boxes & Arrows

A mobile-first, no-backend course for learning system design — **53 step-by-step lessons**
across **12 units**, drawn as boxes and arrows.

- **40 lessons** rebuilt from the [designed-to-scale](https://designed-to-scale.vercel.app/) course.
- **Unit 10 · Design Judgement** (3 lessons) — synthesis lessons from the daily learning-drip series.
- **Units 11–12 · Networking & the Edge / Patterns & Data Modelling** (10 lessons) — grounded in
  [karanpratapsingh/system-design](https://github.com/karanpratapsingh/system-design),
  [donnemartin/system-design-primer](https://github.com/donnemartin/system-design-primer) and
  [ByteByteGoHq/system-design-101](https://github.com/ByteByteGoHq/system-design-101).

Everything runs in the browser. There is no server, no build step, no AI service and no
test suite. Progress is stored in `localStorage`.

## Files

- `index.html` — page shell, SVG icon symbols, cache-busted `<script>`/`<link>` tags.
- `styles.css` — all styling (mobile-first, light/dark). Unit accents are `--u1` … `--u12`.
- `course.js` — the core course data as plain globals: `COURSE_UNITS` (9 units) and
  `COURSE_LESSONS` (40 lessons, 445 steps). Each step carries `short`, `chapter`,
  `title`, `body`, `callout`, `changes` and a `scene` (entities + links for the diagram).
- `course-judgement.js` — unit 10, **Design Judgement** (3 lessons, 24 steps).
- `course-enhance.js` — units 11–12, **Networking & the Edge** and **Patterns & Data Modelling**
  (10 lessons, 80 steps).
- `app.js` — the whole app in one IIFE. Reads the globals from the course files.
- `vercel.json` — static hosting + security headers (CSP).

The three course files all push onto the same `COURSE_UNITS` / `COURSE_LESSONS` globals and
load **before** `app.js`, so the app renders every unit with no per-unit code.

## Run locally

```sh
npx serve .
# or
python3 -m http.server 8080
```

The app also opens straight from `index.html`. Deploy on Vercel with framework preset
**Other**, no build command, output directory `.`.

## Content source

- Units 1–9: lesson text and diagram scenes extracted from the deployed designed-to-scale
  bundle (`assets/index-BeXJu_A0.js`). If the upstream course changes, re-run the extraction
  rather than hand-editing `course.js`.
- Unit 10: written for the daily learning-drip series (guarantees, consistency, scaling).
- Units 11–12: written from the three reference repos above — TCP/UDP, DNS, proxies, API
  gateway/BFF, idempotency, circuit breakers, backpressure, event sourcing/CQRS,
  normalization/denormalization, geohashing/quadtrees.

## Conventions

- Course globals load before `app.js`; keep the script order in `index.html`
  (`course.js` → `course-judgement.js` → `course-enhance.js` → `app.js`).
- Bump the `?v=` query on `styles.css` / `course.js` / `course-judgement.js` /
  `course-enhance.js` / `app.js` in `index.html` after editing them, so cached copies invalidate.
- Adding a unit: push a unit object onto `COURSE_UNITS`, add its lessons to `COURSE_LESSONS`,
  and define its `--uN` accent in `styles.css` (light + both dark blocks).
- CSP in `vercel.json` is `script-src 'self'` — no inline scripts, no `eval`, no network
  calls. All code stays in the served `.js` files.
- Persistence is `localStorage` only, under `boxes-and-arrows-v3` (progress) and
  `boxes-and-arrows-theme` (colour theme).
