import './style.css';
import './world.css'; // Existing detail styling only; no world scene is mounted.
import './adrift.css';
import { projects, mainProjects, experiments, site, projectTitle } from './projects.js';
import { externalLink } from './components/cta.js';
import { escape } from './components/media.js';
import { workPresentation, renderWork } from './components/work-stream.js';
import { createLivingTypography } from './components/living-typography.js';
import { renderDetail } from './components/detail-view.js';
import { stopDirectMedia as stopMedia } from './components/direct-media.js';

const home = document.querySelector('#home-view');
const detail = document.querySelector('#project-detail');
mainProjects.forEach((project, index) => renderWork(project, index + 1, document.querySelector('#work-stream')));
experiments.forEach((project, index) => renderWork(project, index + 9, document.querySelector('#experiment-stream')));
document.querySelector('#about-short').textContent = site.aboutShortZh;
document.querySelector('#about-copy').textContent = site.aboutZh;
document.querySelector('#contact-links').innerHTML = `<a class="project-link" href="mailto:${escape(site.contact.email)}">Email / ${escape(site.contact.email)}</a>${externalLink(site.contact.github, 'GitHub')}${externalLink(site.contact.instagram, 'Instagram')}`;
const lettering = createLivingTypography(home);
const motion = { setEnabled(value) { lettering.setEnabled(value); } };
if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
let returnSlug;
let returnScroll = 0;
let wasProject = false;
home.addEventListener('click', event => {
  const link = event.target.closest('[data-project-link]');
  if (link && !event.ctrlKey && !event.metaKey && !event.shiftKey && !event.altKey) {
    returnSlug = link.dataset.projectLink;
    returnScroll = scrollY;
    history.replaceState({ ...history.state, portfolioReturn: { slug: returnSlug, y: returnScroll } }, '');
  }
});
function route() {
  const returningFromProject = wasProject;
  stopMedia(detail);
  const match = /^#\/projects\/([^/]+)$/.exec(location.hash);
  const isProject = Boolean(match);
  home.hidden = isProject;
  detail.hidden = !isProject;
  document.body.dataset.view = isProject ? 'project' : 'home';
  motion.setEnabled(!isProject);
  if (isProject) {
    const project = projects.find(p => encodeURIComponent(p.slug) === match[1]);
    if (project) {
      renderDetail(detail, project);
      document.title = `${workPresentation[project.slug].title} — SYDNEY'S WORLD`;
    } else {
      detail.innerHTML = '<h1 id="detail-title" tabindex="-1">Project not found</h1><a class="project-link" href="#work">Back to Works</a>';
      document.title = "Project not found — SYDNEY'S WORLD";
    }
    scrollTo({ top: 0, behavior: 'instant' });
    detail.querySelector('#detail-title').focus({ preventScroll: true });
  } else {
    detail.replaceChildren();
    document.title = "SYDNEY'S WORLD — Motion, code & interaction";
    requestAnimationFrame(() => {
      if (home.hidden) return;
      const saved = history.state?.portfolioReturn;
      if (saved) { returnSlug = saved.slug; returnScroll = saved.y; }
      if (returningFromProject && returnSlug && (!location.hash || location.hash === '#work')) {
        scrollTo({ top: returnScroll, behavior: 'instant' });
        home.querySelector(`[data-project-link="${returnSlug}"]`)?.focus({ preventScroll: true });
      } else {
        const id = location.hash.slice(1);
        if (['home', 'work', 'about', 'contact'].includes(id)) document.getElementById(id)?.scrollIntoView({ behavior: 'instant' });
        else if (returningFromProject) scrollTo({ top: 0, behavior: 'instant' });
      }
      motion.setEnabled(true);
    });
  }
  wasProject = isProject;
}
addEventListener('hashchange', route);
addEventListener('pagehide', () => { stopMedia(detail); motion.setEnabled(false); });
addEventListener('pageshow', () => motion.setEnabled(!home.hidden));
route();
