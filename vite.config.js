import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000
  },
  // If hosting on GitHub Pages under a subfolder, e.g. https://<username>.github.io/<repo-name>/
  // base: '/<repo-name>/',
});
