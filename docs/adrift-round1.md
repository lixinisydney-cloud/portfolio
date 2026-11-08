# A Drift direction — round 1 review

## What was researched

The live URL `https://tympanus.net/Demos/ADrift/` returned proxy HTTP 403, including a fresh retry after the user supplied the link again. The managed desktop tools were not available. The supplied public source repository was cloned into `/tmp/adrift-reference`, installed and run separately, and its original page was inspected in Chromium at 1440×900 through successive scroll positions. This verifies the repository version's rendered experience, not the remote deployment's exact current version.

Observed structure: a sparse black introduction, extreme type-to-control scale contrast, traced type continuing through scroll, small image portals growing into larger compositions, overlapping image/type planes, and long pauses before the next visual event. The reference renderer uses React, GSAP/Lenis, WebGL portals and a separate audio engine. Only these architectural observations informed the work. No source, images, font files, branding, video, sound or screenshots from that project were copied into this repository or its preview.

## Original implementation

- `index.html` / `src/main.js`: new English-first homepage shell and existing hash routes. No project preview dialog.
- `src/components/work-stream.js`: data-driven 8+1 ordered chapters; English display aliases are presentation only. Original Chinese editorial JSON and media paths remain unchanged.
- `src/components/scroll-composition.js`: native scrolling, IntersectionObserver and one requestAnimationFrame scheduled on input. Only nearby chapters get mask updates. No perpetual loop, sound, letter generator, new animation dependency or WebGL.
- `src/adrift.css`: warm black/chalk/vermillion palette, original typographic composition using system fonts, two restrained outline echoes, alternating image scales/positions and DOM portal masks.
- Images alone are semantic links to the existing detail route. Focus fully reveals masks, the caption sits outside the clickable image box, pointer and keyboard enter in one step, back navigation restores the image and reading position even after detail refresh.
- Mobile uses compact, non-sticky chapters and reduced mask/text travel. Reduced motion removes masking and movement. About and Contact remain reachable from the fixed navigation.
- No world, animal, pearl UI, reference media or video requests occur on the new homepage. Existing user project covers are used unchanged, and the full original image ratio is restored when each portal is open.

## Order and language

01 The Making of Pets / 制作宠物
02 Anger Market / 愤怒市场
03 Chroma Residences / 彩色公寓
04 Stubborn Horse / 固执的马
05 Dragon Dance / 舞龙
06 The Uncertain Oracle / 不确定的神谕
07 City Life Is Fun / 城市生活有意思
08 GOOD BOY / 交互装置
09 Horse Motion Study / 马的算法动画研究 — separate Experimental Work

Homepage headings, navigation and action labels are English; Chinese subtitles remain smaller. No full project summaries are rendered on the homepage. The reviewed About copy and all project introductions remain intact in Chinese.

## Scope boundary: round 2 is still pending

The nine existing detail routes continue to render the current reviewed content and existing click-to-load video components via `src/components/detail-view.js`. This round does **not** claim to have completed the requested English-first detail headings, Introduction → Links → Video → Gallery → Tools order, large native MP4 players or directly embedded YouTube iframes. Those changes belong to round 2 after homepage review.

## Old version preserved

`legacy.html` loads `src/legacy-main.js`, which retains the previous island homepage, original modal flow and detail implementation. Old CSS, world component and media assets remain untouched. Vite builds both entry pages with the original relative base. Existing 17 regression cases run against `legacy.html`; five new homepage cases and one production-prefix case cover the new root entry. No tests were skipped or removed.

## Preview without publishing

- Source preview: run `npm ci` then `npm run dev` on this branch. Root is the redesign; `/legacy.html` is the old version. Use the local address printed by Vite when running on your own computer.
- Production preview: `npm run build` then `npm run preview`.
- Standalone review file: `node scripts/build-offline-preview.mjs` creates `artifacts/sydneys-world-round1-preview.html`. It embeds this site's compiled JS/CSS and its project media, so no Node/server is required after downloading. Open the HTML in a normal browser; external links/YouTube still require their respective networks. If a managed browser blocks file URLs, serve the directory with `python -m http.server 8000`.
- The generated file is about 15MB because existing images and MP4s are embedded. This is a **review artifact only**; production still uses lazy images and separate on-demand media. The generated file is gitignored and not copied into dist.
- The standalone document was served unchanged through an independent local HTTP server and verified in Chromium: nine image links, image decoding, direct detail navigation, no page errors and no secondary network requests for homepage media. The cloud browser policy blocks `file://`, so local-file launching could not be tested inside this managed browser.
- Actual screenshots: `docs/screenshots/adrift-round1/home-1440x900.png`, `home-390x844.png`, `work-1440x900.png`, `work-390x844.png`.

## Verification

`npm run build`, `npm test` (23 passed), and `git diff --check`. Tests cover exact order, all nine image-only routes, refresh/back, reviewed Chinese data preservation, native-scroll masking, reduced motion, mobile touch/navigation, legacy functionality, byte-range video responses and `/portfolio/` build URLs.

Branch: `feat/adrift-redesign`. Main and the published site are unchanged. No temporary public deployment or automatic merge is requested.
