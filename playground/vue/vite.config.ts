import path from 'path';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

// https://vite.dev/config/
export default defineConfig({
  base: './',
  plugins: [vue()],
  resolve: {
    alias: {
      /**
       * 配置热更新
       */
      '@flipcard/core': path.resolve(__dirname, '../../packages/core/src'),
      '@flipcard/theme': path.resolve(__dirname, '../../packages/theme/src'),
      '@flipcard/vue': path.resolve(__dirname, '../../packages/vue/src'),
    }
  },
  optimizeDeps: {
    include: [],
    exclude: []
  },
});
