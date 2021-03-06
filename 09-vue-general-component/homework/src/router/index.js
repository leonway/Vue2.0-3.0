import Vue from 'vue';
import Router from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(Router)

const routes = [
  {
    path:'/',
    name:'Home',
    component:Home
  },
  {
    path:'/form',
    name:'Form',
    component:()=>import(/* webpackChunkName: "about" */ '../views/Form.vue')
  },
  {
    path:'/table',
    name:'Table',
    component:()=>import(/* webpackChunkName: "table" */ '../views/Table.vue')
  }
]

export default new Router({
  mode:'history',
  base:process.env.BASE_URL,
  routes
})
