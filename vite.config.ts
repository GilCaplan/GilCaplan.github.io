import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// User-site (gilcaplan.github.io) is served at the root, so base = '/'.
// If this ever becomes a project-site, set base to '/<repo>/'.
export default defineConfig({
  base: '/',
  plugins: [react()],
});
