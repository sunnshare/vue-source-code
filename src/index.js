import { initMixin } from "./init";

// 将所有的方法都耦合在一起，options就是用户的选项
function Vue(options) {
  this._init(options);
}

initMixin(Vue); // 扩展了init方法

export default Vue;
