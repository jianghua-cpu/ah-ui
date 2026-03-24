# 快速开始

## 环境要求

- Vue >= 3.2.0
- Element Plus >= 2.3.0

## 安装

```bash
npm install @huazio/ah-ui
```

## 快速使用

### 全量引入

```ts
import { createApp } from 'vue'
import AhUI from '@huazio/ah-ui'
import '@huazio/ah-ui/dist/index.css'
import 'element-plus/dist/index.css'

const app = createApp(App)
app.use(AhUI)
app.mount('#app')
```

### 按需引入

```ts
import { AhTable, AhForm } from '@huazio/ah-ui'
```

### 自动导入

配合 `unplugin-vue-components` 和 `unplugin-auto-import` 使用：

```ts
// vite.config.ts
import Components from 'unplugin-vue-components/vite'

export default defineConfig({
  plugins: [
    Components()
  ]
})
```

## 类型支持

组件库提供完整的 TypeScript 类型定义，无需额外安装类型包。
