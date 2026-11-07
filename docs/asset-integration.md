# Real asset integration audit

## In use

37 of the 41 files in `public/assets/` are referenced by the shared project data:

- All five required main scene PNGs.
- All six covers, with GOOD BOY's low-resolution photograph and City Life's provisional background explicitly identified in preview and detail copy.
- All 21 gallery images, including the supplied cow character added to The Making of Pets gallery.
- All five local video previews: four black-backed city clips and the horse motion excerpt. They load only after Play is pressed.

Source images are retained at their supplied web dimensions (up to 1600px), preserve aspect ratio and are not enlarged to pretend additional detail. Covers, scene objects and gallery data resolve through the Vite base helper. `asset-manifest.csv` retains the original-to-organized mappings.

Horse Motion Study uses the full title supplied in the JSON. It has no scene object and no link to Stubborn Horse. No dates, team roles, results or new online destinations have been invented. External destinations are the supplied YouTube videos for Pets and Chroma, and the City interactive site; remote availability is not asserted by local tests.

## Unused material

Optional decoration deliberately left off the page:

- `scene/extra-city-camera.png`
- `scene/extra-city-pigeon.png`
- `scene/extra-city-planter.png`
- `scene/extra-good-boy-grass.png`

The ten first-phase files in `public/objects/` and `scripts/placeholders.py` remain as original fallback/source material but are not referenced by any live page. `PREVIEW-scene-objects.jpg` is a reference contact sheet, not a website image. These unused files do not generate homepage network requests.

`previewVideo` remains in the imported draft for provenance; the detail player uses the editorial `videos` list. The full source movies, A dream and 蟳埔女—头顶上的流动花园 were not supplied in this package and are not included as works.

## Next visual refinements

- Replace City's approximate white-key cutout with a clean transparent export, then refine its contour/shadow on the paper background.
- Replace the provisional city background with the final campaign visual.
- Give GOOD BOY a higher-resolution exhibition hero; the current 496×235 image cannot support a full-width photographic treatment.
- Improve Chroma installation/detail photo resolution before enlarging those gallery panels.
- Long titles (especially the horse study) currently wrap naturally; an approved short display title could make the grid more uniform without changing the full detail title.
- Video poster frames could improve the resting appearance of the black players; none have been invented.

## Still needed

- GOOD BOY: high-resolution visitor/leash/hardware installation photography and a 10–20 second real interaction recording.
- City Life: final submitted main visual, genuine transparent cat artwork and a short recording of the live interactive page.
- The Making of Pets: optional 10–20 second local highlight; the supplied full YouTube link is already shown.
- Chroma Residences: higher-resolution installation/environment photographs; supplied project-video link is already shown.
- Horse Motion Study: optional original full movie and process stills; the provided excerpt and stills are sufficient for this version.
- Anger Market: no additional material is necessary for this version; add video only if actual motion work exists.
- About/Contact: approved personal introduction, contact address, CV and optional portrait remain outstanding from phase one.
