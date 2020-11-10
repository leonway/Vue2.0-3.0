import Vue from 'vue'

// 传入一个组件配置
// 将他实例化，挂在至body

export default function create(Component,props) {
  // 实例化方法：
  // 1.extend
  // 2.new Vue({render(){}})

  const vm = new Vue({
    render:h=>{
      return h(Component,{props});
    }
  })

  //挂在才能获得dom
  // 反例 vm.$mount(document.body) 会直接把所有已生成的页面替换掉
  vm.$mount() //不传递宿主，手动追加  避免覆盖原有的内容
  document.body.appendChild(vm.$el)

  //获取组件实例
  const comp = vm.$children[0]

  comp.remove = ()=>{
    document.body.removeChild(vm.$el)
    vm.$destroy()
  }

  return comp
}
