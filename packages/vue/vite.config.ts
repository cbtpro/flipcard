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
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: 'FlipCardVue',
      fileName: (format) => `index.${format}.js`,
      formats: ['es', 'cjs']
    },
    rollupOptions: {
      external: ['vue', '@chenbitao/core'],
      output: {
        globals: {
          vue: 'Vue',
          '@chenbitao/core': 'FlipCardCore'
        }
      }
    }
  }
});
