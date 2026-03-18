<template>
  <el-form-item
    :label="label"
    :prop="prop"
    :required="required"
    :rules="rules"
  >
    <slot />
  </el-form-item>
</template>

<script setup lang="ts">
defineOptions({
  name: 'AhFormItem'
})

defineProps<{
  label?: string
  prop?: string
  required?: boolean
  rules?: any
}>()
</script>
