const isObject = v =>typeof v==='object'&&v!==null
// 利用es6 Proxy
function reactive(obj) {
  if (!isObject(obj)) {
    return obj
  }
  return new Proxy(obj, {
    get(target, key, receiver) {
      try {
        const res = Reflect.get(target, key, receiver)
        const real = isObject(res)?reactive(res):res
        console.log('get', key,'target',target)
        // 收集依赖
        track(target,key)
        return real
      } catch (e) {
        console.log(e);
      }
    },
    set(target, key, value, receiver) {
      const res = Reflect.set(target, key, value, receiver)
      // 触发副作用
      trigger(target,key)
      console.log('set', key,'target',target)
      return res
    },
    deleteProperty(target, key) {
      const res = Reflect.deleteProperty(target, key)
      console.log('deleteProperty', key,'target',target)
      return res
    }
  })
}

//临时存储副作用函数
const effectStack = []

//副作用函数：建立传入fn和其内部的依赖之间的映射关系
function effect(fn) {
  //执行fn触发依赖的get方法
  const e = createReactiveEffect(fn)
  //立即执行
  e()

  return e
}

function createReactiveEffect(fn) {
  //封装fn:错误处理，保存到stack
  const effect = function (...args) {
    try {
      //入栈
      effectStack.push(effect)
      //立即执行
      return fn(...args)
    } finally {
      //出栈
      effectStack.pop()
    }
  }
  return effect
}

//依赖收集
const targetMap = new WeakMap()
function track(target,key) {
    //获取副作用函数
    const effect = effectStack[effectStack.length-1]
    console.log('effect',effect);
    if(effect){
      //初始化是target这个key不存在
      let depMap = targetMap.get(target)
      if(!depMap){
        depMap = new Map()
        targetMap.set(target,depMap)
      }

      //从depMap 中获取到副作用函数集合
      let deps = depMap.get(key)
      //初始化时deps不存在
      if(!deps){
        deps = new Set()
        depMap.set(key,deps)
      }

      //放入新传入的副作用函数
      deps.add(effect)
    }  
}

//触发副作用
function trigger(target,key) {
  // 获取target, key对应的set
  const depMap = targetMap.get(target)
  if(!depMap){
    return
  }
  const deps = depMap.get(key)
  if(deps){
    // 循环执行内部的所有副作用函数
    deps.forEach(dep=>dep())
  }
}



// 获取一个响应式对象
const state = reactive({foo:'foo',bar:{n:1},arr:[1,2,3]})
// state.foo
// state.dong = 'dong'
// state.dong
// delete state.dong
// state.arr.push(4)
// state.arr
// state.bar.n

// state.bar = {z:3}
// state.bar.z
// console.log(state);
effect(()=>{
  console.log('触发了effect'+state.foo);
})

effect(()=>{
  console.log('触发了effect2'+state.foo+state.bar);
})

setTimeout(() => {
  state.foo='ffffffff'
}, 2000);

