import react from '@vitejs/plugin-react';
import path from 'node:path';
import { defineConfig } from 'vite';

export default defineConfig({
  root: __dirname,
  plugins: [react()],
  resolve: {
    alias: {
      '@calendar': path.resolve(__dirname, '../src/Calendar'),
    },
  },
  server: {
    port: 5173,
  },
});
