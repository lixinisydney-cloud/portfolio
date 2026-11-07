import Parallax from 'parallax-js';
import './style.css';
import { projects, assetUrl, projectHref } from './projects.js';
import assetSizes from './asset-sizes.json';

const scene = document.querySelector('#scene');
const grid = document.querySelector('#work-grid');
const dialog = document.querySelector('#project-dialog');
const homeView = document.querySelector('#home-view');
const detail = document.querySelector('#project-detail');
const escape = value => String(value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const arrow = '<svg class="arrow-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M5 19 19 5M5 5h14v14"/></svg>';
const image = (path, alt, { lazy = false, className = '' } = {}) => `<img class="${className}" ${assetSizes[path] ? `width="${assetSizes[path][0]}" height="${assetSizes[path][1]}"` : ''} src="${escape(assetUrl(path))}" alt="${escape(alt)}" loading="${lazy ? 'lazy' : 'eager'}" decoding="async">`;

// Handle image failures in every view without leaving a broken-image icon.
document.addEventListener('error', event => {
  if (!(event.target instanceof HTMLImageElement)) return;
  const fallback = document.createElement('span');
  fallback.className = 'media-fallback';
  fallback.setAttribute('role', 'img');
  fallback.setAttribute('aria-label', event.target.alt || 'Project image unavailable');
  fallback.textContent = 'Image unavailable';
  event.target.replaceWith(fallback);
}, true);

for (const [index, project] of projects.entries()) {
  if (project.sceneObject) {
    const layer = document.createElement('div');
    layer.className = `parallax-layer object-${project.slug}`;
    layer.dataset.depth = project.depth;
    // Parallax transforms the wrapper; hover/focus transforms its child button.
    layer.innerHTML = `<button class="world-object" data-project="${project.slug}" aria-haspopup="dialog" aria-label="Preview ${escape(project.title)}, ${escape(project.category)}"><span class="object-art">${image(project.sceneObject, '', { className: 'scene-image' })}</span><span class="object-label"><span>${escape(project.title)}</span>${arrow}</span></button>`;
    scene.append(layer);
  }
  const card = document.createElement('button');
  card.className = 'work-card';
  card.dataset.project = project.slug;
  card.setAttribute('aria-haspopup', 'dialog');
  card.innerHTML = `<span class="card-art" style="--card-color:${project.color}"><span class="card-number">0${index + 1} / SELECTED WORK</span><span class="card-object">${image(project.cover, '', { lazy: true })}</span><span class="card-open" aria-hidden="true">${arrow}</span></span><span class="card-caption"><span><strong>${escape(project.title)}</strong><span class="card-category">${escape(project.category)}</span></span>${project.year ? `<span class="card-year">${escape(project.year)}</span>` : ''}</span>`;
  grid.append(card);
}
document.querySelector('.count').textContent = `(${String(projects.length).padStart(2, '0')})`;
let opener;
let returnProject;
document.querySelectorAll('[data-project]').forEach(button => button.addEventListener('click', () => {
  const project = projects.find(item => item.slug === button.dataset.project);
  opener = button;
  document.querySelector('#preview-title').textContent = project.title;
  document.querySelector('#preview-category').textContent = project.category;
  document.querySelector('#preview-description').textContent = project.summary;
  document.querySelector('#preview-note').textContent = project.assetNote || '';
  document.querySelector('#view-project').href = projectHref(project.slug);
  const previewArt = document.querySelector('#preview-art');
  previewArt.innerHTML = image(project.cover, `${project.title} — main visual`);
  previewArt.style.backgroundColor = project.color;
  dialog.showModal();
}));
document.querySelector('.close-preview').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => {
  if (event.target !== dialog) return;
  const r = dialog.getBoundingClientRect();
  if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) dialog.close();
});
dialog.addEventListener('close', () => { if (!homeView.hidden) opener?.focus({ preventScroll: true }); });
document.querySelector('#view-project').addEventListener('click', () => {
  returnProject = opener?.dataset.project;
  dialog.close();
});

const desktop = matchMedia('(min-width: 801px) and (hover: hover) and (pointer: fine)');
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
let parallax;
function configureMotion() {
  parallax?.destroy();
  parallax = undefined;
  if (!homeView.hidden && desktop.matches && !reduced.matches) {
    parallax = new Parallax(scene, { relativeInput: true, hoverOnly: true, pointerEvents: true, frictionX: 0.055, frictionY: 0.055, scalarX: 7, scalarY: 7, calibrateX: false, calibrateY: false });
    parallax.disable();
    parallax.orientationSupport = false;
    parallax.motionSupport = false;
    parallax.enable();
  }
}
desktop.addEventListener('change', configureMotion);
reduced.addEventListener('change', configureMotion);

