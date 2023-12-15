import Dep from "./dep";

let id = 0;

// 不同组件有不同的watcher
class Watcher {
  constructor(vm, exprOrFn, options) {
    this.id = id++;
    this.renderWatcher = options;
    this.getter = exprOrFn;
    this.deps = [];
    this.depsId = new Set();
    this.get();
  }
  addDep(dep) {
    let id = dep.id;
    if (!this.depsId.has(id)) {
      this.deps.push(dep);
      this.depsId.add(id);
      dep.addSub(this);
    }
  }
  get() {
    Dep.target = this; // 静态属性只有一份，渲染之前赋予当前watcher，让dep去记住
    this.getter();
    Dep.target = null; // 渲染完毕后清空，再渲染下一个watcher
  }
  update() {
    queueWatcher(this);
    // this.get(); // 重新渲染
  }
  run() {
    this.get();
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
