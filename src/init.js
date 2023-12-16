import { callHook, mountComponent } from "./lifecycle";
import { initState } from "./state";
import { compileToFunction } from "./compiler/index";
import { mergeOptions } from "./utils";

export function initMixin(Vue) {
  Vue.prototype._init = function (options) {
    const vm = this;
    vm.$options = mergeOptions(this.constructor.options, options); // 将用户的选项挂载到实例上

    callHook(vm, "beforeCreate");

    initState(vm); // 初始化状态

    callHook(vm, "created");

    if (options.el) {
      vm.$mount(options.el); // 实现数据的挂载
    }
  };
  Vue.prototype.$mount = function (el) {
    const vm = this;
    el = document.querySelector(el);
    let ops = vm.$options;
    if (!ops.render) {
      let template;
      if (!ops.template && el) {
        template = el.outerHTML;
      } else {
        template = ops.template;
      }
      if (template) {
        const render = compileToFunction(template);
        ops.render = render;
      }
    }
    mountComponent(vm, el);
  };
}
