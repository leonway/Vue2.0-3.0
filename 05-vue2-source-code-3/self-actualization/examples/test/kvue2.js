/****
 * kvue2 任务
 * 增加$mount(el)
 *   获取宿主
 *   updateComponent
 *   创建Watcher
 * Watcher改造
 *    能够传入updateComponent
 *    和dep对应关系1：n 
 * 
 * **/

// 数组的响应式操作
// 1.替换数组原型中的7个方法
const originalProto = Array.prototype;
// 备份 修改备份
const arrayProto = Object.create(originalProto);
["push", "pop", "shift", "unshift"].forEach((method) => {
  arrayProto[method] = function (...data) {
    // 原始操作
    originalProto[method].apply(this, data);
    // 追加操作:通知更新
    console.log("数组执行" + method + "操作:" + data);
  };
});

function defineReactive(obj, key, val) {
  observe(val);
  //创建Dep实例
  const dep = new Dep();
  Object.defineProperty(obj, key, {
    get() {
      // console.log('get', key, val);
      //依赖收集
      Dep.target && dep.addDep(Dep.target);
      return val;
    },
    set(newVal) {
      if (newVal !== val) {
        observe(newVal);
        val = newVal;
        dep.notify();
      }
      // console.log('set', key, val);
    },
  });
}

function observe(obj) {
  if (typeof obj !== "object" || obj === null) {
    return;
  }
  //遍历obj所有key 做响应式处理
  // Object.keys(obj).forEach(key=>defineReactive(obj,key,obj[key]))
  // console.log(this.$data)
  new Observe(obj);
}

class Observe {
  constructor(value) {
    this.value = value;
    if (Array.isArray(value)) {
      value.__protp__ = arrayProto;
      // 对数组内部元素执行响应化
      const keys = Object.keys(obj);
      for (let i = 0; i < obj.length; i++) {
        observe(obj[i]);
      }
    } else {
      this.walk(value);
    }
  }

  walk(obj) {
    //遍历obj所有key 做响应式处理
    Object.keys(obj).forEach((key) => defineReactive(obj, key, obj[key]));
  }
}

function proxy(vm) {
  const proxyKeys = ["$data", "$methods"];
  const proxyEvent = (originKey) => {
    console.log(vm[originKey],originKey)
    vm[originKey]&&Object.keys(vm[originKey]).forEach((key) => {
      Object.defineProperty(vm, key, {
        get() {
          return vm[originKey][key];
        },
        set(newVal) {
          if (vm[originKey][key] !== newVal) {
            vm[originKey][key] = newVal;
          }
        },
      });
    });
  };
  proxyKeys.forEach((proxyKey) => proxyEvent(proxyKey));
}

// Kvue
// 1.对data选项做响应式处理
// 2.编辑模板
class Vue {
  constructor(options) {
    this.$options = options;
    this.$data = options.data;
    this.$methods = options.methods;
    // console.log(this.$data)
    //data 响应式处理
    observe(this.$data);
    // console.log(this.$data)
    //代理
    proxy(this);

    if(options.el){
      this.$mount(options.el)
    }
  }

  $mount(el){
    //获取宿主
    this.$el = document.querySelector(el)

    //创建一个updateComponent
    const updateComponent = ()=>{
      //真实dom版本
      //获取渲染函数
      // const { render } = this.$options;
      // const el = render.call(this);
      // const parent = this.$el.parentElement
      // parent.insertBefore(el,this.$el.nextSibling)
      // parent.removeChild(this.$el)

      //vdom版本
      const { render } = this.$options;
      const vnode = render.call(this,this.$createElement);
      //vnode变成dom
      this._update(vnode)
      
    }

    //创建根组件对应的Watcher
    new Watcher(this,updateComponent)
  }

  _update(vnode){
    const preVnode = this._vnode

    if(!preVnode){
      // init
      this.__patch__(this.$el,vnode)
    }else{
      this.__patch__(preVnode,vnode)
    }
  }

  __patch__(oldVnode,vnode){
    // dom
    if(oldVnode.nodeType){
      const parent = oldVnode.parentElement
      const refElm = oldVnode.nextSibling
      const el = this.createElm(vnode)
      // props
      //children
      parent.insertBefore(el,refElm)
      parent.removeChild(oldVnode)

      //保存当前vnode
      this._vnode = vnode
    }else{
      //update
      //获取el
      const el = vnode.el = oldVnode.el
      if(oldVnode.tag===vnode.tag){
        //props
        //获取新旧的props，比对
        const oldProps = oldVnode.props||{}
        const newProps = vnode.props||{}
        for(const key in newProps){
          const oldValue = oldProps[key]
          const newValue = newProps[key]
          if(oldValue !== newValue){
            el.setAttribute(key,newValue)
          }
        }
        //属性删除
        for(const key in oldProps){
          if(!(key in newProps)){
            el.removeAttribute(key)
          }
        }
        //children
        const oldCh = oldVnode.children
        const newCh = vnode.children
        if(typeof newCh === 'string'){
          if(typeof oldCh === 'string'){
            if(oldCh!==newCh){
              el.textContent = newCh
            }
          }else{
            el.textContent = newCh
          }
        }else if(newCh instanceof Array){
          if(oldCh instanceof Array){
           this.updateChildren(el,oldCh,newCh)
          }else{
            el.innerHTML = ''
            newCh.forEach(child=>this.createElm(child))
          }
        }
      }
    }
  }

