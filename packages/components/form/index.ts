import type { App } from 'vue'
import AhForm from './src/AhForm.vue'
import AhFormItem from './src/AhFormItem.vue'
import * as formComponents from './src/components'

const components = {
  AhForm,
  AhFormItem,
  ...formComponents
}

AhForm.install = (app: App) => {
  Object.entries(components).forEach(([name, component]) => {
    app.component(name, component as any)
  })
}

export { AhForm, AhFormItem }
export type { FormSchema } from './src/AhForm.vue'
export default AhForm
