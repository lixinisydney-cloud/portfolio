# SYDNEY'S WORLD

Vite + vanilla JavaScript + Parallax.js portfolio. An original C4D island with four accessible project destinations, eight Chinese-first main works plus one separate algorithmic experiment, previews and hash-routed details. No React, Astro, GSAP or Three.js.

## Development

Node.js 20.19+ or 22.12+ and npm (validated with Node 24).

```sh
npm ci
npm run dev
npm run build
npm test
npm run preview
```

For a read-only home directory, use `npm ci --cache /tmp/sydney-npm-cache`.
Use the existing checkout; a separate Git worktree is unnecessary.

Local tests use system Chromium at `/usr/bin/chromium`; CI uses the Chromium installed by Playwright. On another machine, install a Playwright browser and remove `executablePath` from `playwright.config.js` or use your installed Chromium path. The production-path test builds the site and serves it under `/portfolio/` without an SPA fallback.

## Content and code

- `content/projects-draft.json`: **single editorial source** for titles, slugs, categories, summaries, technologies, media, notes and external links. Years remain null. `videos` supplies locally hosted clips; external videos stay as real links.
- `src/projects.js`: imports that JSON and adds only presentation colors/depths and shared asset/link helpers.
- `src/main.js`: scene, selected works, preview dialog, reusable details and hash router.
- `src/style.css`: existing visual language, artwork-specific proportions and responsive composition.
- `src/asset-sizes.json`: intrinsic image sizes for stable layout. If replacing images, update the matching dimensions.
- `public/assets/scene/`: the original scene PNGs retained as project/source media; the homepage now uses `public/assets/world/island-main.webp`.
- `public/assets/projects/`: supplied WebP covers/galleries and H.264 MP4 clips, already optimized for the web.
- `docs/asset-integration.md`: usage audit, known limitations and missing-material requests.

Parallax owns `.parallax-layer` transforms. Hover/focus scaling belongs to `.world-object`; perspective belongs to `.object-art`. Keep future GSAP transform animations off Parallax wrappers. Images use `object-fit: contain` to avoid distortion or cropping.

Mouse parallax is enabled only for fine-pointer desktop devices above 800px, with reduced motion off. Mobile uses a static grid with always-visible titles. The native dialog supports Escape, focus containment, close and focus return. Every preview includes a View Project link. The horse motion study appears in the separate experiment area and is independent of Stubborn Horse.

## GitHub Pages

`vite.config.js` uses `base: './'`: the same build can be hosted at the root or a repository prefix such as `/portfolio/`. Runtime assets are prefixed with `import.meta.env.BASE_URL`; there are no hardcoded `/assets/...` URLs.

Details use `#/projects/<slug>` (e.g. `/portfolio/#/projects/good-boy`). Hash routes always request the real `index.html`, so refresh and browser back/forward work without a server rewrite or `404.html` trick. An unknown project shows a return link. Deploy the generated **dist directory**, not the source directory. The Pages workflow below publishes this directory automatically after main passes validation.

Galleries are lazy loaded. VideoPoster displays a local poster first; local videos and YouTube iframes are created only after Play is pressed. Navigation stops and unloads both. Black-backed city videos remain inside black players, never as transparent scene overlays. Broken images and failed playback show a readable fallback. External links are taken from the supplied data; YouTube embeds load only after an explicit click.

## Validation

`npm run build` and `npm test` cover mouse parallax, nine previews, keyboard/touch, reduced motion, all details and galleries, hash refresh/history, mobile overflow, missing-media fallbacks, on-demand video loading and the built site under `/portfolio/`. Production tests request referenced media/posters and decode all five local MP4s in Chromium. YouTube is tested with a blocked-provider response and a persistent external fallback, without automatic external requests.

## Deploy to GitHub Pages

