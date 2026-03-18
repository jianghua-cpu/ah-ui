---
layout: home
title: Ah UI
hero:
  name: Ah UI
  text: 基于 Element Plus 封装的业务组件库
  tagline: 高效、易用、可扩展
  actions:
    - theme: brand
      text: 快速开始
      link: /guide/getting-started
    - theme: alt
      text: 查看组件
      link: /components/table
features:
  - title: 丰富的组件
    details: 封装了 Table、Form 等常用业务组件，开箱即用
  - title: 多种导入方式
    details: 支持全量导入、按需导入、自动导入，满足不同场景
  - title: 完善的文档
    details: 提供完整的组件文档和示例，部署到 GitHub Pages
---

## 安装

```bash
npm install ah-ui
```

## 快速使用

```vue
<template>
  <ah-form :schema="schema" v-model="formData" @submit="handleSubmit" />
</template>

<script setup>
import { AhForm } from 'ah-ui'

const formData = ref({})
const schema = [
  { prop: 'name', label: '姓名', component: 'input' },
  { prop: 'age', label: '年龄', component: 'number' }
]

const handleSubmit = (data) => {
  console.log(data)
}
</script>
```
