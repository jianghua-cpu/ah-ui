# Form 表单

AhForm 是对 Element Plus Form 的封装，通过配置式的方式快速构建表单。

## 基本用法

```vue
<template>
  <ah-form
    v-model="formData"
    :schema="schema"
    @submit="handleSubmit"
  />
</template>

<script setup>
import { ref, reactive } from 'vue'
import { AhForm } from 'ah-ui'

const formData = reactive({})

const schema = [
  { prop: 'name', label: '姓名', component: 'input', required: true },
  { prop: 'age', label: '年龄', component: 'number' },
  { prop: 'gender', label: '性别', component: 'select', options: [
    { label: '男', value: 'male' },
    { label: '女', value: 'female' }
  ]},
  { prop: 'birthday', label: '生日', component: 'date' },
  { prop: 'status', label: '状态', component: 'switch' }
]

const handleSubmit = (data) => {
  console.log('提交数据:', data)
}
</script>
```

## 配置式表单

通过 schema 配置表单项，无需编写大量模板代码。

| 参数 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| v-model | 表单数据 | `object` | - |
| schema | 表单配置 | `array` | `[]` |
| rules | 验证规则 | `object` | - |
| label-width | 标签宽度 | `string` | `'100px'` |
| label-position | 标签位置 | `string` | `'right'` |
| inline | 是否行内表单 | `boolean` | `false` |
| size | 表单尺寸 | `string` | `'default'` |
| disabled | 是否禁用 | `boolean` | `false` |
| gutter | 栅格间隔 | `number` | `20` |
| default-span | 默认栅格跨度 | `number` | `8` |
| show-actions | 是否显示操作按钮 | `boolean` | `true` |
| submit-text | 提交按钮文本 | `string` | `'提交'` |
| reset-text | 重置按钮文本 | `string` | `'重置'` |

## Events

| 事件名 | 说明 | 回调参数 |
|--------|------|-----------|
| submit | 提交表单时触发 | `(model: object)` |
| reset | 重置表单时触发 | - |
| change | 表单项值变化时触发 | `(item: FormSchema, value: any)` |

## Methods

| 方法名 | 说明 | 参数 |
|--------|------|------|
| validate | 验证表单 | - |
| validateField | 验证指定字段 | `(prop: string)` |
| resetFields | 重置表单 | - |
| clearValidate | 清除验证 | `(prop?: string | string[])` |
| getFormModel | 获取表单数据 | - |

## Schema 配置

支持的组件类型：

- `input`: 输入框
- `textarea`: 文本域
- `select`: 选择器
- `radio`: 单选框
- `checkbox`: 复选框
- `switch`: 开关
- `date`: 日期选择器
- `daterange`: 日期范围
- `time`: 时间选择器
- `number`: 数字输入框
- `cascader`: 级联选择器
- `upload`: 上传组件
