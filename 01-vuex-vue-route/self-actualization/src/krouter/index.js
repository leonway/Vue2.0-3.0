import Vue from 'vue';
import Router from './kvue-router'
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
    component:()=>import(/* webpackChunkName: "about" */ '../views/About.vue'),
    children:[
      {
        path:'/about/info',
        component:{
          render(h){return h('div','info page')}
        }
      }
    ]
  }
]

export default new Router({
  mode:'history',
  base:process.env.BASE_URL,
  routes
})
