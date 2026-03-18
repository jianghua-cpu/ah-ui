<template>
  <div class="ah-table-wrapper">
    <!-- 查询区域 -->
    <div v-if="showSearch && searchForm.length" class="ah-table-search">
      <el-form
        ref="searchFormRef"
        :model="searchModel"
        :inline="true"
        :label-width="searchLabelWidth"
        class="search-form"
        @submit.prevent="handleSearch"
      >
        <el-form-item
          v-for="item in searchForm"
          :key="item.prop"
          :label="item.label"
          :prop="item.prop"
        >
          <component
            :is="getSearchComponent(item)"
            v-model="searchModel[item.prop]"
            v-bind="item.props"
            :placeholder="item.placeholder || `请输入${item.label}`"
            clearable
            @change="item.change?.($event)"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :icon="Search" @click="handleSearch">
            搜索
          </el-button>
          <el-button :icon="Refresh" @click="handleReset">
            重置
          </el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 操作按钮区域 -->
    <div v-if="showActionBar" class="ah-table-action">
      <div class="action-left">
        <slot name="action-left" />
      </div>
      <div class="action-right">
        <slot name="action-right" />
        <el-button
          v-if="showExport"
          :icon="Download"
          @click="handleExport"
        >
          导出
        </el-button>
        <el-button
          v-if="showRefresh"
          :icon="Refresh"
          circle
          @click="loadData()"
        />
        <el-button
          v-if="showColumnSetting"
          :icon="Setting"
          circle
          @click="showColumnDialog = true"
        />
      </div>
    </div>

    <!-- 表格区域 -->
    <el-table
      ref="tableRef"
      v-loading="loading"
      :data="tableData"
      :border="border"
      :stripe="stripe"
      :height="tableHeight"
      :max-height="maxHeight"
      :row-key="rowKey"
      :expand-row-keys="expandRowKeys"
      @selection-change="handleSelectionChange"
      @sort-change="handleSortChange"
    >
      <el-table-column
        v-if="showSelection"
        type="selection"
        width="55"
        align="center"
      />
      <el-table-column
        v-if="showIndex"
        type="index"
        label="序号"
        width="60"
        align="center"
      />
      <slot />
    </el-table>

    <!-- 分页区域 -->
    <div v-if="showPagination" class="ah-table-pagination">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :total="total"
        :page-sizes="pageSizes"
        :layout="paginationLayout"
        :background="true"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

    <!-- 列设置对话框 -->
    <el-dialog
      v-model="showColumnDialog"
      title="列设置"
      width="400px"
    >
      <el-checkbox-group v-model="visibleColumns">
        <el-checkbox
          v-for="col in allColumns"
          :key="col.prop"
          :label="col.prop"
        >
          {{ col.label }}
        </el-checkbox>
      </el-checkbox-group>
      <template #footer>
        <el-button @click="showColumnDialog = false">取消</el-button>
        <el-button type="primary" @click="confirmColumnSetting">
          确定
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch, nextTick } from 'vue'
import { Search, Refresh, Download, Setting } from '@element-plus/icons-vue'
import * as XLSX from 'xlsx'
import type { FormInstance, TableInstance } from 'element-plus'

export interface SearchFormItem {
  prop: string
  label: string
  component?: string
  placeholder?: string
  props?: Record<string, any>
  change?: (value: any) => void
}

export interface AhTableProps {
  // 数据相关
  data?: any[]
  api?: (params: any) => Promise<any>
  remoteParams?: Record<string, any>
  rowKey?: string

  // 表格显示
  border?: boolean
  stripe?: boolean
  height?: string | number
  maxHeight?: string | number
  showIndex?: boolean
  showSelection?: boolean

  // 查询相关
  showSearch?: boolean
  searchForm?: SearchFormItem[]
  searchLabelWidth?: string | number

  // 分页相关
  showPagination?: boolean
  paginationLayout?: string
  pageSizes?: number[]
  remotePaging?: boolean

  // 导出相关
  showExport?: boolean
  exportFileName?: string
  exportFields?: Record<string, string>

  // 操作相关
  showActionBar?: boolean
  showRefresh?: boolean
  showColumnSetting?: boolean

  // 展开行
  expandRowKeys?: string[]
}

const props = withDefaults(defineProps<AhTableProps>(), {
  border: true,
  stripe: true,
  showIndex: true,
  showSelection: false,
  showSearch: true,
  searchLabelWidth: '100px',
  showPagination: true,
  paginationLayout: 'total, sizes, prev, pager, next, jumper',
  pageSizes: () => [10, 20, 50, 100],
  remotePaging: true,
  showExport: true,
  exportFileName: '导出数据',
  showActionBar: true,
  showRefresh: true,
  showColumnSetting: false
})

const emit = defineEmits<{
  'update:remoteParams': [value: Record<string, any>]
  'selection-change': [value: any[]]
  'search-change': [value: Record<string, any>]
  'page-change': [page: number, size: number]
  'sort-change': [sort: { prop: string; order: string }]
  'export-success': []
}>()

