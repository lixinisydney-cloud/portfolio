# Interactive typography / ghost trail correction

## Why the prior version missed the core behavior

The previous home only moved entire DOM title lines and clipped static images. It did not rasterize or warp individual glyphs, calculate pointer proximity/velocity, maintain a spring response, or sample letter outlines along scroll paths. Similar font proportions did not provide equivalent interaction.

## Reference research boundary

The specifically requested glyphRenderer, mainTraceRenderer, scrollController, heroLayoutController and portalRenderer modules were inspected in the separately cloned reference repository. Their high-level responsibilities are glyph raster caching/warping, trace sampling, normalized document scroll, responsive anchor construction and portal projection. The tutorial and live website remain proxy-blocked with HTTP 403. The reference repository version had previously been rendered and scrolled in Chromium. No reference code, font, brand, image, sound or shader is included in this implementation.

## Original Canvas implementation

`src/components/living-typography.js` owns an aria-hidden fixed Canvas 2D overlay; the real HTML h1 remains accessible. Each own-site glyph is cached as fill and outline canvases at the current font size. Nearby pointer motion applies distance-weighted repulsion, speed-weighted displacement, spring/damping recovery and sinusoidal horizontal raster-strip bending. This deforms a glyph's interior rather than just scaling a DOM box. The title has a slow 2px organic motion while idle.

Document scroll maps to a normalized progress through the first work. Original cubic paths connect hero glyph anchors to a wave of landing positions above the first image. Outline stamps are resampled from zero to the current progress on every draw, rather than accumulated into an irreversible paint buffer. This makes reversing deterministic. A time-based exponential handoff avoids frame-rate-dependent settling. Native scroll anchoring is disabled only on the animated home to prevent the moving portal from compensating the user's scroll position.

The same progress controls the first portal's circular-to-rectangular mask, scale and vertical offset, while the outgoing glyphs fade and the first project's heading becomes readable. Other work chapters retain their previous simpler treatment: this round intentionally concentrates the new system on the hero → first work handoff.

Glyph stamps are tightly cropped to their ink bounds. Scroll-only outlines use a separate cached viewport layer, so idle micro-motion does not redraw hundreds of outlines; a local 1440×900 headless check observed about 30fps at both the hero and a stationary mid-trail state. This is a diagnostic for this environment, not a cross-device performance guarantee.

DPR is capped (desktop 1.5, coarse-pointer 1.25); desktop rendering is capped to 40fps and mobile to 24fps. Mobile uses eight outline samples and no pointer strip warp/idle loop. The loop pauses after the first handoff, on detail navigation, hidden document and reduced motion. Resize rebuilds stamps, route return remeasures anchors, and destroy removes listeners/caches/canvas. Reduced-motion CSS also independently restores the visible HTML title, even when a browser delays a media-query event.

## Video correction

The new detail route no longer uses custom posters, Play buttons or player creation gates:

- Local MP4: native video with controls, playsinline, preload=metadata, no poster and no autoplay.
- YouTube: direct responsive, lazy iframe with strict-origin-when-cross-origin referrer policy and a persistent Watch Online link.
- Source proportions are respected; all clips appear in project order with a large player before Gallery and Tools.
- Local source tags are cleared before unload, preventing a load() call from re-fetching a source while navigating away.
- All six local MP4s are exercised as real decode/playback in Chromium. External YouTube is tested with a controlled provider response; no claim is made that blocked/embedding-disabled videos can play in every network.
- A downloaded file:// preview may have no valid HTTP referrer, which YouTube can reject (including error 153). The preview explains this case and retains the real external URL; using a local HTTP server or Preview hosting is the appropriate embedded-video check. No fake origin/referrer or access bypass is used.

All reviewed Chinese copy, media paths, links and project order remain unchanged. Legacy.html deliberately keeps the archived prior UI, including its old player, for comparison; the redesigned root has no custom cover components.

## Actual browser recordings

`docs/recordings/adrift-dynamics/`:

1. `01-pointer.mp4`: cursor across both title lines, deformation and return.
2. `02-scroll-trails.mp4`: slow downward scroll, per-letter curved outline trails.
3. `03-image-portal.mp4`: progress through the first actual project image reveal.
4. `04-reverse.mp4`: upward scroll back to the starting composition.

These are real Playwright screen recordings converted from the browser WebM recording to H.264 with frame timing retained (video compression applied). A cursor ring and section caption are recording-only overlays; the animation itself runs in the site's browser code. No reference-site frames or animation renders were substituted.

Reproduce: install Playwright's Chromium/ffmpeg for your system, start the production preview, then run `CAPTURE_URL=<preview-url> node scripts/record-dynamic-demo.mjs`. In this cloud machine the already installed system Chromium and ffmpeg were used. No artwork is edited by the recording script.

## Validation / delivery

`npm run build`, `npm test` (27 cases), plus pixel changes, pointer energy/recovery, scroll-linked masks, reverse restoration, frame pause after navigation, reduced motion, resize, direct video markup, all local clips and route tests. Existing 17 legacy regressions remain; redesigned-route assertions now expect the English detail title.

`scripts/build-offline-preview.mjs` creates a standalone HTML and an `artifacts/review/` folder containing HTML + four videos. The existing PR #4 Actions artifact uploads that folder as a real ZIP download. No main merge or Pages/Vercel deployment is performed.

## Review iteration: M → A Letter Anchors

Only the Pets **M** and Anger Market **A** are active in this iteration. Other
chapters keep their existing presentation. Footer and direct-media are unchanged.

The renderer now measures two document-space anchors from the corresponding
section boxes and viewport dimensions. Sticky child positions do not affect the
measurement. A cubic path connects these anchors. Scroll distance determines the
number of cached outlined glyph stamps along this path, blending M into A near
the middle. Arrival changes the destination from outlined to filled and opens
Anger Market's portal. Reverse scroll uses the same equations, without a playback
clock. The hero retains its own idle and pointer deformation, rather than sending
all of SYDNEY'S WORLD down separate curves.

The first two portals belong exclusively to living-typography; scroll-composition
starts at chapter three. Canvas has pointer-events:none. Reduced motion uses the
existing static HTML and unmasked images. Route changes suspend rendering.

Evidence: `docs/recordings/adrift-dynamics/05-letter-anchors-m-a.mp4`, captured from
the production build at 1440×900 with real forward/backward scrolling. Reproduce:
`npm run build`, start `npm run preview -- --port 4174`, then run
`PLAYWRIGHT_BROWSERS_PATH=/tmp/sydney-pw node scripts/record-anchor-demo.mjs`
(the cloud recording cache must contain Playwright's FFmpeg binary).

Validation: build and all 28 Playwright tests pass locally. The new regression
covers progress, destination fill, portal reversal, stationary progress, stable
anchor geometry after resizing, and direct image navigation through the canvas.

### Shared live editing

Use one checkout on the same machine for Codex CLI/IDE and the browser:

```sh
git switch feat/adrift-redesign
npm ci
npm run dev -- --host 0.0.0.0 --port 5173
```

Open http://localhost:5173 in that machine's browser. Codex edits this same folder;
Vite applies those edits through hot reload. A phone on the same network can open
http://YOUR_COMPUTER_LAN_IP:5173 (subject to local firewall settings).

A cloud-chat checkout and a checkout on your computer are separate filesystems.
To get immediate shared edits, run Codex locally in the folder serving Vite;
otherwise synchronize the cloud branch with git push/pull. The downloaded offline
HTML is a snapshot and does not receive hot updates. YouTube embeds in file://
previews have separate origin/referrer restrictions; that investigation remains
in the subsequent task, not this iteration.
