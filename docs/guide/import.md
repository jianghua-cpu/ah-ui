# 导入方式

AhUI 支持多种导入方式，你可以根据项目需求选择最合适的方式。

## 全量引入

全量引入会引入整个组件库，适合快速开发。

```ts
import { createApp } from 'vue'
import AhUI from 'ah-ui'
import 'ah-ui/dist/index.css'
import 'element-plus/dist/index.css'

const app = createApp(App)
app.use(AhUI)
app.mount('#app')
```

使用组件：

```vue
<template>
  <ah-table :data="tableData" />
  <ah-form :schema="formSchema" />
</template>
```

## 按需引入

只引入需要的组件，减少打包体积。

```ts
import { AhTable, AhForm } from 'ah-ui'
import 'ah-ui/es/table/style'
import 'ah-ui/es/form/style'
```

### 单独引入 form 子组件

`form` 模块内置了 12 个常用表单项子组件，可通过 `formComponents` 对象整体引入，或逐个引入：

```ts
// 整体引入（所有子组件）
import { AhForm, formComponents } from 'ah-ui/form'
const { AhInput, AhSelect, AhDatePicker } = formComponents

// 逐个引入（更好的 Tree-shaking）
import { AhInput, AhSelect, AhDatePicker } from 'ah-ui/form'
```

支持的子组件列表：`AhInput`、`AhSelect`、`AhDatePicker`、`AhDateRangePicker`、`AhTimePicker`、`AhSwitch`、`AhRadio`、`AhCheckbox`、`AhInputNumber`、`AhCascader`、`AhUpload`。

> **说明**：`AhForm` 默认会在内部使用这些子组件，因此使用 `AhForm` 时无需额外引入。但如果你想在模板中单独使用某个表单项（如不通过 schema 配置），则需要自行引入对应的组件。

## 自动导入（推荐）

推荐使用 `unplugin-vue-components` 实现自动按需导入。

### 安装依赖

```bash
npm install -D unplugin-vue-components unplugin-auto-import
```

### 配置 Vite

```ts
// vite.config.ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

export default defineConfig({
  plugins: [
    vue(),
    Components({
      resolvers: [
        ElementPlusResolver({
          importStyle: 'sass'
        })
      ]
    })
  ]
})
```

## 导入方式对比

| 方式 | 优点 | 缺点 |
|------|------|------|
| 全量引入 | 使用简单 | 打包体积大 |
| 按需引入 | 打包体积小 | 需要手动引入 |
| 自动导入 | 兼具体积和便捷性 | 需要配置 |

建议在生产环境使用自动导入方式，以获得最佳的开发体验和打包体积。
