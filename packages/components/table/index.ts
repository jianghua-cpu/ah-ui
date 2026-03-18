import type { App } from 'vue'
import AhTable from './src/AhTable.vue'
import AhTableColumn from './src/AhTableColumn.vue'

AhTable.install = (app: App) => {
  app.component('AhTable', AhTable)
  app.component('AhTableColumn', AhTableColumn)
}

export { AhTable, AhTableColumn }
export default AhTable
