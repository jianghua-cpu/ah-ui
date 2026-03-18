<template>
  <el-date-picker v-bind="$attrs" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" />
</template>

<script setup lang="ts">
defineOptions({
  name: 'AhDateRangePicker'
})
</script>
