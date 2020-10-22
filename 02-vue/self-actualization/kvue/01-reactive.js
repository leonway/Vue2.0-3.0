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
  Object.keys(obj).forEach(key=>defineReactive(obj,key,obj[key]))
}

function set(obj,key,val) {
  defineReactive(obj,key,val)
}

const obj = {
  foo:'foo',
  bar:'bar',
  baz:{
    ff:'ff'
  }
}

observe(obj)
obj.foo
obj.foo = 'f000000'
// obj.bar
// obj.bar ='barrrrr'
// obj.baz.ff
// obj.baz = {jj:'jj'}
// obj.baz.jj
// obj.baz = {bb:'bb'}
// obj.baz.jj
// obj.baz.bb
// obj.baz.bb = 'xx'
set(obj,'dong','dong')
// obj.dong = 'dong'
obj.dong
obj.foo

//array
//push/pop/shift/unshift...使用 defineProperty拦截不到
// 
