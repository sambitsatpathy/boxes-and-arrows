# Boxes & Arrows

A mobile-first, no-backend course for learning system design — **68 step-by-step lessons**
across **17 units**, drawn as boxes and arrows, with Duolingo-style quick-check quizzes,
XP, hearts, streaks and a spaced **Review** mode.

- **40 lessons** rebuilt from the [designed-to-scale](https://designed-to-scale.vercel.app/) course.
- **Unit 10 · Design Judgement** (3 lessons) — synthesis lessons from the daily learning-drip series.
- **Units 11–12 · Networking & the Edge / Patterns & Data Modelling** (10 lessons) — grounded in
  [karanpratapsingh/system-design](https://github.com/karanpratapsingh/system-design),
  [donnemartin/system-design-primer](https://github.com/donnemartin/system-design-primer) and
  [ByteByteGoHq/system-design-101](https://github.com/ByteByteGoHq/system-design-101).
- **Unit 13 · Build the Giants: Messaging** (3 lessons) — WhatsApp, Discord's message store
  and the journey of a Slack message, grounded in the system-design-101 guides.
- **Unit 14 · Build the Giants: Media** (3 lessons) — YouTube's upload pipeline, live
  streaming and the four ways Netflix caches, grounded in the system-design-101 guides.
- **Unit 15 · Build the Giants: Social & Mail** (3 lessons) — Twitter's For You funnel and
  service architecture, the end-to-end journey of an email, and Reddit's core architecture,
  grounded in the system-design-101 guides.
- **Unit 16 · Build the Giants: Mobility & Commerce** (3 lessons) — Uber’s API layer and
  proximity search, Airbnb’s monolith-to-services migration, and e-commerce plus Brazil builds,
  grounded in the system-design-101 guides.
- **Unit 17 · Build the Giants: Payments** (3 lessons) — designing a payment system, UPI in
  India, and avoiding double payment, grounded in the system-design-101 payment guides.

Everything runs in the browser. There is no server, no build step, no AI service and no
test suite. Progress is stored in `localStorage`.

## Files

- `index.html` — page shell, SVG icon symbols, cache-busted `<script>`/`<link>` tags.
- `styles.css` — all styling (mobile-first, light/dark). Unit accents are `--u1` … `--u17`.
- `course.js` — the core course data as plain globals: `COURSE_UNITS` (9 units) and
  `COURSE_LESSONS` (40 lessons, 445 steps). Each step carries `short`, `chapter`,
  `title`, `body`, `callout`, `changes` and a `scene` (entities + links for the diagram).
- `course-judgement.js` — unit 10, **Design Judgement** (3 lessons, 24 steps).
- `course-enhance.js` — units 11–12, **Networking & the Edge** and **Patterns & Data Modelling**
  (10 lessons, 80 steps).
- `course-unit13.js` — unit 13, **Build the Giants: Messaging** (3 lessons, 41 steps).
- `course-unit14.js` — unit 14, **Build the Giants: Media** (3 lessons, 44 steps).
- `course-unit15.js` — unit 15, **Build the Giants: Social & Mail** (3 lessons, 42 steps).
- `course-unit16.js` — unit 16, **Build the Giants: Mobility & Commerce** (3 lessons, 44 steps).
- `course-unit17.js` — unit 17, **Build the Giants: Payments** (3 lessons, 39 steps).
- `course-quizzes.js` — the quiz bank (`QUIZ_BANK`, 84 questions) plus one or two "Quick check"
  steps injected into every lesson before its recap. Also feeds Review mode.
- `app.js` — the whole app in one IIFE: course walker, quiz engine, XP/hearts/streak and Review.
- `mascot-concepts.html` — standalone ideation board with three animated mascot concepts (not loaded by the app).
- `vercel.json` — static hosting + security headers (CSP).

The course files all push onto the same `COURSE_UNITS` / `COURSE_LESSONS` globals and
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
- Unit 13: written from the ByteByteGo messaging guides — login/presence, sequencing and
  message stores, sync queues, receipts, groups, E2E, Discord's storage evolution and
  Slack's five-server delivery path. Guide URLs are credited in each lesson body.
- Unit 14: written from the ByteByteGo media guides — YouTube's 500+ hours/min upload
  pipeline and VCUs, live streaming's encode/segment/CDN path, and the four roles EVCache
  plays in Netflix's architecture. Guide URLs are credited in each lesson body.
- Unit 15: written from the ByteByteGo social and mail guides — the five-stage For You
  recommendation funnel, the 2022 timeline service graph, the MUA/MTA/MDA journey of an
  email, and Reddit's CDN, federation, cache and queue architecture. Guide URLs are
  credited in each lesson body.
- Unit 16: written from the ByteByteGo mobility and commerce guides — Uber’s three API-layer
  generations, geohash-based proximity search, Airbnb’s four SOA service roles, the four
  e-commerce business areas and Amazon’s Brazil build system. Guide URLs are credited in
  each lesson body.

## Conventions

- Course globals load before `app.js`; keep the script order in `index.html`
  (`course.js` → `course-judgement.js` → `course-enhance.js` → `course-unit13.js` →
  `course-unit14.js` → `course-unit15.js` → `course-unit16.js` → `course-unit17.js` →
  `course-quizzes.js` → `app.js`).
- Bump the `?v=` query on `styles.css` / `course.js` / `course-judgement.js` /
  `course-enhance.js` / `course-unit13.js` /  `course-unit14.js` / `course-unit15.js` /
  `course-unit16.js` / `course-unit17.js` / `course-quizzes.js` / `app.js`
  in `index.html` after editing them, so cached copies invalidate.
- Adding a unit: push a unit object onto `COURSE_UNITS`, add its lessons to `COURSE_LESSONS`,
  and define its `--uN` accent in `styles.css` (light + both dark blocks).
- CSP in `vercel.json` is `script-src 'self'` — no inline scripts, no `eval`, no network
  calls. All code stays in the served `.js` files.
- Persistence is `localStorage` only, under `boxes-and-arrows-v3` (progress, XP, hearts,
  streak, quiz answers) and `boxes-and-arrows-theme` (colour theme).

## Quizzes & gamification

- Every lesson ends with one or two **Quick check** steps (`chapter:"quiz"`), injected by
  `course-quizzes.js` just before the recap. A quiz step can't be skipped: the Next button
  stays disabled until an answer is picked, then shows immediate feedback (correct/incorrect
  plus a one-line why).
- **XP**: +10 per correct answer. **Hearts**: start at 5, −1 per wrong answer, +1 per completed
  lesson and per correct review answer. At 0 hearts the app diverts to Review until you refill.
- **Mascot**: Boxy, an inline-SVG box character, peeks in from the bottom-right for ~2.4s on every
  answer (happy hop + sparks on correct, wobble + sweat on wrong). It lives in `.mascot-dock`, a
  sibling of `#app` in `index.html`, so step re-renders cannot remove it. `answer()` in `app.js`
  calls `mascotReact(ok)`; `renderStep()`/`renderHome()` call `mascotHide()`. The dock is
  `pointer-events:none`, uses the same theme tokens as the rest of the app, and inherits the global
  reduced-motion rule.
- **Streak**: one day counted per day with a completed lesson.
- **Review** (home button): a 10-question spaced session drawn from lessons you have done
  (all lessons if none yet), with its own answer store so it always re-asks.
