let Vue;

class VueRouter{
  constructor(options){
    
    this.routerMap = {}
    if(options.routes){
      this.routerMap = options.routes.reduce((state,cur)=>({...state,[cur.path]:cur.component}),{})
    }
    const initPath = window.location.hash.split('#')[1]||"/"
    Vue.util.defineReactive(this,'current',initPath)
    // console.log(initPath,this.current,this.routerMap)
    window.addEventListener("hashchange",()=>{
      // console.log(window.location.hash.split('#')[1]||"/")
      this.current = window.location.hash.split('#')[1]||"/"
    })

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

  Vue.component('router-link',{
    props:{
      to:{
        type:String,
        required:true
      }
    },
    render(h){

      return h('a',{attrs:{
        href:"#"+this.to
      }},this.$slots.default)
    }
  })

  Vue.component('router-view',{
 
    render(h){
      // console.log(this.$router.current,this.$router.routerMap);
      let component = this.$router.routerMap[this.$router.current] || null
      return h(component)
    }
  })
}

export default VueRouter
