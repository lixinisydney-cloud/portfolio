import { image, escape, arrow } from './media.js';
import { projectHref } from '../projects.js';
import sizes from '../asset-sizes.json';

// Display labels only: the reviewed editorial JSON and all media stay untouched.
export const workPresentation = {
  'the-making-of-pets': { lines: ['The Making', 'of Pets'], title: 'The Making of Pets', cn: '制作宠物', layout: 'wide' },
  'anger-market': { lines: ['Anger', 'Market'], title: 'Anger Market', cn: '愤怒市场', layout: 'right' },
  'chroma-residences': { lines: ['Chroma', 'Residences'], title: 'Chroma Residences', cn: '彩色公寓', layout: 'wide' },
  'stubborn-horse': { lines: ['Stubborn', 'Horse'], title: 'Stubborn Horse', cn: '固执的马', layout: 'left' },
  'dragon-dance': { lines: ['Dragon', 'Dance'], title: 'Dragon Dance', cn: '舞龙', layout: 'right' },
  'the-uncertain-oracle': { lines: ['The Uncertain', 'Oracle'], title: 'The Uncertain Oracle', cn: '不确定的神谕', layout: 'wide' },
  'city-life-is-fun': { lines: ['City Life', 'Is Fun'], title: 'City Life Is Fun', cn: '城市生活有意思', layout: 'portrait' },
  'good-boy': { lines: ['GOOD', 'BOY'], title: 'GOOD BOY', cn: '交互装置', layout: 'left' },
  'horse-motion-study': { lines: ['Horse Motion', 'Study'], title: 'Horse Motion Study', cn: '马的算法动画研究', layout: 'experiment' },
};
export function renderWork(project, index, target) {
  const view = workPresentation[project.slug];
  const article = document.createElement('article');
  article.className = `project-chapter layout-${view.layout}`;
  article.id = `work-${project.slug}`;
  article.dataset.project = project.slug;
  article.dataset.motion = '';
  const ratio = sizes[project.cover][0] / sizes[project.cover][1];
  article.style.setProperty('--image-aspect', ratio);
  article.innerHTML = `<div class="chapter-inner"><div class="chapter-meta"><span class="chapter-index">${String(index).padStart(2, '0')}</span><span>${escape(project.category)}</span><span class="chapter-action" aria-hidden="true">${arrow}</span></div><div class="chapter-heading"><h3 class="work-title">${view.lines.map((line, i) => `<span class="title-line line-${i}">${escape(line)}</span>`).join('')}</h3><p class="work-subtitle" lang="zh-CN">${escape(view.cn)}</p></div><a class="portal-link" href="${projectHref(project.slug)}" data-project-link="${project.slug}" aria-label="Open ${escape(view.title)} — ${escape(view.cn)}"><span class="portal-visual">${image(project.cover, `${view.title} — project image`, { lazy: true, className: 'portal-image' })}</span><span class="image-caption"><span>${project.collection === 'experiment' ? 'EXPERIMENT /' : 'PROJECT /'} ${String(index).padStart(2, '0')}</span><span>EXPLORE ${arrow}</span></span></a></div>`;
  target.append(article);
}
