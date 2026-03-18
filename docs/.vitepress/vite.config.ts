import { defineConfig } from 'vitepress'

export default defineConfig({
  vite: {
    resolve: {
      alias: {
        '@': '/packages/components'
      }
    }
  }
})
