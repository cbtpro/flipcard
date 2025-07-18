import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      /**
       * 配置热更新
       */
      '@flipcard/react': path.resolve(__dirname, '../../packages/react/src'),
      '@flipcard/core': path.resolve(__dirname, '../../packages/core/src')
    }
  },
  server: {
    port: 5173
  }
});
