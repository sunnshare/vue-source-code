import { initMixin } from "./init";
import { initLifeCycle } from "./lifecycle";
import { initGlobalAPI } from "./globalAPI";
import { initStateMixin } from "./state";

function Vue(options) {
  this._init(options);
}

initMixin(Vue); // 扩展了init方法
initLifeCycle(Vue); // vm._update vm._render
initGlobalAPI(Vue); // 全局API实现
initStateMixin(Vue); // 实现了nextTick $watch

export default Vue;
