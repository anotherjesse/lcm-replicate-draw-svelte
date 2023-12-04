import { vitePreprocess } from '@sveltejs/vite-plugin-svelte'

export default {
  preprocess: vitePreprocess(),
  kit: {
    vite: {
      server: {
        proxy: {
          '/v1': {
            target: 'https://api.replicate.com/',
            changeOrigin: true,
          },
          '/pbxt': {
            target: "https://replicate.delivery/",
            changeOrigin: true,
          }
        }
      }
    }
  }
}