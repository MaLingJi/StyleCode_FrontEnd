import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import { createStyleImportPlugin, AntdResolve } from 'vite-plugin-style-import';

// https://vitejs.dev/config/
export default defineConfig({
  // base: '/',
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
      host: 'stylecode.online',  // 您的公共 IP 或域名
      port: 5173,       // 與 server 的端口一致
      protocol: 'ws',   // 或者 'wss' 如果您使用 HTTPS
    }
  },
});