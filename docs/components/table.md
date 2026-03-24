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
import { AhTable, AhTableColumn } from '@huazio/ah-ui'

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
| export-mode | 导出模式，可选 `front` / `api` | `string` | `'front'` |
| export-api | 导出接口（`export-mode="api"` 时必填） | `function` | - |
| export-file-name | 导出文件名 | `string` | `'导出数据'` |
| remote-paging | 是否后端分页 | `boolean` | `true` |

## Events

| 事件名 | 说明 | 回调参数 |
|--------|------|-----------|
| search-change | 搜索参数变化时触发 | `(params: object)` |
| selection-change | 选择项变化时触发 | `(selection: array)` |
| page-change | 分页变化时触发 | `(page: number, size: number)` |
| export-success | 导出成功后触发 | - |
| export-error | 导出失败时触发 | `(error: any)`

## 导出

支持两种导出模式：通过 `export-mode` 控制。

### 前端导出（默认）

纯前端处理，使用 `xlsx` 库将当前表格已有数据导出为 Excel。

```vue
<ah-table
  :api="fetchList"
  :export-mode="'front'"
  export-file-name="用户列表"
/>
```

- 导出当前页或选中行的数据
- 列头以表格 `label` 为准
- 如列配置了 `export: false`，该列不会导出

### 接口导出

由后端接口返回文件流，前端触发下载。

```vue
<ah-table
  :api="fetchList"
  :export-mode="'api'"
  :export-api="exportApi"
  export-file-name="用户列表"
  @export-success="handleExportSuccess"
  @export-error="handleExportError"
/>
```

```ts
const exportApi = async (params) => {
  return await axios.post('/api/user/export', params, {
    responseType: 'blob'
  })
}
```

接口支持的返回格式：

| 格式 | 说明 |
|------|------|
| 直接返回 `Blob` | 直接下载 |
| `{ data: Blob, filename: string }` | 从 data 取 Blob，从 filename 取文件名 |
| `{ url: string }` 或 `{ href: string }` | 通过链接下载 |

### 对比

| 模式 | 适用场景 | 数据来源 |
|------|---------|---------|
| `front` | 数据量小（千级以下）、无需后端参与 | 当前表格已有数据 |
| `api` | 数据量大、需要后端分页/权限过滤 | 后端接口返回文件流 |

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
