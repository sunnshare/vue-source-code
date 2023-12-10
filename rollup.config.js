// rollup 默认可以导出一个对象 作为打包的配置文件
import babel from "rollup-plugin-babel"
export default {
  input:"./src/index.js", // 入口
  output:{
    file:"./dist/vue.js", // 出口
    name:"Vue", // global.Vue
    format:"umd", // umd works as amd, cjs and iife all in one
    sourcemap:true, // 调试源代码
  },
  plugins:[
    babel({
      exclude:"node_modules/**", // 排除第三方文件
    })
  ]
}