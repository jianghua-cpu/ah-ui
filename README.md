# Ah UI

基于 Element Plus 封装的 Vue3 业务组件库

## 特性

- Table 组件：支持分页、条件查询、前端导出 / 接口导出
- Form 组件：配置式表单，支持 12 种表单控件
- 多种导入方式：全量引入、按需引入、自动导入
- 完整的 TypeScript 类型支持
- VitePress 文档站点

## 安装

```bash
npm install @huazio/ah-ui
```

## 快速开始

```vue
<template>
  <ah-form :schema="schema" v-model="formData" @submit="handleSubmit" />
</template>

<script setup>
import { AhForm } from '@huazio/ah-ui'

const formData = ref({})
const schema = [
  { prop: 'name', label: '姓名', component: 'input' }
]
const handleSubmit = (data) => {
  console.log(data)
}
</script>
```

## 文档

详细文档请访问 [Ah UI 文档](https://jianghua-cpu.github.io/ah-ui/)

## Github

源码地址 [Github](https://github.com/jianghua-cpu/ah-ui)

## License

MIT
