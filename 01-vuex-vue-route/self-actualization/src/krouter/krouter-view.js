export default {
 
  render(h){
    // console.log(this.$router,this.$vnode,this.$parent)
    //嵌套路由处理
    const {  matches } = this.$router
    this.$vnode.data.routerView = true;
    // console.log(this.$vnode.data);
    let depth = 0;
    let parent = this.$parent
    while(parent){
      // console.log(parent)
      const vnodeData = parent.$vnode &&parent.$vnode.data
      if(vnodeData){
        if(vnodeData.routerView===true){
          depth++
        }
      }
      parent = parent.$parent
    }
    
    let component = null
    // console.log(matches,depth);
    const route = matches&&matches[depth]
    if(route){
      component = route.component
    }
    // 非嵌套路由处理
    // const { current, routerMap } = this.$router
    // const component =routerMap&&routerMap[current]||null

    return h(component)
  }
}
