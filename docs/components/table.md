# Table 表格

AhTable 是对 Element Plus Table 的封装，支持分页、条件查询、导出等功能。

## 基本用法

```vue
<template>
  <ah-table
    :api="fetchList"
    :search-form="searchForm"
    :columns="columns"
  />
</template>

<script setup>
import { ref } from 'vue'
import { AhTable, AhTableColumn } from 'ah-ui'

const columns = [
  { prop: 'name', label: '姓名' },
  { prop: 'age', label: '年龄' },
  { prop: 'address', label: '地址' }
]

const searchForm = [
  { prop: 'name', label: '姓名', component: 'input' },
  { prop: 'status', label: '状态', component: 'select', options: [
    { label: '启用', value: 1 },
    { label: '禁用', value: 0 }
  ]}
]

const fetchList = async (params) => {
  const res = await api.getList(params)
  return res
}
</script>
```

## Props

| 参数 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| data | 表格数据 | `array` | - |
| api | 获取数据的 API 函数 | `function` | - |
| search-form | 搜索表单配置 | `array` | `[]` |
| show-search | 是否显示搜索区域 | `boolean` | `true` |
| show-pagination | 是否显示分页 | `boolean` | `true` |
| show-export | 是否显示导出按钮 | `boolean` | `true` |
| export-file-name | 导出文件名 | `string` | `'导出数据'` |
| remote-paging | 是否后端分页 | `boolean` | `true` |

## Events

| 事件名 | 说明 | 回调参数 |
|--------|------|-----------|
| search-change | 搜索参数变化时触发 | `(params: object)` |
| selection-change | 选择项变化时触发 | `(selection: array)` |
| page-change | 分页变化时触发 | `(page: number, size: number)` |

## Methods

| 方法名 | 说明 | 参数 |
|--------|------|------|
| loadData | 重新加载数据 | `(params?: object)` |
| getTableData | 获取表格数据 | - |
| getSelectedRows | 获取选中的行 | - |

## 搜索表单配置

search-form 支持的组件类型：

- `input`: 输入框
- `select`: 选择器
- `date`: 日期选择器
- `daterange`: 日期范围选择器
- `datetimerange`: 日期时间范围选择器
- `cascader`: 级联选择器

每个配置项支持以下属性：

- `prop`: 字段名
- `label`: 标签名
- `component`: 组件类型
- `placeholder`: 占位符
- `props`: 组件额外属性
- `change`: 值变化回调
