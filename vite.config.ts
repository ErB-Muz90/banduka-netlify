import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: 'index.html'
      },
      external: [
        'react',
        'react-dom',
        /^react-dom\//,
        'recharts',
        'framer-motion',
        'qrcode',
        'jspdf',
        'html2canvas',
        'jsbarcode',
        'next'
      ]
    }
  },
  server: {
    port: 3000,
    host: true
  }
});
