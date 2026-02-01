import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000', // Redirect to Backend API
        changeOrigin: true,
      },
      '/ws': {
        target: 'ws://localhost:3000',
        ws: true
      }
    }
  },
  build: {
    target: 'esnext',
    outDir: 'dist'
  }
});