function stopVideos() {
  detail.querySelectorAll('video').forEach(video => {
    video.pause();
    video.removeAttribute('src');
    video.load();
  });
}
function renderDetail(project) {
  const links = project.externalLinks.filter(link => /^https:\/\//.test(link.url));
  detail.innerHTML = `<a class="back-to-work" href="#work">← Back to selected works</a>
    <header class="detail-heading"><span class="eyebrow">${escape(project.category)}</span><h1 id="detail-title" tabindex="-1">${escape(project.title)}</h1>${project.year ? `<p>${escape(project.year)}</p>` : ''}</header>
    <figure class="detail-hero" style="--card-color:${project.color}">${image(project.cover, `${project.title} — main visual`)}</figure>
    ${project.assetNote ? `<p class="asset-note">${escape(project.assetNote)}</p>` : ''}
    <div class="detail-intro"><div><span class="eyebrow">THE CONCEPT</span><p>${escape(project.summary)}</p></div><div><h2>Technology & tools</h2><ul class="tech-tags">${project.technologies.map(tech => `<li>${escape(tech)}</li>`).join('')}</ul>${links.length ? `<div class="external-links">${links.map(link => `<a class="project-link" href="${escape(link.url)}" target="_blank" rel="noopener noreferrer">${escape(link.label)} ${arrow}<span class="sr-only"> (opens in a new tab)</span></a>`).join('')}</div>` : ''}</div></div>
    <section class="detail-gallery" aria-labelledby="gallery-title"><h2 id="gallery-title">A closer look</h2><div class="gallery-grid">${project.gallery.map((path, i) => `<figure>${image(path, `${project.title} — ${path.split('/').pop().replace(/\.webp$/, '').replaceAll('-', ' ')}`, { lazy: true })}<figcaption>${String(i + 1).padStart(2, '0')} / ${escape(path.split('/').pop().replace(/\.webp$/, '').replaceAll('-', ' '))}</figcaption></figure>`).join('')}</div></section>
    ${project.videos?.length ? `<section class="detail-videos" aria-labelledby="video-title"><h2 id="video-title">In motion</h2><p>Short previews. Press play to load a clip.</p><div class="video-grid">${project.videos.map((video, i) => `<figure><div class="video-frame"><video id="video-${i}" preload="none" playsinline controls aria-label="${escape(video.label)}"></video><button class="load-video" data-video="${escape(assetUrl(video.src))}" aria-controls="video-${i}">Play ${escape(video.label)}</button></div><figcaption>${escape(video.label)} · <a href="${escape(assetUrl(video.src))}" target="_blank" rel="noopener">Open MP4<span class="sr-only"> (opens in a new tab)</span></a></figcaption><p class="video-status" role="status"></p></figure>`).join('')}</div></section>` : ''}
    <a class="back-to-work project-link" href="#work">← Back to selected works</a>`;
  detail.querySelectorAll('.load-video').forEach(button => button.addEventListener('click', async () => {
    const video = document.getElementById(button.getAttribute('aria-controls'));
    const status = button.closest('figure').querySelector('.video-status');
    button.hidden = true;
    video.src = button.dataset.video;
    video.addEventListener('error', () => { status.textContent = 'This preview could not play. Try the Open MP4 link.'; }, { once: true });
    try { await video.play(); } catch { status.textContent = 'Playback did not start. Use the video controls or Open MP4 link.'; }
  }));
}
function route() {
  stopVideos();
  if (dialog.open) dialog.close();
  const isProject = location.hash.startsWith('#/projects/');
  homeView.hidden = isProject;
  detail.hidden = !isProject;
  if (isProject) {
    const slug = location.hash.slice('#/projects/'.length);
    const project = projects.find(item => encodeURIComponent(item.slug) === slug);
    if (project) {
      renderDetail(project);
      document.title = `${project.title} — SYDNEY'S WORLD`;
    } else {
      detail.innerHTML = '<h1 id="detail-title" tabindex="-1">Project not found</h1><a class="project-link" href="#work">Back to selected works</a>';
      document.title = "Project not found — SYDNEY'S WORLD";
    }
    window.scrollTo({ top: 0, behavior: 'instant' });
    detail.querySelector('#detail-title').focus({ preventScroll: true });
  } else {
    detail.replaceChildren();
    document.title = "SYDNEY'S WORLD — Creative Technologist";
    const target = ['#home', '#work', '#about', '#contact'].includes(location.hash) ? document.querySelector(location.hash) : null;
    if (target) requestAnimationFrame(() => {
      target.scrollIntoView({ behavior: 'instant' });
      if (location.hash === '#work' && returnProject) {
        grid.querySelector(`[data-project="${returnProject}"]`)?.focus({ preventScroll: true });
        returnProject = undefined;
      }
    });
  }
  configureMotion();
}
window.addEventListener('hashchange', route);
route();
