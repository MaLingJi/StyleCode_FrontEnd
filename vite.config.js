import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import { createStyleImportPlugin, AntdResolve } from 'vite-plugin-style-import';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    createStyleImportPlugin({
      resolves: [AntdResolve()],
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)), // 確保 alias 配置正確
    },
  },
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
      },
    },
  },
  server: {
    host: '0.0.0.0',
    port: 5173,
    hmr: {
      host: '35.229.197.237',  // 您的公共 IP 或域名
      port: 5173,       // 與 server 的端口一致
      protocol: 'ws',   // 或者 'wss' 如果您使用 HTTPS
    }
  },
  // 添加環境變數的配置
  define: {
    'process.env': {
      VITE_POST_IMAGE_URL: process.env.VITE_POST_IMAGE_URL,
    },
  },
});