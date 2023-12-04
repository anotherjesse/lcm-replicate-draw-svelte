import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [svelte()],
  server: {
    proxy: {
      '/v1': {
        target: 'https://api.replicate.com/',
        changeOrigin: true,
      },
      '/pbxt': {
        target: "https://replicate.delivery/",
        changeOrigin: true,
      },
    },
  },
})