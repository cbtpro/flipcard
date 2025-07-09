import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      /**
       * 配置热更新
       */
      '@chenbitao/core': path.resolve(__dirname, '../../packages/core/src'),
      '@chenbitao/react': path.resolve(__dirname, '../../packages/react/src'),
    }
  },
  optimizeDeps: {
    include: [],
    exclude: []
  },
});