const loading = ref(false)
const tableData = ref<any[]>([])
const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(20)
const searchModel = reactive<Record<string, any>>({})
const searchFormRef = ref<FormInstance>()
const tableRef = ref<TableInstance>()
const selectedRows = ref<any[]>([])
const showColumnDialog = ref(false)
const allColumns = ref<any[]>([])
const visibleColumns = ref<string[]>([])

// 初始化查询表单默认值
watch(
  () => props.searchForm,
  (forms) => {
    if (forms) {
      forms.forEach((item) => {
        if (item.props?.defaultValue !== undefined) {
          searchModel[item.prop] = item.props.defaultValue
        }
      })
    }
  },
  { immediate: true }
)

// 加载数据
const loadData = async (params?: Record<string, any>) => {
  if (!props.api) {
    tableData.value = props.data || []
    total.value = tableData.value.length
    return
  }

  loading.value = true
  try {
    const queryParams = {
      ...props.remoteParams,
      ...searchModel,
      page: currentPage.value,
      pageSize: pageSize.value,
      ...params
    }

    const res = await props.api(queryParams)

    if (props.remotePaging) {
      tableData.value = res.data?.list || res.data?.rows || res.data || []
      total.value = res.data?.total || res.total || 0
    } else {
      tableData.value = res.data?.list || res.data || []
      total.value = tableData.value.length
    }
  } catch (error) {
    console.error('加载数据失败:', error)
  } finally {
    loading.value = false
  }
}

// 获取查询组件
const getSearchComponent = (item: SearchFormItem) => {
  const componentMap: Record<string, string> = {
    input: 'el-input',
    select: 'el-select',
    date: 'el-date-picker',
    daterange: 'el-date-picker',
    datetimerange: 'el-date-picker',
    time: 'el-time-picker',
    cascader: 'el-cascader'
  }
  return componentMap[item.component || 'input'] || 'el-input'
}

// 搜索
const handleSearch = () => {
  currentPage.value = 1
  emit('search-change', searchModel)
  loadData()
}

// 重置
const handleReset = () => {
  searchFormRef.value?.resetFields()
  handleSearch()
}

// 分页大小改变
const handleSizeChange = (size: number) => {
  pageSize.value = size
  currentPage.value = 1
  emit('page-change', currentPage.value, size)
  loadData()
}

// 当前页改变
const handleCurrentChange = (page: number) => {
  currentPage.value = page
  emit('page-change', page, pageSize.value)
  loadData()
}

// 选择变化
const handleSelectionChange = (selection: any[]) => {
  selectedRows.value = selection
  emit('selection-change', selection)
}

// 排序变化
const handleSortChange = ({ prop, order }: any) => {
  emit('sort-change', { prop, order })
}

// 导出功能
const handleExport = () => {
  const exportData = selectedRows.value.length > 0 ? selectedRows.value : tableData.value

  if (exportData.length === 0) {
    ElMessage.warning('没有数据可导出')
    return
  }

  const fields = props.exportFields || {}
  const headers: Record<string, string> = {}
  const keys: string[] = []

  // 收集所有需要导出的列
  const columns = allColumns.value.length > 0 ? allColumns.value : getTableColumns()

  columns.forEach((col: any) => {
    if (col.prop && col.label && col.export !== false) {
      headers[col.prop] = col.label
      keys.push(col.prop)
    }
  })

  const data = exportData.map((row) => {
    const rowData: Record<string, any> = {}
    keys.forEach((key) => {
      rowData[headers[key]] = row[key]
    })
    return rowData
  })

  const worksheet = XLSX.utils.json_to_sheet(data)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1')

  // 设置列宽
  const colWidths = keys.map((key) => ({
    wch: Math.max(...data.map((row) => String(row[key] || '').length), headers[key].length)
  }))
  worksheet['!cols'] = colWidths

  // 生成文件
  const fileName = `${props.exportFileName}_${new Date().toISOString().slice(0, 10)}`
  XLSX.writeFile(workbook, `${fileName}.xlsx`)

  ElMessage.success('导出成功')
  emit('export-success')
}

// 获取表格列信息
const getTableColumns = () => {
  const columns: any[] = []
  const slots = (tableRef.value?.$slots as any) || {}

  // 从 slot 获取列信息
  Object.keys(slots).forEach((key) => {
    if (key.startsWith('column_')) {
      const prop = key.replace('column_', '')
      columns.push({ prop, label: prop })
    }
  })

  return columns
}

// 列设置确认
const confirmColumnSetting = () => {
  showColumnDialog.value = false
}

// 暴露方法
defineExpose({
  loadData,
  getTableData: () => tableData.value,
  getSelectedRows: () => selectedRows.value,
  refresh: loadData,
  searchModel
})
</script>

<style scoped lang="scss">
.ah-table-wrapper {
  .ah-table-search {
    padding: 16px;
    background: #fff;
    border-radius: 4px;
    margin-bottom: 16px;

    .search-form {
      :deep(.el-form-item) {
        margin-bottom: 12px;
      }
    }
  }

  .ah-table-action {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 0;
    margin-bottom: 12px;

    .action-left,
    .action-right {
      display: flex;
      align-items: center;
      gap: 8px;
    }
  }

  .ah-table-pagination {
    display: flex;
    justify-content: flex-end;
    padding: 16px 0;
  }
}
</style>
