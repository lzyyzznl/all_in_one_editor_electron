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
  build: {
    // 增加代码块大小限制警告阈值（桌面应用可以接受更大的块）
    chunkSizeWarningLimit: 2000,
    rollupOptions: {
      output: {
        // 手动分割代码块
        manualChunks: {
          // Vue 相关
          vue: ['vue'],

          // Element Plus 核心
          'element-plus-core': ['element-plus'],
          'element-icons': ['@element-plus/icons-vue'],

          // Tiptap 核心
          'tiptap-core': ['@tiptap/core', '@tiptap/vue-3'],

          // Tiptap 基础扩展
          'tiptap-basic': [
            '@tiptap/extension-bubble-menu',
            '@tiptap/extension-character-count',
            '@tiptap/extension-focus'
          ],

          // Tiptap 高级扩展
          'tiptap-advanced': [
            '@tiptap/extension-table-of-contents',
            '@tiptap/extension-text-align',
            '@tiptap/extension-typography',
            'tiptap-extension-line-height'
          ],

          // Tiptap 第三方扩展
          'tiptap-starter-kit': ['@syfxlin/tiptap-starter-kit'],

          // 工具库分组
          'markdown-utils': ['marked'],
          'canvas-utils': ['html2canvas'],
          'format-utils': ['prettier'],

          // 拖拽相关
          'draggable': ['vue-draggable-plus', 'vuedraggable'],

          // 图标
          'icons': ['@iconify/vue']
        }
      }
    }
  }
});