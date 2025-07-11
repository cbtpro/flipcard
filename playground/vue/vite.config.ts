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
    },
    preserveSymlinks: false
  },
  server: {
    // 允许访问 monorepo 里的其他包
    fs: {
      allow: [
        path.resolve(__dirname, '../../'), // 允许访问 packages 根目录
      ],
    },
    watch: {
      // 解决某些文件系统或编辑器不触发热更新的问题
      usePolling: true,
      interval: 100,
    },
  },
  optimizeDeps: {
    include: [],
    exclude: []
  },
});
