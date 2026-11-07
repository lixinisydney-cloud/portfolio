import draft from '../content/projects-draft.json';
import siteContent from '../content/site.json';

// Presentation metadata retained from phase A; the island composition is defined in components/world.js.
const presentation = {
  'good-boy': { color: '#e7e3f2', depth: 0.35 },
  'the-making-of-pets': { color: '#e6e9f3', depth: 0.22 },
  'city-life-is-fun': { color: '#e8edce', depth: 0.5 },
  'anger-market': { color: '#f0dce8', depth: 0.3 },
  'chroma-residences': { color: '#dce9ec', depth: 0.18 },
  'horse-motion-study': { color: '#e5e3df', depth: 0 },
};
const sceneOrder = ['good-boy', 'the-making-of-pets', 'city-life-is-fun', 'anger-market', 'chroma-residences'];
export const assetUrl = path => `${import.meta.env.BASE_URL}assets/${path.replace(/^\/+/, '')}`;
export const projectHref = slug => `#/projects/${encodeURIComponent(slug)}`;
export const projects = draft.map(project => ({ color: '#eae7df', depth: 0, ...project, ...presentation[project.slug] }));
export const sceneProjects = sceneOrder.map(slug => projects.find(p => p.slug === slug)).filter(p => p?.sceneObject);
export const mainProjects = projects.filter(p => p.collection !== 'experiment').sort((a, b) => a.priority - b.priority);
export const experiments = projects.filter(p => p.collection === 'experiment');
export const site = siteContent;
export const projectTitle = project => project.titleCn || project.title;
