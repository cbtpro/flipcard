import { defineConfig } from 'vite';
import path from 'path';
import vue from '@vitejs/plugin-vue';
import dts from 'vite-plugin-dts';

export default defineConfig({
  plugins: [vue(), dts({
    include: ['src'], // 确保只处理 src 下的内容
    outDir: 'dist', // 或者直接用 dist
    insertTypesEntry: true
  })],
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
        // 自动注入共享变量
        additionalData: (content, filename) => {
          if (filename.endsWith('.less')) {
            return `@import "${path.resolve(__dirname, '../theme/src/assets/style/variables.less')}";\n${content}`;
          }
          return content;
        }
      },
    },
  },
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: 'FlipCardVue',
      fileName: (format) => `index.${format}.js`,
      formats: ['es', 'cjs']
    },
    rollupOptions: {
      external: ['vue', '@flipcard/core', '@flipcard/theme', '@flipcard/utils'],
      output: {
        globals: {
          vue: 'Vue',
          '@flipcard/core': 'FlipCardCore',
          '@flipcard/theme': 'FlipCardTheme',
          '@flipcard/utils': 'FlipCardUtils'
        }
      }
    }
  },
  resolve: {
    alias: {
      /**
       * 开发时使用src目录
       */
      '@flipcard/core': path.resolve(__dirname, '../../packages/core/src'),
      '@flipcard/utils': path.resolve(__dirname, '../../packages/utils/src'),
      '@flipcard/theme': path.resolve(__dirname, '../../packages/theme/src')
    },
  },
});
