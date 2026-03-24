import AhTable from "./src/AhTable.vue";
import AhTableColumn from "./src/AhTableColumn.vue";
AhTable.install = (app) => {
  app.component("AhTable", AhTable);
  app.component("AhTableColumn", AhTableColumn);
};
var table_default = AhTable;
export {
  AhTable,
  AhTableColumn,
  table_default as default
};
