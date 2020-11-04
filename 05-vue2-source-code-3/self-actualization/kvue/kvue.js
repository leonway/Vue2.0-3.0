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
    // console.log(vm[originKey],originKey)
    Object.keys(vm[originKey]).forEach((key) => {
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

    //compile
    new Compile(options.el, this);
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
  constructor(vm, key, updateFn) {
    this.vm = vm;
    this.key = key;
    this.updateFn = updateFn;

    // 触发依赖收集
    Dep.target = this;
    this.vm[this.key];
    Dep.target = null;
  }

  // 未来被Dep调用
  update() {
    // 执行实际更新操作
    this.updateFn.call(this.vm, this.vm[this.key]);
  }
}

class Dep {
  constructor() {
    this.deps = [];
  }

  addDep(dep) {
    this.deps.push(dep);
  }

  notify() {
    this.deps.forEach((dep) => dep.update());
  }
}
