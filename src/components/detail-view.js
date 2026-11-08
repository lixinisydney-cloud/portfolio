import { mainProjects, projectTitle, projectHref } from '../projects.js';
import { escape, largeMedia } from './media.js';
import { externalLink } from './cta.js';
import { directMedia, bindDirectMedia } from './direct-media.js';
export function renderDetail(detail, project) {
  const next = mainProjects[(mainProjects.findIndex(p => p.slug === project.slug) + 1) % mainProjects.length];
  const links = project.links.map(link => externalLink(link.url, link.kind === 'live' ? 'Live Experience' : 'View Code'));
  project.videos.filter(v => v.kind === 'youtube').forEach((v, i) => links.push(externalLink(v.url, `Watch Online${project.videos.filter(v => v.kind === 'youtube').length > 1 ? ` ${i + 1}` : ''}`)));
  const gallery = [...new Set([project.cover, ...project.gallery].filter(Boolean))];
  detail.innerHTML = `<a class="back-to-work" href="#work">← Back to Works</a>
  <header class="detail-heading"><span class="eyebrow">${escape(project.category)}</span><h1 id="detail-title" tabindex="-1">${escape(project.title)}</h1><p class="project-title-en" lang="zh-CN">${escape(projectTitle(project))}</p></header>
  <section class="detail-introduction" aria-labelledby="intro-section-title"><h2 id="intro-section-title">Introduction</h2><div class="detail-intro" lang="zh-CN"><p>${escape(project.summary)}</p><p>${escape(project.detailZh)}</p>${project.responsibility && !project.isTeam ? `<h3>我的工作</h3><p>${escape(project.responsibility)}</p>` : ''}</div></section>
  ${links.length ? `<section class="detail-links" aria-labelledby="links-title"><h2 id="links-title">Project Links</h2><div class="project-ctas">${links.join('')}</div>${project.slug === 'the-uncertain-oracle' ? '<p class="demo-hint">在线体验需要允许摄像头权限。</p>' : ''}</section>` : ''}
  ${project.videos.length ? `<section class="detail-videos direct-videos" aria-labelledby="video-title"><h2 id="video-title">Video</h2>${project.videos.map(directMedia).join('')}</section>` : ''}
  ${gallery.length ? `<section class="detail-gallery" aria-labelledby="gallery-title"><h2 id="gallery-title">Gallery</h2><div class="gallery-grid">${gallery.map((path, i) => largeMedia(path, `${project.title} / ${i + 1}`, { caption: `${String(i + 1).padStart(2,'0')} / ${project.title}` })).join('')}</div></section>` : ''}
  <section class="detail-tools" aria-labelledby="tools-title"><h2 id="tools-title">Tools & Technologies</h2><ul class="tech-tags">${project.technologies.map(t => `<li>${escape(t)}</li>`).join('')}</ul></section>
  <div class="detail-navigation"><a class="back-to-work project-link" href="#work">← Back to Works</a><a class="project-link" href="${projectHref(next.slug)}">Next Project: ${escape(next.title)} →</a></div>`;
  bindDirectMedia(detail);
}
