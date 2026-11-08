# SYDNEY'S WORLD V1

The approved M → A renderer now connects all nine work chapters in the order
M → A → C → S → D → U → C → G → H. The same section-based geometry and reversible
scroll equations drive every segment. M → A retains its approved sampling; later
segments use fewer outlines. Desktop/mobile artwork rectangles mask trail ink.
Only nearby segments are rasterized, glyph stamps are reused between resizes,
and solid-glyph animation suspends when no active glyph is in view. Reduced motion
keeps the static accessible HTML and unmasked images. No new dependency was added.

The footer uses an original black/white line grid with real Email, GitHub and
Instagram links, 2026, signature and Back to Top. English detail titles and Chinese
subtitles share homepage presentation labels; reviewed Chinese descriptions and
all canonical asset/video/external URLs remain unchanged. Next Project includes
the separate Horse Motion Study. The archived island remains at legacy.html.

## Validation and evidence

- `npm run build`: passed.
- `npm test`: all 31 browser tests passed locally, including all nine forward and
  reverse anchors at 1440×900 and 390×844, route/refresh/back, idle suspension,
  reduced motion and all six native MP4 videos playing with advancing time.
- Six local clips are H.264/yuv420p (horse 16:9, four city squares, city poster 3:4).
- Recording: `docs/recordings/adrift-dynamics/06-v1-all-nine-anchors.mp4`.
- Actual browser screenshots: `docs/screenshots/v1/`.

## YouTube and live verification

No custom poster gate is mounted. YouTube uses responsive privacy-enhanced
iframes with `strict-origin-when-cross-origin`; native video uses controls and
playsinline without autoplay. Every YouTube player has a persistent Watch Online
link plus an operational fallback instruction. No fake Referer, proxy or embed
workaround is used. file:// cannot supply an HTTP origin/referrer, so error 153
in that mode does not establish a production player defect.

The cloud environment blocks youtube-nocookie.com and the GitHub Pages hostname
at its CONNECT proxy with HTTP 403. HTTP browser attempts show a network error,
not evidence of disabled embedding or a particular YouTube 153 response. Local
functional tests use explicit provider fixtures for structure, not playback.
`scripts/check-live-site.mjs` separately runs against real HTTP/HTTPS origins,
checks all nine routes/gallery assets/native playback, captures genuine provider
playback or individual errors and observed Referer, and probes external URLs.
YouTube playback is reported separately from first-party checks; a successful
site check must not be described as confirmed YouTube playback.

The existing Pages build/deploy gates remain unchanged. A post-deployment
`Verify live HTTPS site` job now runs on main and uploads live screenshots and
`report.json` as `live-site-verification`. That report records network/platform
restrictions rather than silently treating a provider fixture as a working video.
