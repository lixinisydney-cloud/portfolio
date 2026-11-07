import draft from '../content/projects-draft.json';

// JSON is the only editorial source. These values control presentation only.
const presentation = {
  'good-boy': { color: '#e7e3f2', depth: 0.35 },
  'the-making-of-pets': { color: '#e6e9f3', depth: 0.22 },
  'city-life-is-fun': { color: '#e8edce', depth: 0.5 },
  'anger-market': { color: '#f0dce8', depth: 0.3 },
  'chroma-residences': { color: '#dce9ec', depth: 0.18 },
  'horse-motion-study': { color: '#e5e3df', depth: 0 },
};
export const assetUrl = path => `${import.meta.env.BASE_URL}assets/${path.replace(/^\/+/, '')}`;
export const projectHref = slug => `#/projects/${encodeURIComponent(slug)}`;
export const projects = draft.map(project => ({ ...project, ...presentation[project.slug] }));
