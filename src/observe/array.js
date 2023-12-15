// 重写数组中的部分方法

let oldArrayProto = Array.prototype;
// newArrayProto.__proto__ = oldArrayProto
export let newArrayProto = Object.create(oldArrayProto);

let methods = ["push", "pop", "shift", "unshift", "reverse", "sort", "splice"]; // 改变原数组的方法

methods.forEach((method) => {
  newArrayProto[method] = function (...args) {
    const result = oldArrayProto[method].call(this, ...args); // 内部调用原来的方法，函数的劫持，切片编程

    // 对新增的对象数据再次进行劫持
    let inserted;
    let ob = this.__ob__;
    switch (method) {
      case "push":
      case "unshift":
        inserted = args;
        break;
      case "splice":
        inserted = args.slice(2);
      default:
        break;
    }
    if (inserted) {
      ob.observeArray(inserted); // 对新增的内容再次进行观测
    }
    ob.dep.notify(); // 数组变化通知对应watcher
    return result;
  };
});
