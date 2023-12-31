const strats = {};
const LIFECYCLE = ["beforeCreate", "created"];
LIFECYCLE.forEach((hook) => {
  strats[hook] = function (p, c) {
    return c ? (p ? p.concat(c) : [c]) : p;
  };
});

strats.components = function (parentVal, childVal) {
  const res = Object.create(parentVal);
  if (childVal) {
    for (let key in childVal) {
      res[key] = childVal[key]; // 返回的是构造的对象 可以拿到父亲原型上的属性，并且将儿子的都拷贝到自己身上
    }
  }
  return res;
};

export function mergeOptions(parent, child) {
  const options = {};
  for (let key in parent) {
    mergeField(key);
  }
  for (let key in child) {
    if (!parent.hasOwnProperty(key)) {
      mergeField(key);
    }
  }
  function mergeField(key) {
    // 策略模式(减少if else)
    if (strats[key]) {
      options[key] = strats[key](parent[key], child[key]);
    } else {
      options[key] = child[key] || parent[key];
    }
  }
  return options;
}
