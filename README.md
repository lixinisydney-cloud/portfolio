# SYDNEY'S WORLD

A lightweight 2.5D portfolio MVP for a Creative Technologist / Interactive Designer.
All five projects and their images are original placeholder studies, not real client work.

## Develop

Requires Node.js 20.19+ or 22.12+ (validated with Node 24) and npm.

```sh
npm ci
npm run dev
npm run build
npm run preview
```

In a cloud machine with a read-only home directory, use `npm ci --cache /tmp/sydney-npm-cache`.
Use the existing checkout; a separate Git worktree is unnecessary.

## Structure and replacement assets

- `index.html`: navigation, hero typography, About, Contact and native preview dialog.
- `src/projects.js`: the five project names, categories, descriptions, depth values and image layer paths.
- `src/main.js`: renders both project entry points, manages dialog focus and enables desktop mouse parallax.
- `src/style.css`: composition, independent object hover transforms, responsive/static touch layout and reduced motion.
- `public/objects/<id>-back.png` and `<id>-front.png`: transparent 600 × 600 PNGs sharing the same canvas/alignment. Replace these files or change `layers` in the project data. Do not add essential text to images.
- `scripts/placeholders.py`: optional placeholder regeneration using Pillow; not required for installation or build.

Project depth controls Parallax.js wrapper transforms. The child `.world-object` owns hover/focus scaling; `.object-art` owns the CSS perspective transform. Never attach GSAP transforms to the Parallax wrappers. No GSAP, Three.js, external fonts or live 3D models are used.

At 800px and below, or with a coarse pointer, parallax is disabled. Mobile titles are always visible and buttons open previews with a tap. Reduced motion disables parallax, animation and smooth scrolling. Native dialog provides Escape, focus containment, a close button and focus return.

## Validation

```sh
npm test
```

Tests use Playwright and system Chromium at `/usr/bin/chromium`. On another machine, install Chromium through Playwright and remove `executablePath` in `playwright.config.js` or point it to the local browser. Tests cover real parallax movement, all work previews, keyboard focus return, touch access, navigation, overflow and reduced motion.

## Next content

For each of five projects: title, category, year, short summary, role/tools, a cover image, two aligned transparent PNG layers (1200px recommended for final artwork), preview images/video with a poster, and optional external project link. Also provide approved About text, contact email and social URLs. Contact intentionally remains an honest placeholder until supplied.

## License

The starting repository supplied no README or license, and contained only `.gitattributes`. No prior author content or animations existed to preserve. A project license has not been assumed or added. Parallax.js is MIT licensed; its license is included in `public/THIRD_PARTY_NOTICES.txt` and copied to the production output.

Reference URLs were provided for direction; this environment returned HTTP 403 for all three during implementation, so their live visual behavior could not be inspected.
