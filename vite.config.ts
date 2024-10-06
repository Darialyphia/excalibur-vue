import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
//@ts-ignore
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
  plugins: [
    vue({
      script: {
        defineModel: true,
        propsDestructure: true
      }
    })
  ],

  resolve: {
    alias: {
      //@ts-ignore
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
});
