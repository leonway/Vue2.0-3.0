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
    path:'/about',
    name:'About',
    component:()=>import(/* webpackChunkName: "about" */ '../views/About.vue')
  }
]

export default new Router({
  mode:'history',
  base:process.env.BASE_URL,
  routes
})