1. Open repository **Settings → Pages → Build and deployment → Source**, select **GitHub Actions**.
2. Merge the project/deployment pull request into `main`. The branch contains the existing MVP and real-project integration as well as Pages configuration, since `main` previously contained assets only.
3. In **Actions → Deploy to GitHub Pages**, confirm **Build and test** and **Publish GitHub Pages** both succeed. If the `github-pages` environment has required reviewers, complete that review in GitHub.
4. The intended public URL is **https://lixinisydney-cloud.github.io/portfolio/**. A detail URL is **https://lixinisydney-cloud.github.io/portfolio/#/projects/good-boy**.

`.github/workflows/pages.yml` installs Node 24, runs `npm ci`, `npm run build`, installs Playwright Chromium and runs all browser tests. PRs validate without deploying. A push to `main`, or a manual workflow run on `main`, uploads `dist` and deploys it using the official Pages actions. The deploy job has only `pages: write` and `id-token: write` in addition to the read-only build permissions. No personal token or custom deployment secret is needed.

Keep `base: './'` in Vite: both generated entry files and runtime media paths resolve within `/portfolio/`. Hash details do not change the document path. The production test serves actual build files under `/portfolio/`, checks all 37 referenced assets and decodes all five MP4s; this is local verification, not proof of a live deployment.

After the deploy job succeeds, check the public homepage, one project URL on refresh, Back navigation, images and a click-to-load video. A green PR build alone does not mean the site has been published.

## License

The initial repository contained only `.gitattributes` and no license; no project license has been assumed. Parallax.js is MIT licensed, with its notice in `public/THIRD_PARTY_NOTICES.txt`, copied into the build. Supplied project assets retain their original ownership.

## Phase A content foundation

See [migration, component, poster provenance and missing-media guide](docs/phase3a-content-foundation.md). Run `node scripts/merge-project-content.mjs` to merge verified editorial content by slug, or use `--check` to verify repeatability without writing. Existing media paths are preserved. Site copy and contact details are in `content/site.json`; the source files stay in `planning/phase3a/`. Hero artwork, object geometry, the existing grid rules and Pages base are unchanged.

## Phase B visual integration

See [composition, asset usage and verification](docs/phase3b-visual-integration.md). The scene uses the supplied original island and three Parallax wrappers, with four real HTML project buttons. Mobile loads only the island, not the desktop animals/decorations. World styling lives in `src/world.css`; editorial content and all phase-A actions remain intact.

After starting the dev server, run `node scripts/capture-homepage.mjs` to capture the actual 1440×900 and 390×844 homepages in `docs/screenshots/`. `CAPTURE_URL` can select a running production preview.

## Typography redesign — round 1

On `feat/adrift-redesign`, the root entry is a new native-scroll typography/image composition; the previous site remains at `legacy.html`. Both entries are built with the same GitHub Pages base. Details retain the prior content/media behavior until round 2.

See [research, implementation boundary, screenshots and preview instructions](docs/adrift-round1.md). Generate a standalone browser review file with `node scripts/build-offline-preview.mjs`; this embeds only our media and implementation and is never deployed. No reference code, imagery, fonts or sound are bundled.

For an independent Vercel Preview (without touching Pages), see [preview setup and account authorization steps](docs/preview-deployment.md). `vercel.json` disables Git-triggered Vercel deployments; an authenticated manual `vercel deploy` targets Preview by default. No Vercel deployment URL exists until that command actually succeeds.

## Interactive typography correction and direct video

The redesigned root now uses original per-glyph Canvas deformation, scroll-sampled ghost trails and a shared first-image portal timeline. See [implementation, validation and four real browser recordings](docs/interactive-typography.md). The existing archived `legacy.html` is unchanged.

Root detail pages now use direct native MP4 controls and direct responsive YouTube embeds (with Watch Online fallback), without custom cover gates. Offline file origins or network restrictions may prevent external YouTube embedding; local MP4s remain embedded in the standalone preview.

The PR's downloadable preview artifact now contains the interactive HTML and a `videos/` folder with the four demonstrations. Nothing is merged or deployed to main.
