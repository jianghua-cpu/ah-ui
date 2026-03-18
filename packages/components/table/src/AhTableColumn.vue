<template>
  <el-table-column
    :prop="prop"
    :label="label"
    :width="width"
    :min-width="minWidth"
    :fixed="fixed"
    :sortable="sortable"
    :show-overflow-tooltip="showOverflowTooltip"
    :align="align"
  >
    <template v-if="slot" #default="scope">
      <slot :name="slot" :row="scope.row" :$index="scope.$index" />
    </template>
  </el-table-column>
</template>

<script setup lang="ts">
import { tableColumnProps } from './AhTableColumn'

defineProps(tableColumnProps)
</script>
