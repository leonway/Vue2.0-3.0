import View from './krouter-view'
import Link from './krouter-link'

let Vue;

class VueRouter{
  constructor(options){
    
    // this.routerMap = {}
    // if(options.routes){
    //   this.routerMap = options.routes.reduce((state,cur)=>({...state,[cur.path]:cur.component}),{})
    // }
    // const initPath = window.location.hash.split('#')[1]||"/"
    // Vue.util.defineReactive(this,'current',initPath)
    this.current = window.location.hash.split('#')[1]||"/"
    Vue.util.defineReactive(this,'matches',[])
    this.match(options.routes)
    window.addEventListener("hashchange",()=>{
      this.current = window.location.hash.split('#')[1]||"/"
      this.matches = []
      this.match(options.routes)
    })

  }

  match(routes){
    console.log(this.current,routes)
    for(const route of routes){
      if(route.path==='/'&&this.current==='/'){
        this.matches.push(route)
        return 
      }
      if(route.path!=='/'&&this.current.includes(route.path)){
        this.matches.push(route)
        if(route.children &&route.children.length){
          this.match(route.children)
        }
        return
      }
    }
  }
}

VueRouter.install=function(_Vue){
  Vue=_Vue

  Vue.mixin({
    beforeCreate() {
      if(this.$options.router){
        Vue.prototype.$router = this.$options.router
      }
    }
  })
  
  Vue.component('router-link',Link)

  Vue.component('router-view',View)
}

export default VueRouter
