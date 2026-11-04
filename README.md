# Boxes & Arrows

A static, no-backend course for learning system design. Lessons with teaching notes and question banks, an architecture lab with several scenarios, guided design cases, and mock interviews. Progress is stored in the browser (localStorage). There is no server, no build step and no AI service.

## Files
- `index.html` page shell
- `styles.css` styles
- `content.js` all lessons, scenarios and interviews (plain data)
- `app.js` the app
- `vercel.json` security headers (CSP)

## Deploy on Vercel
1. Put this folder in a Git repo, or run `npx vercel` inside it.
2. Framework preset: **Other**. Build command: none. Output directory: `.` (the folder that holds `index.html`).
3. Deploy.

Any static host works too. Fonts load from Google Fonts and fall back to system fonts if blocked.

## Run locally
`npx serve .` (or open `index.html` directly).
