import Parallax from 'parallax-js';
import './style.css';
import { projects, sceneProjects, mainProjects, experiments, site, projectTitle, projectHref } from './projects.js';
import { escape, image, largeMedia, arrow } from './components/media.js';
import { projectCtas, externalLink } from './components/cta.js';
import { videoPoster, bindVideoPosters, stopMedia } from './components/video-poster.js';

const scene = document.querySelector('#scene');
const grid = document.querySelector('#work-grid');
const dialog = document.querySelector('#project-dialog');
const homeView = document.querySelector('#home-view');
const detail = document.querySelector('#project-detail');
const englishTitle = project => project.title !== projectTitle(project) ? `<span class="project-title-en" lang="en">${escape(project.title)}</span>` : '';

// Chinese-first site copy is maintained with the project content, not duplicated.
document.querySelector('#hero-subtitle').textContent = site.heroSubtitle;
document.querySelector('#about-short').textContent = site.aboutShortZh;
document.querySelector('#about-copy').textContent = site.aboutZh;
document.querySelector('#contact-links').innerHTML = `<a class="project-link" href="mailto:${escape(site.contact.email)}">${escape(site.contact.email)}</a>${externalLink(site.contact.github, 'GitHub')}${externalLink(site.contact.instagram, 'Instagram')}`;

// Handle image failures without broken-image icons or visible development notes.
document.addEventListener('error', event => {
  if (!(event.target instanceof HTMLImageElement)) return;
  const fallback = document.createElement('span');
  fallback.className = 'media-fallback';
  fallback.setAttribute('role', 'img');
  fallback.setAttribute('aria-label', event.target.alt || '作品图片暂时无法显示');
  fallback.textContent = '图片暂时无法显示，请继续浏览项目介绍。';
  event.target.replaceWith(fallback);
}, true);

for (const project of sceneProjects) {
  const layer = document.createElement('div');
  layer.className = `parallax-layer object-${project.slug}`;
  layer.dataset.depth = project.depth;
  // Parallax owns this wrapper. The inner button owns hover/focus transforms.
  layer.innerHTML = `<button class="world-object" data-project="${project.slug}" aria-haspopup="dialog" aria-label="查看作品：${escape(projectTitle(project))}"><span class="object-art">${image(project.sceneObject, '', { className: 'scene-image' })}</span><span class="object-label"><span>${escape(projectTitle(project))}</span>${arrow}</span></button>`;
  scene.append(layer);
}
function renderCard(project, index, target) {
  const card = document.createElement('button');
  card.className = 'work-card';
  card.dataset.project = project.slug;
  card.setAttribute('aria-haspopup', 'dialog');
  card.innerHTML = `<span class="card-art" style="--card-color:${project.color}"><span class="card-number">${String(index + 1).padStart(2, '0')} / ${project.collection === 'experiment' ? '独立实验' : '精选作品'}</span><span class="card-object">${image(project.cover, project.cover ? '' : projectTitle(project), { lazy: true })}</span><span class="card-open" aria-hidden="true">${arrow}</span></span><span class="card-caption"><span><strong>${escape(projectTitle(project))}</strong>${englishTitle(project)}<span class="card-category">${escape(project.category)}</span></span>${project.year ? `<span class="card-year">${escape(project.year)}</span>` : ''}</span>`;
  target.append(card);
}
mainProjects.forEach((project, index) => renderCard(project, index, grid));
experiments.forEach((project, index) => renderCard(project, index, document.querySelector('#experiment-grid')));
document.querySelector('.count').textContent = `(${String(mainProjects.length).padStart(2, '0')})`;

