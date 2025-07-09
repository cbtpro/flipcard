import { defineConfig } from 'vite';
// import path from 'path';
// import { fileURLToPath } from 'node:url';
// const dirname = typeof __dirname !== 'undefined' ? __dirname : path.dirname(fileURLToPath(import.meta.url));

// More info at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon
export default defineConfig({
  // build: {
  //   lib: {
  //     entry: path.resolve(__dirname, 'packages/core/index.ts'),
  //     name: 'FlipCard',
  //     formats: ['es', 'cjs'],
  //     fileName: format => `flipcard.${format}.js`
  //   },
  //   rollupOptions: {
  //     external: [],
  //     // 可以设置为外部依赖，如 react/vue 等
  //     output: {
  //       globals: {}
  //     }
  //   }
  // },
});