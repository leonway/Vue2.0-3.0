// 数组的响应式操作
// 1.替换数组原型中的7个方法
const originalProto = Array.prototype
// 备份 修改备份
const arrayProto = Object.create(originalProto);
["push","pop","shift","unshift"].forEach(method=>{
  arrayProto[method] = function(...data) {
    // 原始操作
    originalProto[method].apply(this,data)
    // 追加操作:通知更新
    console.log('数组执行'+method+"操作:"+data);
  }
})


// 对象的响应式操作
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
  if(Array.isArray(obj)){
    // 覆盖原型 替换7个数组操作
    obj.__proto__ = arrayProto
    // 对数组内部元素执行响应化
    const keys = Object.keys(obj)
    for(let i = 0; i<obj.length;i++){
      observe(obj[i])
    }
  }else{
    //遍历obj所有key 做响应式处理
  Object.keys(obj).forEach(key=>defineReactive(obj,key,obj[key]))
  }
  
}

function set(obj,key,val) {
  defineReactive(obj,key,val)
}

const obj = {
  foo:'foo',
  bar:'bar',
  baz:{
    ff:'ff'
  },
  arr:[
    1,
    {
      foo:'foo',
      array:[
        1,2,{
          foo:'foo'
        }
      ]
    }
  ]
}

observe(obj)
// obj.foo
// obj.foo = 'f000000'
// obj.bar
// obj.bar ='barrrrr'
// obj.baz.ff
// obj.baz = {jj:'jj'}
// obj.baz.jj
// obj.baz = {bb:'bb'}
// obj.baz.jj
// obj.baz.bb
// obj.baz.bb = 'xx'
// set(obj,'dong','dong')
// obj.dong = 'dong'
// obj.dong
// obj.foo

obj.arr[1]["foo"] ="bar" 
obj.arr.push("bar")
//array
//push/pop/shift/unshift...使用 defineProperty拦截不到
// 
