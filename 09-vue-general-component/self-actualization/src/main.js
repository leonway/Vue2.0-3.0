import Vue from 'vue'
import App from './App.vue'
import router from './router'
import Notice from './components/Notice'
import KTable from './components/KTable'

Vue.use(Notice).use(KTable)
Vue.config.productionTip = false

new Vue({
  notice:new Notice({}),
  router,
  render: h => h(App),
}).$mount('#app')
