# Codex task 2 — integrate real assets into existing SYDNEY’S WORLD MVP

IMPORTANT: Work on the **existing codebase**. The working MVP previously reported `index.html`, `src/main.js`, `src/projects.js`, `src/style.css`, `package.json`, and a successful `npm run build`. Do **not** scaffold a fresh Astro, React, or Three.js project. Before editing, inspect the actual current branch and files.

I have now uploaded the contents of `public/assets/` and `content/projects-draft.json`, with original-to-new paths listed in `asset-manifest.csv`.

## Stage A — make real assets visible without breaking first-stage MVP
1. Confirm exactly 5 scene PNGs exist: `scene/good-boy.png`, `scene/making-of-pets.png`, `scene/city-life.png`, `scene/anger-market.png`, `scene/chroma-residences.png`. Keep the existing five object positions, parallax handling, preview modal, hover, touch, keyboard interactions and reduced-motion support.
2. Replace the five placeholder image sources only. Preserve separate DOM transforms between Parallax.js and hover scaling. Give each object semantic accessible labels; use `object-fit: contain` and do not distort images.
3. Import or merge `content/projects-draft.json` into current `src/projects.js` as the **single source of project data**. Preserve any existing useful data schema. Do not double-maintain arrays of work items.
4. Show all 6 projects in Selected Works, while exactly 5 have scene objects. For the sixth project (Horse Motion Study), show it in Selected Works only. Align scene objects with the correct slugs.
5. Follow relative asset-path rules for Vite and GitHub Pages project URLs: `import.meta.env.BASE_URL` prefix or correct equivalent. Do not hardcode `/assets` or localhost URLs. Handle currently configured repository base reliably.
6. Titles, summaries and links should follow `projects-draft.json`. Years are intentionally null; do not invent dates, team credits, metrics, client names or exhibition names.
7. Good Boy's cover is low-resolution; City Life's cover is provisional. Preserve explicit notes in content or TODOs instead of falsely claiming these are final assets.
8. City short MP4s are H.264 but have a BLACK background, not transparent. Never overlay them as if alpha-channel videos; embed in a suitable background on the project detail page if used.
9. The generative horse-motion study is not the interactive project named 'Stubborn Horse: A Playful Feeding Ritual'. Keep the titles/links separate.
10. Keep existing first-stage styling and interactions intact. Prioritize a polished desktop portfolio and usable mobile layout over adding new animations.

## Stage B — reusable project details (after Stage A is working)
1. Add accessible, reusable detail view for each project with a hero image, concise intro, tech tags, gallery, video if any, and actual external links. Provide a back-to-works action.
2. Choose a GitHub Pages-compatible route strategy with robust page refresh and back-button behavior; if using vanilla JS SPA, hash routes like `#/projects/good-boy` are acceptable. Avoid client-only history routing without static fallback.
3. For the project-page image and video paths, consume the shared project data. Prefer lazy-loading galleries, use `loading=lazy` where appropriate, autoplay muted inline only for small previews, and avoid loading all videos on initial homepage render.
4. Implement explicit fallback/missing-asset UI, do not render broken images, and keep the project page readable even if video playback is blocked.
5. Make no external API calls and do not fabricate new assets. Keep the source repo and existing file structure as stable as possible.

## Final verification
- Run `npm run build` and the existing Playwright tests; fix regressions.
- Test keyboard, touch, reduced-motion, project click, preview modal, details, reload, back button and mobile viewport.
- Verify generated file paths under the GitHub Pages base URL.
- List files edited, any assets not yet used, and unresolved missing photos.
- Open PR/commit the changes so they exist on GitHub; don't leave work only in an unpushed workspace.
