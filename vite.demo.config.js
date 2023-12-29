import { defineConfig } from 'vite';
import viteSVGLoader from 'vite-svg-loader';
import vue from '@vitejs/plugin-vue';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), viteSVGLoader()],
  build: {
    outDir: "demo",
    minify: "terser",
  }
})