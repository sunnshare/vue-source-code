import { initMixin } from "./init";
import { nextTick } from "./observe/watch";
import { initLifeCycle } from "./lifecycle";
import { initGlobalAPI } from "./globalAPI";

function Vue(options) {
  this._init(options);
}

Vue.prototype.$nextTick = nextTick;

initMixin(Vue); // 扩展了init方法
initLifeCycle(Vue); // vm._update vm._render
initGlobalAPI(Vue);

export default Vue;
