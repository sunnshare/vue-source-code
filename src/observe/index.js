class Observer {
  constructor(data) {
    this.walk(data);
  }

  walk(data) {
    // 循环对象 对属性依次劫持，重新定义属性
    Object.keys(data).forEach((key) => difineReactive(data, key, data[key]));
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
      value = newValue;
    },
  });
}

export function observe(data) {
  if (typeof data !== "object" || data == null) {
    return; // 只对对象进行劫持
  }

  return new Observer(data);
}
