import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig(({ mode }) => {
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      base: './',
      root: path.resolve(import.meta.dirname, 'src'),
      build: {
        outDir: path.resolve(import.meta.dirname, 'dist'),
      },
      plugins: [react(), tailwindcss()],
      resolve: {
        alias: {
          '@': path.resolve(import.meta.dirname, 'src'),
        }
      }
    };
});
