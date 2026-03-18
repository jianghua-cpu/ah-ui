# Ah UI 组件库实现思路

## 概述

Ah UI 是基于 Element Plus 封装的业务组件库，主要解决中后台项目中表格和表单的重复开发问题。通过配置化的方式，让开发者能够快速构建数据表格和表单页面。

## 架构设计

### 目录结构

```
packages/
├── components/
│   ├── table/          # 表格组件
│   │   ├── src/
│   │   │   ├── AhTable.vue
│   │   │   └── AhTableColumn.vue
│   │   └── index.ts
│   ├── form/           # 表单组件
│   │   ├── src/
│   │   │   ├── AhForm.vue
│   │   │   ├── AhFormItem.vue
│   │   │   └── components/
│   │   └── index.ts
│   └── index.ts
└── theme/              # 主题样式
```

### 组件设计原则

1. **配置化优先**: 通过 props 传递配置，减少业务代码
2. **渐进式增强**: 在 Element Plus 基础上封装，保留原有功能
3. **类型安全**: 完整的 TypeScript 类型定义
4. **插槽扩展**: 提供插槽支持自定义内容

## Table 组件实现

### 核心功能

1. **分页支持**
   - 前端分页：一次性加载所有数据，前端处理分页
   - 后端分页：每次请求携带分页参数，后端返回分页数据
   - 通过 `remote-paging` 属性切换

2. **条件查询**
   - 集成搜索表单，自动生成查询条件
   - 支持多种查询组件：input、select、date、daterange 等
   - 搜索、重置按钮自动处理

3. **数据导出**
   - 使用 `xlsx` 库实现 Excel 导出
   - 支持 xlsx 和 csv 格式
   - 支持选中导出和全量导出

### 实现要点

```typescript
// 数据加载逻辑
const loadData = async (params?: Record<string, any>) => {
  if (!props.api) {
    // 前端模式：使用 data prop
    tableData.value = props.data || []
    return
  }

  // 后端模式：调用 API
  const queryParams = {
    ...props.remoteParams,
    ...searchModel,
    page: currentPage.value,
    pageSize: pageSize.value,
    ...params
  }

  const res = await props.api(queryParams)
  // 处理不同的接口返回格式
  tableData.value = res.data?.list || res.data?.rows || res.data || []
  total.value = res.data?.total || res.total || 0
}
```

### 导出功能

```typescript
const handleExport = () => {
  const exportData = selectedRows.value.length > 0
    ? selectedRows.value
    : tableData.value

  // 转换为工作表
  const worksheet = XLSX.utils.json_to_sheet(data)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1')

  // 写入文件
  XLSX.writeFile(workbook, `${fileName}.xlsx`)
}
```

## Form 组件实现

### 核心功能

1. **配置式表单**
   - 通过 schema 数组配置表单项
   - 自动渲染对应的表单组件
   - 支持动态表单项

2. **表单验证**
   - 继承 Element Plus 的验证规则
   - 支持自定义校验函数

3. **数据处理**
   - 支持 v-model 双向绑定
   - 提供 submit 事件回调
   - 支持表单重置

### 实现要点

```typescript
// 组件映射
const componentMap: Record<string, string> = {
  input: 'el-input',
  select: 'el-select',
  date: 'el-date-picker',
  // ...
}

// 动态渲染组件
<component
  :is="getComponent(item.component)"
  v-model="model[item.prop]"
  v-bind="item.props"
/>
```

### Schema 配置

```typescript
interface FormSchema {
  prop: string           // 字段名
  label: string          // 标签名
  component: string     // 组件类型
  placeholder?: string   // 占位符
  props?: object         // 组件属性
  options?: array       // 选项列表（select、radio、checkbox）
  required?: boolean    // 是否必填
  rules?: object        // 验证规则
  disabled?: boolean    // 是否禁用
  span?: number         // 栅格跨度
  change?: function     // 值变化回调
}
```

## 导入方式

### 1. 全量引入

```typescript
import AhUI from 'ah-ui'
app.use(AhUI)
```

### 2. 按需引入

```typescript
import { AhTable, AhForm } from 'ah-ui'
```

### 3. 自动导入

使用 `unplugin-vue-components`：

```typescript
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

export default defineConfig({
  plugins: [
    Components({
      resolvers: [ElementPlusResolver()]
    })
  ]
})
```

## 注意事项

### 1. 样式处理

- 组件库使用 SCSS 预处理器
- 需要配置 Vite 的 `css.preprocessorOptions`
- 确保安装了 `sass` 依赖

### 2. 依赖管理

- Element Plus 作为 peerDependency
- 用户项目需要安装 Vue 3 和 Element Plus

### 3. 类型定义

- 使用 `defineProps` 和 `defineEmits` 提供类型
- 导出 TypeScript 类型供外部使用
- 打包时生成 `.d.ts` 类型文件

### 4. 打包配置

- 使用 Vite 库模式打包
- 生成 ES 和 UMD 两种格式
- 配置 `external` 排除 Vue 和 Element Plus

### 5. 常见问题

**Q: 表格数据不显示？**
- 检查 API 返回的数据格式
- 确认 `remote-paging` 配置正确

**Q: 表单验证不生效？**
- 确保 schema 中配置了 `required` 或单独的 `rules`

**Q: 样式不生效？**
- 检查是否引入了组件库样式
- 确认 Vite 配置正确

## 扩展建议

1. **更多组件**: 可继续封装 Dialog、Drawer、Tree 等组件
2. **主题定制**: 支持自定义主题色和样式变量
3. **国际化**: 添加 i18n 支持
4. **单元测试**: 添加 Jest/Vitest 测试用例
