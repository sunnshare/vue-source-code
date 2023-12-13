import { createElementVNode, createTextVNode } from "./vdom/index";
import { patch } from "./vdom/patch";
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

  vm._update(vm._render());

  // 2.根据虚拟DOM产生真实DOM

  // 3.插入到el元素中
}
