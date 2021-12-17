### 认识 Vue3.0

#### 1.了解相关信息

> Vue3.0 正式版本发布在 2020 年 9 月份；Vue3.0 支持大多数 Vue2.0 的特性,你可以在 Vue3.0 中写 Vue2.0 的代码；Vue3.0 能够更好的支持 Typescript

#### 2.性能方面的提升

- 打包大小减少 4%
- 初次渲染增快 55%,更新渲染增快 133%
- 内存占用减少 54%
- diff 算法优化
  > Vue2.0 中的虚拟 DOM 是进行全量的对比,Vue3.0 中新增了静态标记(PatchFlag),在与上次的虚拟节点进行对比时,只对比带有 patch flag 标记的节点,并且可以通过 flag 的信息得知当前节点要对比的具体内容.
- hoistStatic 静态提升
  > Vue2.0 中无论元素是否参与更新,每次都会重写创建,然后再渲染;而在 Vue3.0 中,对于不参与更新的元素,会做静态提升,只会被创建一次,在渲染时直接复用即可.
- cachHandlers 事件侦听器缓存
  > 默认情况下 onCLick 会被视为动态绑定,所以每次都会去追踪它的变化,但是因为是同一个函数,所以没有追踪比变化,直接缓存起来复用即可
- ssr 渲染
  > 当有大量静态的内容的时候,这些内容会被当做纯字符串推进一个 buffer 里面.即使存在动态的绑定,会通过模板插值嵌入进去.这样会比通过虚拟 dom 来渲染的快上很多很多。当静态内容大到一定的量级时,会用\_createStaticVNode 方法在客户端去生成一个 static node,这些静态 node 会被直接 innerHtml,久不需要创建对象,然后根据对象渲染了.
- 使用 Proxy 代替 defineProperty 实现数据响应式

- 重写虚拟 DOM 的实现和 Tree-Shaking

&nbsp;

#### 3.新增使用特性

- Composition(组合)API

  > setup、ref、reactive、computed、watch、生命周期新写法、provide、inject 等

- 新的组件
  > Fragment --文档碎片、Teleport -- 瞬移组件的位置、Suspense -- 异步加载组件的 loading 界面等
- 其他 API 更新
  > 全局 API 的修改、将原来的全局 API 转移到应用对象、模板语法变化等

&nbsp;

#### 项目安装

首先先全局安装(升级) vue 脚手架

```js
# 安装脚手架
npm install -g @vue/cli
# 或者
yarn global add @vue/cli

# 升级脚手架
npm update -g @vue/cli
# 或者
yarn global upgrade --latest @vue/cli
```

然后进入一个空文件夹下创建项目

```js
vue create 项目名称
# 然后根据自己的需求选择想要安装的内容即可

# 若是需要使用旧版本(2.x版本),可以先全局安装一个桥接工具
npm install -g @vue/cli-init
# 然后创建2.x版本的项目
vue init webpack 项目名称
```

&nbsp;

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

&nbsp;

#### 使用 axios 进行服务请求

```js
npm install -s axios
# 或者
yarn add axios
```

1. 首先自定义配置 axios

> 在 src 文件夹中新建 utils 文件夹,并在该文件夹下创建 request.js 文件

```js
/*
 * /src/utils/request.js
 */
import axios from "axios"; // 引入axios
import { getYuanXiToken } from "./token"; // token

// 创建axios实例
const http = axios.create({
  baseURL:
    process.env.NODE_ENV === "development" ? "http://localhost:8044" : "",
  timeout: 5000, // 超时时间
});

// 请求拦截
http.interceptors.request.use(
  (config) => {
    if (getYuanXiToken()) {
      // 如果存在token,就将token加入请求头中
      config.headers = { authorization: getYuanXiToken(), ...config.headers };
    }
    return config;
  },
  (err) => {
    return Promise.reject(err);
  }
);

// 响应拦截
http.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (err) => {
    // 响应错误处理,可以通过响应状态码进行相应的操作
    if (err.response) {
      if (err.response.status === 401) {
        alert("需要登录");
      }
      return Promise.reject(err.response.data);
    }
    return Promise.reject(err.message);
  }
);

export default http;
```

2. 其次,在 src 文件夹下的 main.js 文件进行引入使用声明

```js
/**
 * /src/main.js
 */
import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import http from "./utils/request"; // 引入axios

const app = createApp(App);

// 全局挂载
app.config.globalProperties.$http = http;

app.use(store).use(router).mount("#app");
```

3. 接下来我们就可以在其他 .vue 文件中通过 Composition(组合)API 获取到该挂载实例进行使用了

```html
<template>
  <div class="home">
    <span>Home Page</span>
    <p>{{ msg }}</p>
  </div>
</template>

<script>
  import { getCurrentInstance } from "vue"; // 从vue中导入getCurrentInstance,getCurrentInstance支持访问内部组件实例。

  export default {
    name: "Home",
    components: {},
    setup() {
      const { proxy } = getCurrentInstance(); // proxy相当于一个vue2中的this(但是请不要真的把它当做this使用)
      // 调用$http进行网络请求
      proxy.$http
        .post("/api/v1/official-account", { title: "今日社死" })
        .then((res) => {
          console.log(res);
        });
      return {
        msg: "Hello",
      };
    },
  };
</script>
```
