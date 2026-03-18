import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import { builtinModules } from 'module'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'packages/components')
    }
  },
  build: {
    lib: {
      entry: resolve(__dirname, 'packages/components/index.ts'),
      name: 'AhUI',
      fileName: (format) => `index.${format}.js`,
      formats: ['es', 'umd']
    },
    rollupOptions: {
      external: [
        'vue',
        'element-plus',
        '@element-plus/icons-vue',
        ...builtinModules,
        ...builtinModules.map(m => `node:${m}`)
      ],
      output: {
        globals: {
          vue: 'Vue',
          'element-plus': 'ElementPlus'
        },
        exports: 'named',
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === 'style.css') {
            return 'index.css'
          }
          return assetInfo.name
        }
      }
    },
    cssCodeSplit: false,
    minify: false,
    sourcemap: true
  }
})
