import Parallax from 'parallax-js';
import './style.css';
import { projects } from './projects.js';

const scene = document.querySelector('#scene');
const grid = document.querySelector('#work-grid');
const dialog = document.querySelector('#project-dialog');
const art = project => project.layers.map((src, index) => `<img class="art-layer art-layer-${index}" src="${src}" alt="" width="600" height="600" draggable="false">`).join('');
for (const [index, project] of projects.entries()) {
  const layer = document.createElement('div');
  layer.className = `parallax-layer object-${project.id}`;
  layer.dataset.depth = project.depth;
  // Parallax transforms this wrapper; hover/focus transforms only its child button.
  layer.innerHTML = `<button class="world-object" data-project="${project.id}" aria-haspopup="dialog" aria-label="Preview ${project.title}, ${project.category}"><span class="object-art">${art(project)}</span><span class="object-label"><span>${project.title}</span><span aria-hidden="true"><svg class="arrow-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M5 19 19 5M5 5h14v14"/></svg></span></span></button>`;
  scene.append(layer);
  const card = document.createElement('button');
  card.className = 'work-card';
  card.dataset.project = project.id;
  card.setAttribute('aria-haspopup', 'dialog');
  card.innerHTML = `<span class="card-art" style="--card-color:${project.color}"><span class="card-number">0${index + 1} / EXPLORATION</span><span class="card-object">${art(project)}</span><span class="card-open" aria-hidden="true"><svg class="arrow-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M5 19 19 5M5 5h14v14"/></svg></span></span><span class="card-caption"><span><strong>${project.title}</strong><span class="card-category">${project.category}</span></span><span class="card-year">${project.year}</span></span>`;
  grid.append(card);
}
let opener;
document.querySelectorAll('[data-project]').forEach(button => button.addEventListener('click', () => {
  const project = projects.find(item => item.id === button.dataset.project);
  opener = button;
  document.querySelector('#preview-title').textContent = project.title;
  document.querySelector('#preview-category').textContent = project.category;
  document.querySelector('#preview-description').textContent = project.description;
  const previewArt = document.querySelector('#preview-art');
  previewArt.innerHTML = `<div class="preview-object">${art(project)}</div>`;
  previewArt.style.backgroundColor = project.color;
  dialog.showModal();
}));
document.querySelector('.close-preview').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => { if (event.target === dialog) {
  const r = dialog.getBoundingClientRect();
  if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) dialog.close();
}});
dialog.addEventListener('close', () => opener?.focus({ preventScroll: true }));
const desktop = matchMedia('(min-width: 801px) and (hover: hover) and (pointer: fine)');
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
let parallax;
function configureMotion() {
  parallax?.destroy();
  parallax = undefined;
  if (desktop.matches && !reduced.matches) {
    parallax = new Parallax(scene, { relativeInput: true, hoverOnly: true, pointerEvents: true, frictionX: 0.055, frictionY: 0.055, scalarX: 7, scalarY: 7, calibrateX: false, calibrateY: false });
    // No device-orientation listeners: this experience uses mouse input only.
    parallax.disable();
    parallax.orientationSupport = false;
    parallax.motionSupport = false;
    parallax.enable();
  }
}
desktop.addEventListener('change', configureMotion);
reduced.addEventListener('change', configureMotion);
configureMotion();
