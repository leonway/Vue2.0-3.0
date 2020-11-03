import Vue from 'vue'
import App from './App.vue'
import router from './router'
import Notice from './components/Notice'

Vue.use(Notice)
Vue.config.productionTip = false

new Vue({
  notice:new Notice({}),
  router,
  render: h => h(App),
}).$mount('#app')
