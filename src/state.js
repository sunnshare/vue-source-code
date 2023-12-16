import Dep from "./observe/dep";
import { observe } from "./observe/index";
import Watcher from "./observe/watch";

export function initState(vm) {
  const opts = vm.$options;
  if (opts.data) {
    initData(vm);
  }
  if (opts.computed) {
    initComputed(vm);
  }
}

// vm.key => vm._data.key
function proxy(vm, target, key) {
  Object.defineProperty(vm, key, {
    get() {
      return vm[target][key];
    },
    set(newValue) {
      vm[target][key] = newValue;
    },
  });
}

function initData(vm) {
  let data = vm.$options.data;

  data = typeof data === "function" ? data.call(vm) : data; // data是函数或对象

  vm._data = data;
  observe(data);

  for (let key in data) {
    proxy(vm, "_data", key);
  }
}

function initComputed(vm) {
  const computed = vm.$options.computed;
  const watchers = (vm._computedWatchers = {});
  for (let key in computed) {
    let userDef = computed[key];

    let fn = typeof userDef === "function" ? userDef : userDef.get;
    watchers[key] = new Watcher(vm, fn, { lazy: true }); // 监控计算属性中get的变化
    defineComputed(vm, key, userDef);
  }
}

function defineComputed(target, key, userDef) {
  const setter = userDef.set || (() => {});

  Object.defineProperty(target, key, {
    get: createComputedGetter(key),
    set: setter,
  });
}

//  计算属性根本不会收集依赖，只会让自己的依赖去收集依赖
function createComputedGetter(key) {
  return function () {
    const watcher = this._computedWatchers[key];
    if (watcher.dirty) {
      watcher.evaluate();
    }
    // 计算属性出栈后，还要渲染watcher，让计算属性watcher里面的属性也去收集上一层watcher
    if (Dep.target) {
      watcher.depend();
    }
    return watcher.value;
  };
}
