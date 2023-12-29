import { defineConfig } from 'vite';
import viteSVGLoader from 'vite-svg-loader';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), viteSVGLoader()],
  build: {
    outDir: 'dist',
    lib: {
      entry: resolve(__dirname, 'src/components/vue-aplayer/index.js'),
      name: 'APlayer',
      fileName: 'vue-aplayer',
      formats: ['es', 'cjs'],
    },
    rollupOptions: {
      external: ['vue'],
      output: {
        globals: {
          vue: 'Vue',
        },
        intro: 'import "./style.css";',
      }
    },
  }
})