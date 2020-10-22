function defineReactive(obj,key,val) {
  observe(val)
  Object.defineProperty(obj,key,{
    get(){
      console.log('get', key, val);
      return val
    },
    set(newVal){
      if(newVal!==val){
        observe(newVal)
        val=newVal
      }
      console.log('set', key, val);
    }
  })
}

function observe(obj) {
  if(typeof obj !=='object'||obj===null){
    return
  }
  //遍历obj所有key 做响应式处理
  // Object.keys(obj).forEach(key=>defineReactive(obj,key,obj[key]))

  new Observe(this.$data)
}

class Observe{
  constructor(value){
    this.value = value
    if(Array.isArray(value)){}
  }
}

// Kvue
// 1.对data选项做响应式处理
// 2.编辑模板
class Vue {
  constructor(options){
    this.$options = options
    this.$data = options.data

    //data 响应式处理
    observe(this.$data)
  }
}

