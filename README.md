# SYDNEY'S WORLD

Vite + vanilla JavaScript + Parallax.js portfolio. Five real PNG scene objects, six selected works, accessible previews and shared hash-routed project details. No React, Astro, GSAP or Three.js.

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

Tests use system Chromium at `/usr/bin/chromium`. On another machine, install a Playwright browser and remove `executablePath` from `playwright.config.js` or use your installed Chromium path. The production-path test builds the site and serves it under `/portfolio/` without an SPA fallback.

## Content and code

- `content/projects-draft.json`: **single editorial source** for titles, slugs, categories, summaries, technologies, media, notes and external links. Years remain null. `videos` supplies locally hosted clips; external videos stay as real links.
- `src/projects.js`: imports that JSON and adds only presentation colors/depths and shared asset/link helpers.
- `src/main.js`: scene, selected works, preview dialog, reusable details and hash router.
- `src/style.css`: existing visual language, artwork-specific proportions and responsive composition.
- `src/asset-sizes.json`: intrinsic image sizes for stable layout. If replacing images, update the matching dimensions.
- `public/assets/scene/`: the five scene PNGs and four optional, unused decorations.
- `public/assets/projects/`: supplied WebP covers/galleries and H.264 MP4 clips, already optimized for the web.
- `docs/asset-integration.md`: usage audit, known limitations and missing-material requests.

Parallax owns `.parallax-layer` transforms. Hover/focus scaling belongs to `.world-object`; perspective belongs to `.object-art`. Keep future GSAP transform animations off Parallax wrappers. Images use `object-fit: contain` to avoid distortion or cropping.

Mouse parallax is enabled only for fine-pointer desktop devices above 800px, with reduced motion off. Mobile uses a static grid with always-visible titles. The native dialog supports Escape, focus containment, close and focus return. Every preview includes a View Project link. The horse motion study appears only in Selected Works and is independent of Stubborn Horse.

## GitHub Pages

`vite.config.js` uses `base: './'`: the same build can be hosted at the root or a repository prefix such as `/portfolio/`. Runtime assets are prefixed with `import.meta.env.BASE_URL`; there are no hardcoded `/assets/...` URLs.

Details use `#/projects/<slug>` (e.g. `/portfolio/#/projects/good-boy`). Hash routes always request the real `index.html`, so refresh and browser back/forward work without a server rewrite or `404.html` trick. An unknown project shows a return link. Deploy the generated **dist directory**, not the source directory. No automatic deployment workflow has been added.

Galleries are lazy loaded. Videos have `preload="none"` and receive no `src` until Play is pressed; navigation stops and unloads them. Black-backed city videos remain inside black players, never as transparent scene overlays. Broken images and failed playback show a readable fallback. External links are taken from the supplied data; no third-party API or embed is loaded automatically.

## Validation

`npm run build` and `npm test` cover mouse parallax, six previews, keyboard/touch, reduced motion, all details and galleries, hash refresh/history, mobile overflow, missing-media fallbacks, on-demand video loading and the built site under `/portfolio/`. Production tests request all 37 used asset files and decode each of the five MP4s in Chromium.

## License

The initial repository contained only `.gitattributes` and no license; no project license has been assumed. Parallax.js is MIT licensed, with its notice in `public/THIRD_PARTY_NOTICES.txt`, copied into the build. Supplied project assets retain their original ownership.
