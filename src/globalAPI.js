import { mergeOptions } from "./utils";

export function initGlobalAPI(Vue) {
  Vue.options = {};
  Vue.mixin = function (mixin) {
    this.options = mergeOptions(this.options, mixin); // 将全局选项与用户选项进行合并
    return this;
  };
}
