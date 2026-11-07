import { assetUrl } from '../projects.js';
import sizes from '../asset-sizes.json';
export const escape = value => String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
export const arrow = '<svg class="arrow-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M5 19 19 5M5 5h14v14"/></svg>';
export function image(path, alt, { lazy = false, className = '' } = {}) {
  if (!path) return `<span class="text-cover"><strong>${escape(alt)}</strong><span>互动作品 · Interactive work</span></span>`;
  const dimensions = sizes[path] ? `width="${sizes[path][0]}" height="${sizes[path][1]}"` : '';
  return `<img class="${className}" ${dimensions} src="${escape(assetUrl(path))}" alt="${escape(alt)}" loading="${lazy ? 'lazy' : 'eager'}" decoding="async">`;
}
// LargeMedia is a native figure; no fixed 16:9 crop is imposed on gallery art.
export function largeMedia(path, alt, { lazy = true, caption = '' } = {}) {
  return `<figure>${image(path, alt, { lazy })}${caption ? `<figcaption>${escape(caption)}</figcaption>` : ''}</figure>`;
}
