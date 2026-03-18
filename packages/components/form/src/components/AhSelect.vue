<template>
  <el-select v-bind="$attrs" :loading="loading">
    <slot>
      <el-option
        v-for="item in options"
        :key="item[optionValue]"
        :label="item[optionLabel]"
        :value="item[optionValue]"
        :disabled="item.disabled"
      />
    </slot>
  </el-select>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

defineOptions({
  name: 'AhSelect'
})

const props = withDefaults(defineProps<{
  options?: Record<string, any>[]
  optionLabel?: string
  optionValue?: string
  api?: () => Promise<any>
  loading?: boolean
}>(), {
  options: () => [],
  optionLabel: 'label',
  optionValue: 'value',
  loading: false
})

const loading = ref(false)

watch(() => props.api, async (api) => {
  if (api) {
    loading.value = true
    try {
      await api()
    } finally {
      loading.value = false
    }
  }
}, { immediate: true })
</script>
