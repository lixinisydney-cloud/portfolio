import { assetUrl } from '../projects.js';
import sizes from '../asset-sizes.json';
import { escape } from './media.js';
import { externalLink } from './cta.js';

export function directMedia(video, index) {
  const dimensions = sizes[video.poster];
  const ratio = video.kind === 'youtube' ? '16/9' : video.aspectRatio || (dimensions ? `${dimensions[0]}/${dimensions[1]}` : '16/9');
  const player = video.kind === 'youtube'
    ? `<iframe class="direct-youtube" src="https://www.youtube-nocookie.com/embed/${escape(video.videoId)}?playsinline=1&rel=0" title="${escape(video.label)}" loading="lazy" allow="encrypted-media; picture-in-picture; fullscreen" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>`
    : `<video class="direct-local" controls playsinline preload="metadata" aria-label="${escape(video.label)}"><source src="${escape(assetUrl(video.src))}" type="video/mp4">Your browser cannot play this video.</video>`;
  const fallback = video.kind === 'youtube' ? externalLink(video.url, 'Watch Online') : `<a class="project-link" href="${escape(assetUrl(video.src))}" target="_blank" rel="noopener noreferrer">Open Video ↗</a>`;
  return `<figure class="direct-media" style="--media-aspect:${escape(ratio)}"><div class="direct-player">${player}</div><figcaption><span>${String(index + 1).padStart(2,'0')} / ${escape(video.label)}</span>${fallback}</figcaption><p class="direct-media-status" role="status">${video.kind === 'youtube' && location.protocol === 'file:' ? 'YouTube 可能限制本地文件嵌入播放，请使用 Watch Online；本地 MP4 可直接播放。' : video.kind === 'youtube' ? '如播放器无法连接或显示错误 153，请使用 Watch Online 在 YouTube 观看。' : ''}</p></figure>`;
}
export function bindDirectMedia(container) {
  container.querySelectorAll('video').forEach(video => {
    video.addEventListener('error', () => {
      video.closest('figure').querySelector('[role="status"]').textContent = '视频暂时无法加载，请尝试 Open Video。';
    });
  });
}

export function stopDirectMedia(container) {
  container.querySelectorAll('video').forEach(video => {
    video.pause();
    video.querySelectorAll('source').forEach(source => source.removeAttribute('src'));
    video.removeAttribute('src');
    video.load();
  });
  container.querySelectorAll('iframe').forEach(frame => frame.remove());
}
