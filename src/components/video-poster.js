import { image, escape } from './media.js';
import { externalLink, safeExternalUrl } from './cta.js';
import { assetUrl } from '../projects.js';

export function videoPoster(video, index) {
  const note = video.posterType === 'project-image' ? '封面为项目画面' : video.posterType === 'text' ? '互动作品演示' : '影片片段';
  return `<figure class="video-poster"><div class="video-frame"><button class="load-video" data-video-index="${index}" aria-label="播放影片：${escape(video.label)}" aria-controls="player-${index}">${image(video.poster, '', { lazy: true })}<span class="video-play-label"><span aria-hidden="true">▶</span> 播放影片<span class="sr-only">：${escape(video.label)}</span></span></button><div class="video-player" id="player-${index}" hidden></div></div><figcaption>${escape(video.label)} · ${note}</figcaption><div class="video-fallback">${video.kind === 'youtube' ? externalLink(video.url, '新窗口观看影片') : `<a class="project-link" href="${escape(assetUrl(video.src))}" target="_blank" rel="noopener noreferrer">打开本地影片<span class="sr-only">（在新窗口打开）</span></a>`}${video.kind === 'youtube' && video.fallbackSrc ? `<a class="project-link" href="${escape(assetUrl(video.fallbackSrc))}" target="_blank" rel="noopener noreferrer">观看本地片段</a>` : ''}</div><p class="video-status" role="status">${video.kind === 'youtube' ? '如 YouTube 无法访问，请使用新窗口观看链接。' : ''}</p></figure>`;
}
export function bindVideoPosters(container, videos) {
  container.querySelectorAll('.load-video').forEach(button => button.addEventListener('click', async () => {
    const video = videos[Number(button.dataset.videoIndex)];
    const frame = button.closest('figure');
    const player = frame.querySelector('.video-player');
    const status = frame.querySelector('.video-status');
    player.replaceChildren();
    if (video.kind === 'youtube') {
      if (!/^[\w-]{11}$/.test(video.videoId) || !safeExternalUrl(video.url)) return;
      const iframe = document.createElement('iframe');
      iframe.src = `https://www.youtube-nocookie.com/embed/${video.videoId}?autoplay=1&rel=0`;
      iframe.title = video.label;
      iframe.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
      iframe.allowFullscreen = true;
      iframe.referrerPolicy = 'strict-origin-when-cross-origin';
      player.append(iframe);
      button.hidden = true;
      player.hidden = false;
      status.textContent = '若影片无法加载或播放，请使用下方的新窗口观看链接。';
      iframe.focus();
    } else {
      const element = document.createElement('video');
      element.controls = true;
      element.playsInline = true;
      element.preload = 'none';
      element.poster = assetUrl(video.poster);
      element.src = assetUrl(video.src);
      element.setAttribute('aria-label', video.label);
      player.append(element);
      player.hidden = false;
      button.hidden = true;
      element.addEventListener('error', () => {
        player.hidden = true;
        button.hidden = false;
        status.textContent = '影片暂时无法播放，可使用下方“打开本地影片”链接。';
        button.focus({ preventScroll: true });
      }, { once: true });
      try { await element.play(); element.focus(); } catch { status.textContent = '播放未自动开始，请使用播放器控件或“打开本地影片”链接。'; }
    }
  }));
}
export function stopMedia(container) {
  container.querySelectorAll('video').forEach(video => { video.pause(); video.removeAttribute('src'); video.load(); });
  container.querySelectorAll('iframe').forEach(iframe => iframe.remove());
}
