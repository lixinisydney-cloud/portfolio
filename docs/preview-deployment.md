# Independent browser preview (feat/adrift-redesign)

## Current status

The repository has no existing Vercel project binding, configured Vercel credentials, or Vercel deployment records. This cloud environment exposes no shareable browser/port-preview tool. A process listening on a cloud loopback port is not a public preview URL. GitHub Pages remains the main-branch production site; it is not used for this preview.

`vercel.json` prepares a Vite build (`npm ci`, `npm run build`, output `dist`) without modifying the Pages workflow or relative asset base. `git.deploymentEnabled: false` disables Git-triggered Vercel deployments. A manual Vercel CLI deployment is still possible. Do not use `--prod`, attach a production domain, change the GitHub Pages source or merge main for this review.

## What requires the user's account authorization

1. Sign in to your Vercel account and choose the personal account/team that will own a new independent project, e.g. `sydneys-world-preview`.
2. Authorize the Vercel CLI's browser login. Do not paste an access token into chat. For a manual deployment from this checkout, a GitHub App connection is not required. If you prefer Git integration later, separately authorize the Vercel GitHub App for **only** `lixinisydney-cloud/portfolio`; automatic Git deployments remain disabled by this configuration.
3. For this cloud agent to deploy and verify a Vercel URL, its network policy must permit Vercel authentication/API destinations (at least `vercel.com`, `api.vercel.com`; any additional redirect domains must be identified by the login flow) and the returned preview hostname. The current proxy denies `api.vercel.com` with HTTP 403.
4. Choose whether Vercel's deployment protection should require Vercel login. If you want a link accessible to another browser/phone without signing in, explicitly allow that access in Vercel's Deployment Protection settings.

No account connection, authorization, billing choice, project link or public deployment has been performed by the agent. Project/team selection and browser login are the missing prerequisites, not a source-code problem.

## Deploy manually on your own computer

With this branch checked out:

```sh
git switch feat/adrift-redesign
npm ci
npx vercel login
npx vercel link
# Select/create the separate preview project in your own account/team.
npx vercel deploy
```

The final command defaults to **Preview**, not Production. Do not add `--prod`. The CLI prints the real deployment URL when successful. If prompted to import framework settings, retain Vite / build `npm run build` / output `dist` / root `.`. This app requires no project environment variables.

After a deployment succeeds, verify the actual URL in desktop and phone browsers: scroll through the portal reveals, click a project image once, reload a hash detail URL, use Back, and open About/Contact. The old version is at `/legacy.html` for comparison. Detail-page video restructuring is still round 2, so the existing click-to-load players remain in this preview.

## Local production preview (available now)

On your computer, in this branch:

```sh
npm ci
npm run build
npm run preview -- --host 0.0.0.0 --port 4173
```

Open `http://localhost:4173/` on the same computer. To test a phone on the same Wi-Fi, open `http://<your-computer-LAN-IP>:4173/`; allow the port through your local firewall if required. This is a local preview, not a public link. `/legacy.html` shows the prior island site. Stop with Ctrl+C.

Alternative: `node scripts/build-offline-preview.mjs` produces a self-contained HTML file with project images/scripts/media embedded. Download and open that file in a normal browser; if local file scripts are blocked, serve it with `python -m http.server 8000`. External project sites/YouTube still need their own networks.

Actual screenshots are in `docs/screenshots/adrift-round1/`: desktop/mobile homepage and project chapter. These demonstrate rendered pages and do not establish a public deployment.
