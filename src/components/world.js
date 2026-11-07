import { image, escape } from './media.js';
import { projectTitle } from '../projects.js';

export const worldAssets = [
  'world/island-main.webp', 'world/flying-cow.webp', 'world/flying-deer.webp',
  'world/dream-flora.webp', 'world/crystal-flora.webp',
];
const destinations = [
  { slug: 'the-making-of-pets', x: '67%', y: '49%' },
  { slug: 'anger-market', x: '25%', y: '69%' },
  { slug: 'chroma-residences', x: '73%', y: '80%' },
  { slug: 'stubborn-horse', x: '40%', y: '91%' },
];

export function mountWorld(scene, projects) {
  const layer = (className, depth, html = '') => {
    const node = document.createElement('div');
    node.className = `parallax-layer ${className}`;
    node.dataset.depth = depth;
    node.innerHTML = html;
    scene.append(node);
    return node;
  };
  const far = layer('world-far', 0.06);
  const middle = layer('world-island', 0.12, `<div class="island-stage">${image(worldAssets[0], '珍珠色喷泉与花园组成的漂浮小岛', { className: 'main-island scene-image' })}<div class="island-destinations" aria-label="岛上作品入口">${destinations.map((destination, index) => {
    const project = projects.find(p => p.slug === destination.slug);
    return `<button class="world-object hotspot" data-project="${project.slug}" style="--x:${destination.x};--y:${destination.y}" aria-haspopup="dialog" aria-label="查看作品：${escape(projectTitle(project))}"><span class="hotspot-number" aria-hidden="true">0${index + 1}</span><span class="object-label">${escape(projectTitle(project))}</span><span class="hotspot-arrow" aria-hidden="true">↗</span></button>`;
  }).join('')}</div></div>`);
  middle.querySelector('.main-island').setAttribute('fetchpriority', 'high');
  const near = layer('world-near', 0.24);
  far.setAttribute('aria-hidden', 'true');
  near.setAttribute('aria-hidden', 'true');
  // CSS-hidden images still download. Only mount ornamental images on wider
  // screens; the one original island and real controls always remain present.
  const wide = matchMedia('(min-width: 801px)');
  function decorations() {
    far.innerHTML = wide.matches ? `<span class="world-deer">${image(worldAssets[2], '')}</span><span class="world-cow">${image(worldAssets[1], '')}</span>` : '';
    near.innerHTML = wide.matches ? `<span class="world-flora">${image(worldAssets[3], '')}</span><span class="world-crystal">${image(worldAssets[4], '')}</span>` : '';
  }
  wide.addEventListener('change', decorations);
  decorations();
}
