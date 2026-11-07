# SYDNEY’S WORLD — website assets v1

This package is organized for the **existing Codex-generated Vite / vanilla-JS MVP** (`index.html`, `src/main.js`, `src/projects.js`, `src/style.css`). It is NOT an Astro starter.

## 1. Where files go

Copy the included `public/assets/` folder into the **root of your existing GitHub repository**, preserving subfolders. Copy `content/projects-draft.json` to the repo’s `content/` folder (or let Codex move it to `src/data/`). This file is a draft, not a replacement for the current `src/projects.js`.

Directory purposes:
- `public/assets/scene/` = five main transparent PNGs used by existing homepage parallax slots; files starting with `extra-` are optional decorations.
- `public/assets/projects/<slug>/` = web-optimized cover images, gallery photos, and browser-compatible video previews.
- `content/projects-draft.json` = names, slugs, short factual project summaries, category, tech and paths to import/merge into your existing JS project data.
- `asset-manifest.csv` = original filename → organized new filename.

## 2. Important caveats

- GOOD BOY cover is an existing **low-resolution** exhibition photo. Replace with a proper high-resolution hero shot/video if available.
- City Life cover is a **provisional campaign-background asset**, not a finished poster. Replace it with your submitted finished main visual screenshot/export.
- The city scene PNG was converted from a white-background still with approximate color-key matte removal. Examine edges; use your original genuinely transparent artwork if available.
- The four city MP4 short clips were transcoded from HEVC MOV to H.264 MP4. Their frames show a black background; they are **not transparent overlay videos**. Use inside a dark detail-page frame only, unless a real alpha-bearing asset is separately exported.
- The horse project is a separate generative motion study. Do NOT confuse it with 'Stubborn Horse: A Playful Feeding Ritual' (a different interactive webpage in the portfolio).
- All generated short preview videos are compressed excerpts; source full videos are still in your original `png.zip`.
- Two large optional videos (`A dream` and `蟳埔女—头顶上的流动花园`) are excluded from this lean website package; they can be used later after your role and website placement are confirmed.
- No fabricated dates, employers, emails, team roles or outcomes. Years are set to null until confirmed.
- Original copyrights remain with their respective owners. Only publish images/videos you have permission to use. Brand references inside your own student work may belong to their respective rights holders.

## 3. Vite / GitHub Pages asset path

For a repository-hosted GitHub Pages site at `/sydney-world/`, avoid absolute `/assets/...` paths. A safe helper in Vite code:

```js
const assetUrl = (relativePath) => `${import.meta.env.BASE_URL}assets/${relativePath}`;
// assetUrl('scene/good-boy.png')
```

Ensure `vite.config.js` (or current config) has the correct `base` for your actual repository name. Do not introduce Astro or rewrite the existing MVP.

## 4. Suggested insertion order
1. Commit/merge the first Codex MVP so it appears on GitHub. It is currently reported as only in the Codex workspace.
2. Copy organized assets and data into repo.
3. Ask Codex to import each of the five scene images into the existing five clickable objects, then map six projects to Selected Works.
4. After that, build reusable project detail views with a GitHub Pages-safe navigation strategy (e.g. `#/projects/<slug>` with hashes, or prerendered pages) and test reload and back button.
5. Add high-resolution photos, completed poster and site walkthrough clips when available.

## 5. Remaining asset requests
- GOOD BOY: high-resolution exhibition shot including the visitor/leash and hardware, plus 10–20s real interaction documentation (highest priority).
- City Life: finished submitted main-visual image, one short screen recording of live interactive page; verify official logo usage.
- The Making of Pets: ideally 10–20s short highlight clip; full YouTube link already supplied.
- Chroma Residences: higher-resolution installation/environment shots, if available.
- Anger Market: existing images sufficient for MVP; add video only if real motion exists.
- Horse Motion Study: video preview included; add project process stills if useful.
- Optional Dragon-Dance: 1 good cover image or short screen recording plus working URL, if you decide to add a seventh work.
- About / Contact: 80–120-word personal intro, real contact method (avoid putting private phone number on public website), CV link and optional portrait.
