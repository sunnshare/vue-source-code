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
    this.get(); // 重新渲染
  }
}
export default Watcher;