  updateChildren(parentElm,oldCh,newCh){
    const len = Math.min(oldCh.length,newCh.length)
    for(let i=0;i<len;i++){
      this.__patch__(oldCh[i],newCh[i])
    }
    if(newCh.length>oldCh.length){
      //add
      newCh.slice(len).forEach(child=>{
        const el = this.createElm(child)
        parentElm.appendChild(el)
      })
    }else if(newCh.length<oldCh.length){
      //remove
        //add
        oldCh.slice(len).forEach(child=>{
          const el = this.createElm(child)
          parentElm.removeChild(el)
        })
    }
  }

  createElm(vnode){
    const el = document.createElement(vnode.tag)
    //props
    if(vnode.props){
      for(const key in vnode.props){
        const value = vnode.props[key]
        el.setAttribute(key,value)
      }
    }
    //children
    if(vnode.children){
      if(typeof vnode.children === 'string'){
        //text
        el.textContent = vnode.children
      }else if(vnode.children instanceof Array){
        //递归
        vnode.children.forEach(n=>{
          const child = this.createElm(n)
          el.appendChild(child)
        })
      }
    }
    vnode.el = el
    return el
  }

  $createElement(tag, props,children){
    return {tag, props,children}
  }
}

class Compile {
  constructor(el, vm) {
    this.$vm = vm;
    this.$el = document.querySelector(el);

    if (this.$el) {
      this.compile(this.$el);
    }
  }

  compile(el) {
    // 遍历el子节点，判断它们类型作相应的处理
    const childNodes = el.childNodes;

    childNodes.forEach((node) => {
      if (node.nodeType === 1) {
        // 元素
        // console.log('元素',node.nodeName);
        // 处理指令和事件
        const attrs = node.attributes;
        Array.from(attrs).forEach((attr) => {
          // k-xxx="abc"
          const attrName = attr.name;
          const exp = attr.value;
          if (attrName.startsWith("k-")) {
            const dir = attrName.substring(2);
            // console.log(dir);

            // this[dir]&&this[dir](node,exp)
            this.update(node, exp, dir);
          }
          if (attrName.startsWith("@")) {
            const dir = attrName.substring(1);
            // console.log(dir);
            this.update(node, exp, dir);
          }
          if (attrName === "v-model") {
            this.update(node, exp, "model");
          }
        });
      } else if (this.isInter(node)) {
        // 文本
        console.log("插值", node.textContent);
        // this.compileText(node)
        this.update(node, RegExp.$1, "text");
      }
      if (node.childNodes) {
        this.compile(node);
      }
    });
  }

  update(node, exp, dir) {
    // console.log(dir, exp)
    const that = this;
    // 初始化
    const fn = this[dir + "Updater"];
    fn && fn.call(this, node, this.$vm[exp], exp);

    // 更新
    new Watcher(this.$vm, exp, function (val) {
      fn && fn.call(that, node, val, exp);
    });
  }

  textUpdater(node, value) {
    node.textContent = value;
  }

  htmlUpdater(node, value) {
    node.innerHTML = value;
  }

  clickUpdater(node, value) {
    // console.log(node,value,this)
    if (value instanceof Function) {
      node.onclick = (...data) => {
        value.apply(this.$vm, data);
      };
    }
  }

  modelUpdater(node, value, key) {
    if (node.nodeName === "INPUT") {
      node.value = value;
      node.oninput = (e) => {
        this.$vm[key] = e.target.value;
      };
    }
  }

  //是否是插值表达式
  isInter(node) {
    return node.nodeType === 3 && /\{\{(.*)\}\}/.test(node.textContent);
  }
}

//监听器： 负责依赖更新
class Watcher {
  constructor(vm, fn) {
    this.vm = vm;
    this.getter = fn;

    this.get()
  }

  get(){
    // 触发依赖收集
    Dep.target = this;
    this.getter.call(this.vm);
    Dep.target = null;
  }

  // 未来被Dep调用
  update() {
    this.get()
  }
}

class Dep {
  constructor() {
    this.deps = new Set();
  }

  addDep(watcher) {
    this.deps.add(watcher);
  }

  notify() {
    this.deps.forEach((watcher) => watcher.update());
  }
}
