在 Vue3.0 中,新添加了一些新的特效,其中就包括有组合式 API,Vue3.0 所提高的组合式 API 有助于使得原来分散的内容进行整合处理

#### setup --- 组件选项

setup 是一个组件选项,它将在组件创建之前被执行。它是一个存在两个参数(props 和 context)的函数，当 props 被解析,setup 函数将被作为组合式 API 的入口,它的返回内容都将被暴露给组件的其他部分(变量、计算属性、方法、生命周期钩子等等)以及组件的模板

```js
export default {
  name: "Home",
  components: {},
  setup() {
    return {};
  },
};
```
