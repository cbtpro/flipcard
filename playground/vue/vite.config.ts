import path from 'path';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      /**
       * 配置热更新
       */
      '@chenbitao/core': path.resolve(__dirname, '../../packages/core/src'),
      '@chenbitao/vue': path.resolve(__dirname, '../../packages/vue/src'),
    }
  },
  optimizeDeps: {
    include: [],
    exclude: []
  },
});
