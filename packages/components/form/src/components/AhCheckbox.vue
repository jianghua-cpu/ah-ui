<template>
  <el-checkbox-group v-bind="$attrs">
    <slot>
      <el-checkbox v-for="item in options" :key="item[optionValue]" :value="item[optionValue]">
        {{ item[optionLabel] }}
      </el-checkbox>
    </slot>
  </el-checkbox-group>
</template>

<script setup lang="ts">
defineOptions({
  name: 'AhCheckbox'
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
