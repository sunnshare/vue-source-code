import Dep, { popTarget, pushTarget } from "./dep";

let id = 0;

// 不同组件有不同的watcher
class Watcher {
  constructor(vm, exprOrFn, options, cb) {
    this.id = id++;
    this.renderWatcher = options;

    if (typeof exprOrFn === "string") {
      this.getter = function () {
        return vm[exprOrFn];
      };
    } else {
      this.getter = exprOrFn;
    }

    this.deps = [];
    this.depsId = new Set();
    this.lazy = options.lazy;
    this.cb = cb;
    this.dirty = this.lazy;
    this.vm = vm;

    this.user = options.user; // 标识是否是用户自己的watcher

    this.value = this.lazy ? undefined : this.get();
  }
  addDep(dep) {
    let id = dep.id;
    if (!this.depsId.has(id)) {
      this.deps.push(dep);
      this.depsId.add(id);
      dep.addSub(this);
    }
  }
  evaluate() {
    this.value = this.get(); // 获取到用户的返回值，并且标记为dirty
    this.dirty = false;
  }
  get() {
    pushTarget(this);
    // Dep.target = this; // 静态属性只有一份，渲染之前赋予当前watcher，让dep去记住
    let value = this.getter.call(this.vm);
    popTarget();
    // Dep.target = null; // 渲染完毕后清空，再渲染下一个watcher
    return value;
  }
  depend() {
    let i = this.deps.length;

    while (i--) {
      this.deps[i].depend(); // 让计算属性watcher也收集渲染watcher
    }
  }
  update() {
    if (this.lazy) {
      // 如果是计算属性，依赖的值发生变化了，就标记计算属性是脏值了
      this.dirty = true;
    } else {
      queueWatcher(this);
      // this.get(); // 重新渲染
    }
  }
  run() {
    let oldValue = this.value;
    let newValue = this.get();
    if (this.user) {
      this.cb.call(this.vm, newValue, oldValue);
    }
  }
}

let queue = [];
let has = {};
let pending = false;

function flushSchedulerQueue() {
  let flushQueue = queue.slice(0);
  queue = [];
  has = [];
  pending = false;
  flushQueue.forEach((q) => q.run());
}

function queueWatcher(watcher) {
  const id = watcher.id;
  if (!has[id]) {
    queue.push(watcher);
    has[id] = true;
    if (!pending) {
      setTimeout(flushSchedulerQueue, 0);
      pending = true;
    }
  }
}

let callbacks = [];
let waiting = false;
function flushCallbacks() {
  let cbs = callbacks.slice(0);
  waiting = false;
  callbacks = [];
  cbs.forEach((cb) => cb());
}

// 优雅降级的方式，内部先采用的是 promiss(ie不兼容) > MutationObserver(h5的api) > setImmediate(ie专享) > setTimeOut
let timerFunc;
if (Promise) {
  timerFunc = () => {
    Promise.resolve().then(flushCallbacks);
  };
} else if (MutationObserver) {
  let observer = new MutationObserver(flushCallbacks);
  let textNode = document.createTextNode(1);
  observer.observe(textNode, {
    characterData: true,
  });
  timerFunc = () => {
    textNode.textContent = 2;
  };
} else if (setImmediate) {
  timerFunc = () => {
    setImmediate(flushCallbacks);
  };
} else {
  timerFunc = () => {
    setTimeout(flushCallbacks);
  };
}

export function nextTick(cb) {
  callbacks.push(cb);
  if (!waiting) {
    // timerFunc()
    Promise.resolve().then(flushCallbacks);
    waiting = true;
  }
}

export default Watcher;
