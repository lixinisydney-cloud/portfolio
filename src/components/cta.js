import { escape, arrow } from './media.js';
export function safeExternalUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && !url.username && !url.password ? url.href : null;
  } catch { return null; }
}
export function externalLink(url, label, className = 'project-link') {
  const safe = safeExternalUrl(url);
  return safe ? `<a class="${className}" href="${escape(safe)}" target="_blank" rel="noopener noreferrer">${escape(label)} ${arrow}<span class="sr-only">（在新窗口打开）</span></a>` : '';
}
export function projectCtas(project) {
  const labels = { live: '在线体验', github: '查看代码', video: '观看影片' };
  const links = (project.links || []).filter(link => labels[link.kind] && safeExternalUrl(link.url));
  const buttons = links.map(link => externalLink(link.url, labels[link.kind], `project-link cta-${link.kind}`));
  if (project.videos.length) buttons.splice(Math.min(1, buttons.length), 0, '<button class="project-link cta-watch" type="button" data-scroll-videos>观看影片</button>');
  const hasLive = links.some(link => link.kind === 'live');
  const hints = hasLive ? `${project.slug === 'the-uncertain-oracle' ? '<p class="demo-hint">在线体验需要允许摄像头权限，用于手势互动。</p>' : ''}${links.some(link => link.kind === 'live' && new URL(link.url).hostname.endsWith('.onrender.com')) ? '<p class="demo-hint">体验服务首次打开时可能需要等待启动，请稍候。</p>' : ''}` : '';
  return buttons.length ? `<div class="project-ctas">${buttons.join('')}</div>${hints}` : '';
}
