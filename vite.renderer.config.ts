import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import UnoCSS from 'unocss/vite';
import { resolve } from 'path';

export default defineConfig({
  plugins: [vue(), UnoCSS()],
  define: {
    __VUE_OPTIONS_API__: true,
    __VUE_PROD_DEVTOOLS__: false,
  },
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
        math: "parens-division",
      },
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  optimizeDeps: {
    include: ['element-plus', '@element-plus/icons-vue'],
  },
});