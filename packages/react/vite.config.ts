import { defineConfig } from 'vite';
import path from 'path';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';

export default defineConfig({
  plugins: [react(), dts()],
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.tsx'),
      name: 'FlipCardReact',
      fileName: (format) => `index.${format}.js`,
      formats: ['es', 'cjs']
    },
    rollupOptions: {
      external: ['react', 'react-dom', '@flipcard/core'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          '@flipcard/core': 'FlipCardCore'
        }
      }
    }
  }
});
