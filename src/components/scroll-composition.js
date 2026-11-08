// Original DOM/CSS interpretation: native scroll, no reference renderer/code.
// A single scheduled frame updates nearby chapters; no permanent animation loop.
const clamp = value => Math.max(0, Math.min(1, value));
export function createScrollComposition(home) {
  const chapters = [...home.querySelectorAll('[data-motion]')].slice(2);
  const intro = home.querySelector('.intro');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  let frame = 0;
  let enabled = true;
  const nearby = new Set();
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      entry.target.classList.toggle('is-near', entry.isIntersecting);
      entry.isIntersecting ? nearby.add(entry.target) : nearby.delete(entry.target);
    }
    schedule();
  }, { rootMargin: '100% 0px' });
  chapters.forEach(chapter => observer.observe(chapter));
  function update() {
    frame = 0;
    if (!enabled || home.hidden || document.hidden || reduce.matches) return;
    const height = innerHeight;
    const mobile = innerWidth <= 760;
    const introProgress = clamp(-intro.getBoundingClientRect().top / height);
    intro.style.setProperty('--intro-progress', introProgress);
    for (const chapter of nearby) {
      const rect = chapter.getBoundingClientRect();
      const reveal = clamp((height * .95 - rect.top) / (height * (mobile ? .45 : .65)));
      const drift = clamp((height - rect.top) / (rect.height + height));
      chapter.style.setProperty('--portal-inset', `${(1 - reveal) * (mobile ? 6 : 36)}%`);
      chapter.style.setProperty('--portal-radius', `${(1 - reveal) * (mobile ? 16 : 48)}%`);
      chapter.style.setProperty('--image-scale', 1 + (1 - reveal) * .08);
      chapter.style.setProperty('--text-x', `${(drift - .3) * (mobile ? 12 : 90)}px`);
    }
  }
  function schedule() { if (!frame && enabled && !reduce.matches) frame = requestAnimationFrame(update); }
  function motionPreference() {
    home.classList.toggle('motion-ready', !reduce.matches);
    if (reduce.matches) {
      intro.style.removeProperty('--intro-progress');
      for (const chapter of chapters) chapter.removeAttribute('data-animated');
    } else schedule();
  }
  addEventListener('scroll', schedule, { passive: true });
  addEventListener('resize', schedule, { passive: true });
  document.addEventListener('visibilitychange', schedule);
  reduce.addEventListener('change', motionPreference);
  motionPreference();
  return {
    setEnabled(value) { enabled = value; if (!value) { cancelAnimationFrame(frame); frame = 0; } else schedule(); },
    destroy() { cancelAnimationFrame(frame); observer.disconnect(); removeEventListener('scroll', schedule); removeEventListener('resize', schedule); document.removeEventListener('visibilitychange', schedule); reduce.removeEventListener('change', motionPreference); },
  };
}
