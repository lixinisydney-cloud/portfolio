import { defineConfig } from 'vite';

// Relative entry URLs work at both / and /portfolio/ on GitHub Pages.
// Hash routes never change the document directory. --base can override this.
export default defineConfig({
  base: './',
  build: { rollupOptions: { input: { main: 'index.html', legacy: 'legacy.html' } } },
});
