import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { createStyleImportPlugin, AntdResolve } from 'vite-plugin-style-import'
import * as path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    createStyleImportPlugin({
      resolves: [AntdResolve()],
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
        // 可以在這裡設置其他 Less 選項
      },
    },
  },
  server: {
    host: '0.0.0.0',
    port: 5173,
  },
})
