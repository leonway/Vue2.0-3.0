import {create} from './config'
import Component from './Component.vue'

let Vue;

class Notice {

  constructor(options={}){
    this.$notice = (props)=>create(Component,Object.assign({},options,props))
  }
}

Notice.install = function (_Vue) {
 
  Vue = _Vue

  Vue.mixin({
    beforeCreate(){
      if(this.$options.notice){
        Vue.prototype.$notice = (...props)=>this.$options.notice.$notice(...props)
      }
    }
  })  
}

export default Notice
