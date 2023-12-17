import { mergeOptions } from "./utils";

export function initGlobalAPI(Vue) {
  Vue.options = {
    _base: Vue,
  };
  Vue.mixin = function (mixin) {
    this.options = mergeOptions(this.options, mixin); // 将全局选项与用户选项进行合并
    return this;
  };

  // 可以手动创建组件进行挂载
  Vue.extend = function (options) {
    function Sub(options = {}) {
      this._init(options);
    }
    Sub.prototype = Object.create(Vue.prototype);
    Sub.prototype.constructor = Sub;
    Sub.options = mergeOptions(Vue.options, options);
    return Sub;
  };

  Vue.options.components = {};

  Vue.component = function (id, definition) {
    definition =
      typeof definition === "function" ? definition : Vue.extend(definition); // 如果definition不是一个函数，需要用Vue.extend包装一下
    Vue.options.components[id] = definition;
  };
}
