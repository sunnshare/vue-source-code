import { createElementVNode, createTextVNode } from "./vdom/index";
import { patch } from "./vdom/patch";
import Watcher from "./observe/watch";

export function initLifeCycle(Vue) {
  Vue.prototype._update = function (vnode) {
    const vm = this;
    const el = vm.$el;
    vm.$el = patch(el, vnode);
  };
  Vue.prototype._c = function () {
    return createElementVNode(this, ...arguments);
  };
  Vue.prototype._v = function () {
    return createTextVNode(this, ...arguments);
  };
  Vue.prototype._s = function (value) {
    if (typeof value !== "object") return value;
    return JSON.stringify(value);
  };
  Vue.prototype._render = function () {
    return this.$options.render.call(this);
  };
}

export function mountComponent(vm, el) {
  vm.$el = el;
  // 1.调用render 方法产生虚拟节点，虚拟DOM

  const updateComponent = () => {
    vm._update(vm._render());
  };

  new Watcher(vm, updateComponent, true); // true 用于表示它是一个渲染 Watcher

  // 2.根据虚拟DOM产生真实DOM

  // 3.插入到el元素中
}

export function callHook(vm, hook) {
  const handles = vm.$options[hook];
  if (handles) {
    handles.forEach((handles) => handles.call(vm));
  }
}
