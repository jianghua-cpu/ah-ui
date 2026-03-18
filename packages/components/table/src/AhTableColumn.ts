import type { ExtractPropTypes, PropType } from 'vue'

export const tableColumnProps = {
  prop: {
    type: String,
    default: ''
  },
  label: {
    type: String,
    default: ''
  },
  width: {
    type: [String, Number] as PropType<string | number>,
    default: ''
  },
  minWidth: {
    type: [String, Number] as PropType<string | number>,
    default: ''
  },
  fixed: {
    type: [Boolean, String] as PropType<boolean | 'left' | 'right'>,
    default: false
  },
  sortable: {
    type: [Boolean, String] as PropType<boolean | 'custom'>,
    default: false
  },
  formatter: {
    type: Function as PropType<(row: any, column: any, cellValue: any, index: number) => string>
  },
  showOverflowTooltip: {
    type: Boolean,
    default: false
  },
  align: {
    type: String as PropType<'left' | 'center' | 'right'>,
    default: 'left'
  },
  slot: {
    type: String,
    default: ''
  }
}

export type TableColumnProps = ExtractPropTypes<typeof tableColumnProps>
