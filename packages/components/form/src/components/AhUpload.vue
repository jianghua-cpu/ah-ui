<template>
  <el-upload v-bind="$attrs" :auto-upload="false">
    <slot>
      <el-button type="primary">点击上传</el-button>
    </slot>
    <template #tip>
      <div v-if="$attrs.tip" class="el-upload__tip">
        {{ $attrs.tip }}
      </div>
    </template>
  </el-upload>
</template>

<script setup lang="ts">
defineOptions({
  name: 'AhUpload'
})
</script>
