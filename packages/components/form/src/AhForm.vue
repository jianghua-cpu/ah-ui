<template>
  <el-form
    ref="formRef"
    :model="model"
    :rules="rules"
    :label-width="labelWidth"
    :label-position="labelPosition"
    :inline="inline"
    :size="size"
    :disabled="disabled"
    @submit.prevent="handleSubmit"
  >
    <el-row :gutter="gutter">
      <el-col
        v-for="item in schema"
        :key="item.prop"
        :span="item.span || defaultSpan"
      >
        <el-form-item
          :label="item.label"
          :prop="item.prop"
          :required="item.required"
        >
          <component
            :is="getComponent(item.component)"
            v-model="model[item.prop]"
            v-bind="item.props"
            :placeholder="item.placeholder || `请输入${item.label}`"
            :disabled="item.disabled || disabled"
            :options="item.options || []"
            :api="item.api"
            :clearable="item.clearable !== false"
            @change="(val: any) => handleChange(item, val)"
          >
            <template v-if="item.component === 'select' && item.optionLabel">
              <el-option
                v-for="option in item.options"
                :key="option[item.optionValue || 'value']"
                :label="option[item.optionLabel]"
                :value="option[item.optionValue || 'value']"
                :disabled="option.disabled"
              />
            </template>
            <template v-if="item.slots?.prefix">
              <template #prefix>{{ item.slots.prefix }}</template>
            </template>
            <template v-if="item.slots?.suffix">
              <template #suffix>{{ item.slots.suffix }}</template>
            </template>
          </component>
        </el-form-item>
      </el-col>
      <el-col v-if="showActions" :span="defaultSpan">
        <el-form-item>
          <el-button type="primary" @click="handleSubmit">
            {{ submitText }}
          </el-button>
          <el-button @click="handleReset">
            {{ resetText }}
          </el-button>
          <slot name="actions" />
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'

export interface FormSchema {
  prop: string
  label: string
  component: string
  placeholder?: string
  props?: Record<string, any>
  options?: Array<Record<string, any>>
  optionLabel?: string
  optionValue?: string
  api?: (params?: any) => Promise<any>
  required?: boolean
  rules?: any
  disabled?: boolean
  clearable?: boolean
  span?: number
  slots?: {
    prefix?: string
    suffix?: string
  }
  change?: (value: any, model: Record<string, any>) => void
}

export interface AhFormProps {
  model?: Record<string, any>
  schema?: FormSchema[]
  rules?: FormRules
  labelWidth?: string | number
  labelPosition?: 'left' | 'right' | 'top'
  inline?: boolean
  size?: 'large' | 'default' | 'small'
  disabled?: boolean
  gutter?: number
  defaultSpan?: number
  showActions?: boolean
  submitText?: string
  resetText?: string
}

const props = withDefaults(defineProps<AhFormProps>(), {
  model: () => ({}),
  schema: () => [],
  rules: () => ({}),
  labelWidth: '100px',
  labelPosition: 'right',
  inline: false,
  size: 'default',
  disabled: false,
  gutter: 20,
  defaultSpan: 8,
  showActions: true,
  submitText: '提交',
  resetText: '重置'
})

const emit = defineEmits<{
  'update:model': [value: Record<string, any>]
  'submit': [model: Record<string, any>]
  'reset': []
  'change': [item: FormSchema, value: any]
}>()

const formRef = ref<FormInstance>()

// 初始化表单数据
const model = reactive<Record<string, any>>(
  props.model || {}
)

// 监听 schema 变化，初始化默认值
watch(
  () => props.schema,
  (schemas) => {
    schemas.forEach((item) => {
      if (item.props?.defaultValue !== undefined && model[item.prop] === undefined) {
        model[item.prop] = item.props.defaultValue
      }
    })
  },
  { immediate: true, deep: true }
)

// 加载远程选项
const loadOptions = async (item: FormSchema) => {
  if (item.api && !item.options) {
    try {
      const res = await item.api()
      item.options = res.data || res.data?.list || res.data?.rows || []
    } catch (error) {
      console.error('加载选项失败:', error)
    }
  }
}

// 组件映射
const componentMap: Record<string, string> = {
  input: 'el-input',
  textarea: 'el-input',
  select: 'el-select',
  option: 'el-option',
  radio: 'el-radio-group',
  checkbox: 'el-checkbox-group',
  switch: 'el-switch',
  date: 'el-date-picker',
  daterange: 'el-date-picker',
  datetimerange: 'el-date-picker',
  time: 'el-time-picker',
  timepicker: 'el-time-picker',
  number: 'el-input-number',
  cascader: 'el-cascader',
  upload: 'el-upload'
}

const getComponent = (component: string) => {
  return componentMap[component] || 'el-input'
}

// 值变化处理
const handleChange = (item: FormSchema, value: any) => {
  if (item.change) {
    item.change(value, model)
  }
  emit('change', item, value)
}

// 提交
const handleSubmit = async () => {
  if (!formRef.value) return

  try {
    await formRef.value.validate()
    emit('update:model', model)
    emit('submit', model)
  } catch (error) {
    console.log('表单验证失败')
  }
}

// 重置
const handleReset = () => {
  formRef.value?.resetFields()
  emit('reset')
}

// 暴露方法
defineExpose({
  validate: () => formRef.value?.validate(),
  validateField: (prop: string) => formRef.value?.validateField(prop),
  resetFields: () => formRef.value?.resetFields(),
  clearValidate: (props?: string | string[]) => formRef.value?.clearValidate(props),
  getFormModel: () => model,
  setFormModel: (model: Record<string, any>) => {
    Object.assign(model, model)
  },
  loadOptions,
  formRef
})
</script>
