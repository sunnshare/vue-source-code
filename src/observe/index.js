import { newArrayProto } from "./array";
class Observer {
  constructor(data) {
    Object.defineProperty(data, "__ob__", {
      value: this,
      enumerable: false, // 将 __ob__ 变成不可枚举对象，循环时找不到
    });

    // data.__ob__ = this; // 数据上写__ob__保存Observer类，用于后续调用观测数组方法，防止重复观测
    if (Array.isArray(data)) {
      data.__proto__ = newArrayProto;
      this.observeArray(data);
    } else {
      this.walk(data);
    }
  }

  walk(data) {
    // 循环对象 对属性依次劫持，重新定义属性
    Object.keys(data).forEach((key) => difineReactive(data, key, data[key]));
  }

  observeArray(data) {
    data.forEach((item) => observe(item)); // 监测数组中的对象
  }
}

export function difineReactive(target, key, value) {
  observe(value); // 递归，深层属性劫持
  Object.defineProperty(target, key, {
    get() {
      return value;
    },
    set(newValue) {
      if (newValue === value) return;
      observe(newValue); // 对新值进行代理
      value = newValue;
    },
  });
}

export function observe(data) {
  if (typeof data !== "object" || data == null) {
    return; // 只对对象进行劫持
  }
  if (data.__ob__ instanceof Observer) {
    return data.__ob__;
  }

  return new Observer(data);
}