let opener;
let returnProject;
document.querySelectorAll('[data-project]').forEach(button => button.addEventListener('click', () => {
  const project = projects.find(item => item.slug === button.dataset.project);
  opener = button;
  document.querySelector('#preview-title').textContent = projectTitle(project);
  document.querySelector('#preview-title-en').textContent = project.title !== projectTitle(project) ? project.title : '';
  document.querySelector('#preview-category').textContent = project.category;
  document.querySelector('#preview-description').textContent = project.summary;
  document.querySelector('#view-project').href = projectHref(project.slug);
  const previewArt = document.querySelector('#preview-art');
  previewArt.innerHTML = image(project.cover, `${projectTitle(project)} · 作品主视觉`);
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

function renderDetail(project) {
  const title = projectTitle(project);
  const next = mainProjects[(mainProjects.findIndex(p => p.slug === project.slug) + 1) % mainProjects.length];
  detail.innerHTML = `<a class="back-to-work" href="#work">← 返回作品</a>
    <header class="detail-heading"><span class="eyebrow">${escape(project.category)}</span><h1 id="detail-title" tabindex="-1">${escape(title)}</h1>${englishTitle(project)}<p class="detail-summary">${escape(project.summary)}</p>${project.year ? `<p>${escape(project.year)}</p>` : ''}${projectCtas(project)}</header>
    <figure class="detail-hero" style="--card-color:${project.color}">${image(project.cover, `${title} · 作品主视觉`)}</figure>
    <div class="detail-intro"><div><span class="eyebrow">设计概念</span><p>${escape(project.detailZh || project.summary)}</p>${project.responsibility && !project.isTeam ? `<section class="responsibility"><h2>我的工作</h2><p>${escape(project.responsibility)}</p></section>` : ''}</div><div><h2>技术与工具</h2><ul class="tech-tags">${project.technologies.map(tech => `<li>${escape(tech)}</li>`).join('')}</ul></div></div>
    ${project.gallery.length ? `<section class="detail-gallery" aria-labelledby="gallery-title"><h2 id="gallery-title">作品画面</h2><div class="gallery-grid">${project.gallery.map((path, i) => largeMedia(path, `${title} · 作品画面 ${i + 1}`, { caption: `${String(i + 1).padStart(2, '0')} / ${title}` })).join('')}</div></section>` : ''}
    ${project.videos.length ? `<section class="detail-videos" id="project-videos" aria-labelledby="video-title"><h2 id="video-title" tabindex="-1">影片</h2><p>点击封面播放影片</p><div class="video-grid">${project.videos.map(videoPoster).join('')}</div></section>` : ''}
    <div class="detail-navigation"><a class="back-to-work project-link" href="#work">← 返回作品</a><a class="project-link" href="${projectHref(next.slug)}">下一件作品：${escape(projectTitle(next))} →</a></div>`;
  bindVideoPosters(detail, project.videos);
  detail.querySelector('[data-scroll-videos]')?.addEventListener('click', () => {
    const heading = detail.querySelector('#video-title');
    heading.scrollIntoView({ behavior: reduced.matches ? 'instant' : 'smooth' });
    heading.focus({ preventScroll: true });
  });
}
function route() {
  stopMedia(detail);
  if (dialog.open) dialog.close();
  const isProject = location.hash.startsWith('#/projects/');
  homeView.hidden = isProject;
  detail.hidden = !isProject;
  if (isProject) {
    const slug = location.hash.slice('#/projects/'.length);
    const project = projects.find(item => encodeURIComponent(item.slug) === slug);
    if (project) {
      renderDetail(project);
      document.title = `${projectTitle(project)} — SYDNEY'S WORLD`;
    } else {
      detail.innerHTML = '<h1 id="detail-title" tabindex="-1">未找到这件作品</h1><a class="project-link" href="#work">返回作品</a>';
      document.title = "未找到作品 — SYDNEY'S WORLD";
    }
    window.scrollTo({ top: 0, behavior: 'instant' });
    detail.querySelector('#detail-title').focus({ preventScroll: true });
  } else {
    detail.replaceChildren();
    document.title = "SYDNEY'S WORLD — 多媒体与互动设计";
    const target = ['#home', '#work', '#about', '#contact'].includes(location.hash) ? document.querySelector(location.hash) : null;
    if (target) requestAnimationFrame(() => {
      target.scrollIntoView({ behavior: 'instant' });
      if (location.hash === '#work' && returnProject) {
        document.querySelector(`.work-card[data-project="${returnProject}"]`)?.focus({ preventScroll: true });
        returnProject = undefined;
      }
    });
  }
  configureMotion();
}
window.addEventListener('hashchange', route);
route();
