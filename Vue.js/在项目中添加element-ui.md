[TOC]

在项目中添加 `element-ui` 插件库

- 首先，创建 Vue 项目

```
vue create project-name
```

- 接下来，`安装 element-ui 插件库`

```
vue add element

# 根据配置选项选择即可（注意选择按需引入的方式）-- Import on demand
```

- 执行上面两步后，会自动在项目 `src` 文件夹下创建 `/plugins/element.js`，我们修改这个文件

```js
import { Button, Message } from "element-ui";

// 按需引入需要使用的element-ui组件
const elementCom = [Button];

export default {
  install(Vue) {
    elementCom.forEach((element) => {
      Vue.use(element);
    });
    Vue.prototype.$message = Message; // 可以在vue页面中通过 this.$message.success('成功')的方式进行调用
  },
};
```

- 然后，我们在 `main.js` 文件中引入 `element.js` 文件

```js
import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import element from "./plugins/element.js";

Vue.config.productionTip = false;
Vue.use(element);

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
```

- 最后，我们就可以在 `.vue` 页面中直接使用引入的 `element-ui 组件`了

```js
<template>
  <div id="app">
    <div>
      <p>
        If Element is successfully added to this project, you'll see an
        <code v-text="'<el-button>'"></code>
        below
      </p>
      <el-button>el-button</el-button>
    </div>
    <HelloWorld msg="Welcome to Your Vue.js App" />
  </div>
</template>
```
