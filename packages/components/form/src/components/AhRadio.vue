<template>
  <el-radio-group v-bind="$attrs">
    <slot>
      <el-radio v-for="item in options" :key="item[optionValue]" :value="item[optionValue]">
        {{ item[optionLabel] }}
      </el-radio>
    </slot>
  </el-radio-group>
</template>

<script setup lang="ts">
defineOptions({
  name: 'AhRadio'
})

withDefaults(defineProps<{
  options?: Record<string, any>[]
  optionLabel?: string
  optionValue?: string
}>(), {
  options: () => [],
  optionLabel: 'label',
  optionValue: 'value'
})
</script>
