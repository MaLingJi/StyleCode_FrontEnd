import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import { createStyleImportPlugin, AntdResolve } from 'vite-plugin-style-import';

// https://vitejs.dev/config/
export default defineConfig({
  // base: '/',
  // fs: {
  //   // 允許訪問指定的路徑
  //   allow: ['/home/a385500062appletw/frontend/StyleCode_FrontEnd']
  // },
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
  // server: {
  //   host: '0.0.0.0',
  //   port: 5173,
  //   hmr: {
  //     host: 'stylecode.online',  // 您的公共 IP 或域名
  //     port: 5173,       // 與 server 的端口一致
  //     protocol: 'wss',   // 或者 'wss' 如果您使用 HTTPS
  //   }
  // },
  build: {
    chunkSizeWarningLimit: 1000,  // 將警告限制設為 1000 kB
  }
});