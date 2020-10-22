let Vue;

class Store {
  constructor(options={}){
    this._vm = new Vue({
      data:{
        $$state:options.state
      },
      computed: {
        ...(options['getters']||{})
      },
    })
    this._actions = options['actions']
    this._mutations = options['mutations']
    this.commit = this.commit.bind(this)
    this.dispatch = this.dispatch.bind(this)
    this.getters = {}
    const that = this
    Object.entries(options['getters']).forEach(([key,fn])=>{
      Object.defineProperty(that.getters,key,{
        get(){
          return fn(that._vm._data.$$state)
        },
        set(){
          console.error('不可以~~');
        }
      })
    })
   
    // console.log(this._vm);
  }

  get state(){
    return this._vm._data.$$state
  }

  set state(data){
    // console.log(data);
    console.error('please use replaceState to reset state');
  }

  commit(type,payload){
    if(this._mutations&&this._mutations[type]){
      this._mutations[type](this._vm._data.$$state,payload)
    }
  }

  dispatch(type,payload){
    if(this._actions&&this._actions[type]){
      this._actions[type](this,payload)
    }
  }

}

function install (_Vue){
  Vue = _Vue

  Vue.mixin({
    beforeCreate() {
      if(this.$options.store){
        Vue.prototype.$store = this.$options.store
      }
    },
  })
}

export default { Store, install }
