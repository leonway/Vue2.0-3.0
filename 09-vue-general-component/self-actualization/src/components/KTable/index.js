import KTable from './KTable'
import KTableColumn from './KTableColumn'

KTable.install = (Vue)=>{
  Vue.component(KTable.name,KTable)
  Vue.component(KTableColumn.name,KTableColumn)
}

export default KTable

export {
  KTableColumn
}
