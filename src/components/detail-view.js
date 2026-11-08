// Round 1 intentionally preserves the reviewed detail content and video UX.
import { mainProjects, projectTitle, projectHref } from '../projects.js';
import assetSizes from '../asset-sizes.json';
import { escape, image, largeMedia } from './media.js';
import { projectCtas } from './cta.js';
import { videoPoster, bindVideoPosters } from './video-poster.js';
const englishTitle = project => project.title !== projectTitle(project) ? `<span class="project-title-en" lang="en">${escape(project.title)}</span>` : '';
export function renderDetail(detail, project) {
  const title = projectTitle(project);
  const next = mainProjects[(mainProjects.findIndex(p => p.slug === project.slug) + 1) % mainProjects.length];
  detail.innerHTML = `<a class="back-to-work" href="#work">← 返回作品</a>
    <header class="detail-heading"><span class="eyebrow">${escape(project.category)}</span><h1 id="detail-title" tabindex="-1">${escape(title)}</h1>${englishTitle(project)}<p class="detail-summary">${escape(project.summary)}</p>${project.year ? `<p>${escape(project.year)}</p>` : ''}${projectCtas(project)}</header>
    <figure class="detail-hero" style="--card-color:${project.color};--cover-ratio:${assetSizes[project.cover] ? assetSizes[project.cover].join('/') : '16/9'}">${image(project.cover, `${title} · 作品主视觉`)}</figure>
    <div class="detail-intro"><div><span class="eyebrow">设计概念</span><p>${escape(project.detailZh || project.summary)}</p>${project.responsibility && !project.isTeam ? `<section class="responsibility"><h2>我的工作</h2><p>${escape(project.responsibility)}</p></section>` : ''}</div><div><h2>技术与工具</h2><ul class="tech-tags">${project.technologies.map(tech => `<li>${escape(tech)}</li>`).join('')}</ul></div></div>
    ${project.gallery.length ? `<section class="detail-gallery" aria-labelledby="gallery-title"><h2 id="gallery-title">作品画面</h2><div class="gallery-grid">${project.gallery.map((path, i) => largeMedia(path, `${title} · 作品画面 ${i + 1}`, { caption: `${String(i + 1).padStart(2, '0')} / ${title}` })).join('')}</div></section>` : ''}
    ${project.videos.length ? `<section class="detail-videos" id="project-videos" aria-labelledby="video-title"><h2 id="video-title" tabindex="-1">影片</h2><p>点击封面播放影片</p><div class="video-grid">${project.videos.map(videoPoster).join('')}</div></section>` : ''}
    <div class="detail-navigation"><a class="back-to-work project-link" href="#work">← 返回作品</a><a class="project-link" href="${projectHref(next.slug)}">下一件作品：${escape(projectTitle(next))} →</a></div>`;
  bindVideoPosters(detail, project.videos);
  detail.querySelector('[data-scroll-videos]')?.addEventListener('click', () => {
    const heading = detail.querySelector('#video-title');
    heading.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
    heading.focus({ preventScroll: true });
  });
}
