import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/radio-lab/',
  // Separate HTML entry points avoid GitHub Pages SPA routing and allow direct links.
  build: {
    rollupOptions: {
      input: [
        'index.html',
        'constellations/index.html',
        'constellations/qpsk/index.html',
      ],
    },
  },
});
