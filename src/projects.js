// Replace each object’s layers, thumbnail and copy here. Paths are relative to public/.
export const projects = [
  { id: 'orbit', title: 'Orbit of ideas', category: 'Creative coding', year: 'STUDY 01', color: '#e7e3f2', depth: 0.35, description: 'An imagined playground of orbital motion and unexpected connections. A placeholder for a future creative coding project.' },
  { id: 'fold', title: 'Another dimension', category: '3D animation', year: 'STUDY 02', color: '#e6e9f3', depth: 0.22, description: 'A study of folded forms, shifting perspectives and dimensional storytelling. A placeholder for a future animation project.' },
  { id: 'bloom', title: 'A little wild', category: 'Generative art', year: 'STUDY 03', color: '#e8edce', depth: 0.5, description: 'An imagined system where simple rules grow into surprising organic forms. A placeholder for a future generative artwork.' },
  { id: 'signal', title: 'Good vibrations', category: 'Interactive design', year: 'STUDY 04', color: '#f0dce8', depth: 0.3, description: 'A playful exploration of signals, sound and human input. A placeholder for a future interactive experience.' },
  { id: 'frame', title: 'Beyond the frame', category: 'Multimedia design', year: 'STUDY 05', color: '#dce9ec', depth: 0.18, description: 'An imagined meeting point for image, movement and mixed media. A placeholder for a future multimedia project.' },
].map(project => ({ ...project, layers: [`/objects/${project.id}-back.png`, `/objects/${project.id}-front.png`] }));
